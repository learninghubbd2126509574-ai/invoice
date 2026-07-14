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
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

const app = express();
const PORT = 3000;

// Body parsing with higher limits for base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// --- FIREBASE INITIALIZATION ---
let db: any = null;
let firebaseInitialized = false;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    firebaseInitialized = true;
    console.log(`Firebase initialized successfully on backend with database: ${firebaseConfig.firestoreDatabaseId}`);
  } else {
    console.warn("Firebase config not found. Falling back to memory storage.");
  }
} catch (e) {
  console.error("Error initializing Firebase. Falling back to memory storage.", e);
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

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    firebase: firebaseInitialized ? "connected" : "fallback",
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

    let savedToFirestore = false;

    if (firebaseInitialized && db) {
      try {
        // Save to Firebase Firestore under collection 'invoices'
        await setDoc(doc(db, "invoices", invoiceId), dataToSave);
        console.log(`Saved invoice ${invoiceId} to Firestore.`);
        savedToFirestore = true;
      } catch (firestoreError: any) {
        console.error("Firestore save failed, falling back to memory:", firestoreError);
      }
    }

    // Always persist to in-memory fallback for local persistence and resiliency
    memoryDb[invoiceId] = dataToSave;
    console.log(`Saved invoice ${invoiceId} to in-memory store. (Firestore save status: ${savedToFirestore})`);

    return res.json({ success: true, id: invoiceId, fallback: !savedToFirestore });
  } catch (error: any) {
    console.error("Error saving invoice:", error);
    return res.status(500).json({ error: "Failed to save invoice", details: error.message });
  }
});

// Retrieve Invoice
app.get("/api/invoices/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (firebaseInitialized && db) {
      try {
        const docRef = doc(db, "invoices", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(`Retrieved invoice ${id} from Firestore.`);
          return res.json(docSnap.data());
        }
      } catch (firestoreError: any) {
        console.error("Firestore retrieve failed, falling back to memory:", firestoreError);
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
    let clearedFirestoreCount = 0;
    if (firebaseInitialized && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const deletePromises: Promise<any>[] = [];
        querySnapshot.forEach((document) => {
          deletePromises.push(deleteDoc(doc(db, "invoices", document.id)));
          clearedFirestoreCount++;
        });
        await Promise.all(deletePromises);
        console.log(`Cleared ${clearedFirestoreCount} documents from Firestore.`);
      } catch (firestoreError: any) {
        console.error("Firestore clear failed:", firestoreError);
        throw new Error(`Firestore clear failed: ${firestoreError.message}`);
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
      clearedFirestoreCount,
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
