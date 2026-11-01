import { supabase } from "../lib/supabase";

export const ADMIN_SETTINGS_RECORD_ID = "__admin_settings__";

export const DEFAULT_TLS = [
  "Sabbir Ahmed",
  "Tanvir Hasan",
  "Rakib Hossain",
  "Mehedi Hasan",
  "Mahmudul Hasan",
];

export const DEFAULT_TRS = [
  "Nafis Iqbal",
  "Sumon Mia",
  "Al Amin",
  "Arif Rahman",
  "Shakil Khan",
];

export interface PersistentAdminSettings {
  tlList: string[];
  trList: string[];
  selectedTl: string;
  selectedTr: string;
  logoUrl: string;
  updatedAt: number;
}

const IDB_NAME = "unity_earning_admin_db";
const IDB_STORE = "admin_settings_store";
const IDB_KEY = "persistent_admin_config";

function openAdminDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveToIndexedDB(settings: PersistentAdminSettings): Promise<void> {
  try {
    const db = await openAdminDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(settings, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.warn("IndexedDB save warning:", err);
  }
}

async function readFromIndexedDB(): Promise<PersistentAdminSettings | null> {
  try {
    const db = await openAdminDB();
    const result = await new Promise<PersistentAdminSettings | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  } catch {
    return null;
  }
}

/**
 * Read synchronous snapshot from localStorage immediately on boot
 */
export function getInitialAdminSettingsSync(): PersistentAdminSettings {
  let tlList = DEFAULT_TLS;
  let trList = DEFAULT_TRS;
  let selectedTl = DEFAULT_TLS[0];
  let selectedTr = DEFAULT_TRS[0];
  let logoUrl = "";
  let updatedAt = 0;

  if (typeof window === "undefined") {
    return { tlList, trList, selectedTl, selectedTr, logoUrl, updatedAt };
  }

  try {
    const rawTl = localStorage.getItem("saved_team_leaders");
    if (rawTl !== null) {
      const parsed = JSON.parse(rawTl);
      if (Array.isArray(parsed)) tlList = parsed;
    }

    const rawTr = localStorage.getItem("saved_team_trainers");
    if (rawTr !== null) {
      const parsed = JSON.parse(rawTr);
      if (Array.isArray(parsed)) trList = parsed;
    }

    const savedTl = localStorage.getItem("last_selected_team_leader");
    if (savedTl !== null) {
      selectedTl = savedTl;
    } else {
      selectedTl = tlList[0] || "";
    }

    const savedTr = localStorage.getItem("last_selected_team_trainer");
    if (savedTr !== null) {
      selectedTr = savedTr;
    } else {
      selectedTr = trList[0] || "";
    }

    logoUrl = localStorage.getItem("company_logo") || "";
    updatedAt = Number(localStorage.getItem("admin_settings_updated_at") || "0");
  } catch (err) {
    console.warn("Failed reading localStorage admin settings:", err);
  }

  return { tlList, trList, selectedTl, selectedTr, logoUrl, updatedAt };
}

function writeToLocalStorage(settings: PersistentAdminSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("saved_team_leaders", JSON.stringify(settings.tlList));
    localStorage.setItem("saved_team_trainers", JSON.stringify(settings.trList));
    localStorage.setItem("last_selected_team_leader", settings.selectedTl || "");
    localStorage.setItem("last_selected_team_trainer", settings.selectedTr || "");
    localStorage.setItem("admin_settings_updated_at", String(settings.updatedAt));
    if (settings.logoUrl) {
      localStorage.setItem("company_logo", settings.logoUrl);
    } else {
      localStorage.removeItem("company_logo");
    }
  } catch (err) {
    // Even if localStorage hits quota on huge images, IndexedDB + Server + Supabase still save it
    console.warn("localStorage write warning (recoverable via IndexedDB):", err);
  }
}

/**
 * Save settings permanently across localStorage + IndexedDB + Backend API + Supabase
 */
export async function savePermanentAdminSettings(
  partial: Partial<Omit<PersistentAdminSettings, "updatedAt">>
): Promise<PersistentAdminSettings> {
  const current = getInitialAdminSettingsSync();
  const idbCurrent = await readFromIndexedDB();
  const base =
    idbCurrent && idbCurrent.updatedAt >= current.updatedAt
      ? idbCurrent
      : current;

  const merged: PersistentAdminSettings = {
    tlList: partial.tlList !== undefined ? partial.tlList : base.tlList,
    trList: partial.trList !== undefined ? partial.trList : base.trList,
    selectedTl: partial.selectedTl !== undefined ? partial.selectedTl : base.selectedTl,
    selectedTr: partial.selectedTr !== undefined ? partial.selectedTr : base.selectedTr,
    logoUrl: partial.logoUrl !== undefined ? partial.logoUrl : base.logoUrl,
    updatedAt: Date.now(),
  };

  writeToLocalStorage(merged);
  await saveToIndexedDB(merged);

  // Sync to Express server disk storage (if backend running)
  try {
    await fetch("/api/admin-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
  } catch {
    // Normal if static deployment
  }

  // Sync to Supabase dedicated settings record so it persists across sessions/devices
  try {
    const encodedLists = JSON.stringify({
      tlList: merged.tlList,
      trList: merged.trList,
      selectedTl: merged.selectedTl,
      selectedTr: merged.selectedTr,
      updatedAt: merged.updatedAt,
    });
    await supabase.from("invoices").upsert({
      id: ADMIN_SETTINGS_RECORD_ID,
      name: "__ADMIN_SETTINGS__",
      email: encodedLists,
      phone: "00000000000",
      referralCode: "ADMIN",
      teamCode: "ADMIN",
      teamLeader: merged.selectedTl || "",
      teamTrainer: merged.selectedTr || "",
      cashback: "0",
      amountPaid: "0",
      paymentMethod: "Bkash",
      companyName: "Unity Earning",
      companyWebsite: "www.unityearning.com",
      transactionId: "ADMIN-CONFIG",
      date: new Date().toISOString(),
      logoUrl: merged.logoUrl || "",
    });
  } catch {
    // Ignore schema/offline warnings
  }

  return merged;
}

/**
 * Hydrate latest permanent settings from IndexedDB -> Server -> Supabase on mount
 */
export async function hydratePermanentAdminSettings(): Promise<PersistentAdminSettings> {
  const local = getInitialAdminSettingsSync();
  let best: PersistentAdminSettings = local;

  const idbData = await readFromIndexedDB();
  if (idbData && idbData.updatedAt >= best.updatedAt) {
    best = idbData;
  }

  // Check backend file store
  try {
    const res = await fetch("/api/admin-settings");
    if (res.ok) {
      const serverData = (await res.json()) as PersistentAdminSettings | null;
      if (serverData && typeof serverData.updatedAt === "number" && serverData.updatedAt > best.updatedAt) {
        best = serverData;
      }
    }
  } catch {
    // Normal on static hosting
  }

  // Check Supabase permanent settings row
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", ADMIN_SETTINGS_RECORD_ID)
      .maybeSingle();

    if (data && !error && data.email) {
      const parsed = JSON.parse(data.email);
      if (parsed && typeof parsed.updatedAt === "number" && parsed.updatedAt > best.updatedAt) {
        best = {
          tlList: Array.isArray(parsed.tlList) ? parsed.tlList : best.tlList,
          trList: Array.isArray(parsed.trList) ? parsed.trList : best.trList,
          selectedTl: typeof parsed.selectedTl === "string" ? parsed.selectedTl : best.selectedTl,
          selectedTr: typeof parsed.selectedTr === "string" ? parsed.selectedTr : best.selectedTr,
          logoUrl: typeof data.logoUrl === "string" ? data.logoUrl : best.logoUrl,
          updatedAt: parsed.updatedAt,
        };
      } else if (!best.logoUrl && typeof data.logoUrl === "string" && data.logoUrl) {
        best = { ...best, logoUrl: data.logoUrl };
      }
    }
  } catch {
    // Ignore if unreachable
  }

  writeToLocalStorage(best);
  await saveToIndexedDB(best);
  return best;
}

/**
 * Resize and optimize uploaded logo image while preserving crisp alpha transparency
 * so even 10MB PNG/JPG files save permanently without hitting browser storage limits.
 */
export function optimizeLogoImageToDataUrl(file: File, maxDim = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width <= maxDim && height <= maxDim && rawDataUrl.length < 350_000) {
            resolve(rawDataUrl);
            return;
          }
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Use PNG to preserve transparent logo backgrounds cleanly
          const optimized = canvas.toDataURL("image/png");
          resolve(optimized);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
