// Prevent unhandled promise rejections or exceptions from crashing the server
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = 3000;

// Body parsing with higher limits for base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// --- SUPABASE INITIALIZATION ---
let supabase: any = null;
let supabaseInitialized = false;

const supabaseUrl = process.env.SUPABASE_URL || "https://yxtnoaaqefgkflrkzcfy.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dG5vYWFxZWZna2Zscmt6Y2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTczNjYsImV4cCI6MjEwNTQ5MzM2Nn0.Cy2CKI2izgiWFHxhBB4_5eBJWmowokBiat5lnbsfV2M";

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabaseInitialized = true;
    console.log("Supabase client initialized successfully on backend with URL:", supabaseUrl);
  } catch (e) {
    console.error("Error initializing Supabase client:", e);
  }
} else {
  console.warn("Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) not found. Falling back to memory storage.");
}

// In-memory fallback database for robustness
const memoryDb: Record<string, any> = {};

// --- GEMINI INITIALIZATION ---
let ai: any = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Gemini API initialized on backend.");
} else {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

// --- API ENDPOINTS ---

// Health Check & Database Status
app.get("/api/health", async (req, res) => {
  let tableStatus = "untested";
  let tableError: any = null;
  if (supabaseInitialized && supabase) {
    try {
      const { error } = await supabase.from("invoices").select("id").limit(1);
      if (error) {
        tableStatus = "table_error";
        tableError = error.message;
      } else {
        tableStatus = "ready";
      }
    } catch (err: any) {
      tableStatus = "query_failed";
      tableError = err.message;
    }
  }

  res.json({
    status: "ok",
    supabase: supabaseInitialized ? "connected" : "fallback",
    supabaseTable: tableStatus,
    tableError,
    gemini: !!ai ? "enabled" : "disabled",
  });
});

// Parse User Details from Image/Screenshot using Gemini Vision
app.post("/api/parse-details-image", async (req, res) => {
  try {
    const { image } = req.body; // Expects base64 data string (could have data prefix)
    if (!image) {
      return res.status(400).json({ error: "Missing image base64 data" });
    }

    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured on the server." });
    }

    // Strip out base64 prefixes if present
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    // Extract mime type if present, default to image/png
    let mimeType = "image/png";
    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }

    console.log(`Parsing image with type: ${mimeType}`);

    const promptText = `
You are an expert OCR and data extraction agent. 
The image provided is a screenshot of text details, or contains registration details of a user.
Please extract the following fields if they exist in the text in the image:
- Name
- Email
- Phone
- Referral Code
- Balance

Format the result strictly as a raw JSON object with the following schema:
{
  "name": "extracted name or empty string if not found",
  "email": "extracted email or empty string if not found",
  "phone": "extracted phone number or empty string if not found",
  "referralCode": "extracted referral code or empty string if not found",
  "balance": "extracted balance or empty string if not found"
}

IMPORTANT: Do not return any formatting like markdown blocks (e.g. do NOT use \`\`\`json). Just return the raw JSON string.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    console.log("Gemini parse response:", resultText);
    
    // Parse response
    const parsedData = JSON.parse(resultText.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in parse-details-image endpoint:", error);
    return res.status(500).json({
      error: "Failed to parse image details",
      details: error.message || error,
    });
  }
});

// Create/Save Invoice
app.post("/api/invoices", async (req, res) => {
  try {
    const invoiceData = req.body;
    const invoiceId = invoiceData.id || "inv_" + Math.random().toString(36).substring(2, 15);
    
    // Add server timestamp if not present
    const dataToSave = {
      ...invoiceData,
      id: invoiceId,
      createdAt: new Date().toISOString(),
    };

    let savedToSupabase = false;
    let supabaseErrorMessage: string | null = null;

    if (supabaseInitialized && supabase) {
      try {
        // Attempt 1: Try saving with all payload fields
        let res = await supabase
          .from("invoices")
          .upsert(dataToSave);
        
        // If a column is missing from the Supabase schema (e.g. avatarUrl or custom field)
        if (res.error && (res.error.code === "PGRST204" || res.error.message?.includes("Could not find the"))) {
          console.warn("Supabase schema column missing, stripping unmatched column and retrying...", res.error.message);
          const sanitizedPayload = { ...dataToSave };
          // Extract the column name if possible, or strip known optional columns
          const match = res.error.message.match(/Could not find the '([^']+)' column/);
          if (match && match[1]) {
            delete sanitizedPayload[match[1]];
          } else {
            delete sanitizedPayload.avatarUrl;
          }
          res = await supabase
            .from("invoices")
            .upsert(sanitizedPayload);
        }

        if (res.error) {
          throw res.error;
        }
        console.log(`Saved invoice ${invoiceId} to Supabase.`);
        savedToSupabase = true;
      } catch (supabaseError: any) {
        supabaseErrorMessage = supabaseError?.message || JSON.stringify(supabaseError);
        console.error("Supabase save failed, falling back to memory:", supabaseError);
      }
    }

    // Always persist to in-memory fallback for local persistence and resiliency
    memoryDb[invoiceId] = dataToSave;
    console.log(`Saved invoice ${invoiceId} to in-memory store. (Supabase save status: ${savedToSupabase})`);

    return res.json({ success: true, id: invoiceId, fallback: !savedToSupabase, supabaseError: supabaseErrorMessage });
  } catch (error: any) {
    console.error("Error saving invoice:", error);
    return res.status(500).json({ error: "Failed to save invoice", details: error.message });
  }
});

// Retrieve Invoice
app.get("/api/invoices/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (supabaseInitialized && supabase) {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (data && !error) {
          console.log(`Retrieved invoice ${id} from Supabase.`);
          return res.json(data);
        }
      } catch (supabaseError: any) {
        console.error("Supabase retrieve failed, falling back to memory:", supabaseError);
      }
    }

    // Fallback to memory
    if (memoryDb[id]) {
      console.log(`Retrieved invoice ${id} from in-memory store.`);
      return res.json(memoryDb[id]);
    }

    return res.status(404).json({ error: "Invoice not found in database or memory fallback." });
  } catch (error: any) {
    console.error("Error retrieving invoice:", error);
    return res.status(500).json({ error: "Failed to retrieve invoice", details: error.message });
  }
});

// Clear Database Endpoint
app.post("/api/clear-database", async (req, res) => {
  try {
    let clearedSupabaseCount = 0;
    if (supabaseInitialized && supabase) {
      try {
        // Delete all rows from invoices table (where id is not empty)
        const { error, data } = await supabase
          .from("invoices")
          .delete()
          .neq("id", "0");

        if (error) {
          throw error;
        }
        console.log("Cleared documents from Supabase.");
        clearedSupabaseCount = 1; // Mark as successfully cleared
      } catch (supabaseError: any) {
        console.error("Supabase clear failed:", supabaseError);
        throw new Error(`Supabase clear failed: ${supabaseError.message}`);
      }
    }

    // Clear memory database
    const memoryKeys = Object.keys(memoryDb);
    memoryKeys.forEach((key) => {
      delete memoryDb[key];
    });
    console.log(`Cleared ${memoryKeys.length} items from memory store.`);

    return res.json({
      success: true,
      message: "Database cleared successfully.",
      clearedSupabaseCount,
      clearedMemoryCount: memoryKeys.length
    });
  } catch (error: any) {
    console.error("Error clearing database:", error);
    return res.status(500).json({ error: "Failed to clear database", details: error.message });
  }
});

// --- VITE DEV SERVER / PRODUCTION SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
