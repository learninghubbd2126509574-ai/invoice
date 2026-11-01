import { supabase } from "../lib/supabase";

export const ADMIN_SETTINGS_RECORD_ID = "__admin_settings__";

// Zero demo names by default — only user-added TL & TR names are ever stored or shown
export const DEFAULT_TLS: string[] = [];
export const DEFAULT_TRS: string[] = [];

const LEGACY_DEMO_TLS = new Set([
  "Sabbir Ahmed",
  "Tanvir Hasan",
  "Rakib Hossain",
  "Mehedi Hasan",
  "Mahmudul Hasan",
  "Sanjida Alam",
]);

const LEGACY_DEMO_TRS = new Set([
  "Nafis Iqbal",
  "Sumon Mia",
  "Al Amin",
  "Arif Rahman",
  "Shakil Khan",
  "Khadija Akter",
]);

export interface PersistentAdminSettings {
  tlList: string[];
  trList: string[];
  selectedTl: string;
  selectedTr: string;
  logoUrl: string;
  hasLogo?: boolean;
  demoPurgedV2?: boolean;
  updatedAt: number;
}

const IDB_NAME = "unity_earning_admin_db";
const IDB_STORE = "admin_settings_store";
const IDB_KEY = "persistent_admin_config";

let memoryCache: PersistentAdminSettings | null = null;
let hasHydratedOnce = false;
let activeHydrationPromise: Promise<PersistentAdminSettings> | null = null;

function sanitizeSettings(
  raw: Partial<PersistentAdminSettings> | null | undefined
): { settings: PersistentAdminSettings; didPurgeDemo: boolean } {
  if (!raw) {
    return {
      settings: {
        tlList: [],
        trList: [],
        selectedTl: "",
        selectedTr: "",
        logoUrl: "",
        hasLogo: false,
        demoPurgedV2: true,
        updatedAt: 0,
      },
      didPurgeDemo: false,
    };
  }

  let tlList = Array.isArray(raw.tlList)
    ? Array.from(new Set(raw.tlList.map((s) => String(s).trim()).filter(Boolean)))
    : [];
  let trList = Array.isArray(raw.trList)
    ? Array.from(new Set(raw.trList.map((s) => String(s).trim()).filter(Boolean)))
    : [];
  let selectedTl = typeof raw.selectedTl === "string" ? raw.selectedTl.trim() : "";
  let selectedTr = typeof raw.selectedTr === "string" ? raw.selectedTr.trim() : "";
  const logoUrl = typeof raw.logoUrl === "string" ? raw.logoUrl : "";
  const hasLogo = typeof raw.hasLogo === "boolean" ? raw.hasLogo : Boolean(logoUrl);
  const updatedAt = typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt) ? raw.updatedAt : 0;

  let didPurgeDemo = false;
  if (!raw.demoPurgedV2) {
    const filteredTls = tlList.filter((name) => !LEGACY_DEMO_TLS.has(name));
    const filteredTrs = trList.filter((name) => !LEGACY_DEMO_TRS.has(name));
    if (filteredTls.length !== tlList.length || filteredTrs.length !== trList.length) {
      didPurgeDemo = true;
    }
    tlList = filteredTls;
    trList = filteredTrs;
    if (selectedTl && LEGACY_DEMO_TLS.has(selectedTl)) {
      selectedTl = tlList[0] || "";
      didPurgeDemo = true;
    }
    if (selectedTr && LEGACY_DEMO_TRS.has(selectedTr)) {
      selectedTr = trList[0] || "";
      didPurgeDemo = true;
    }
  }

  if (selectedTl && !tlList.includes(selectedTl)) {
    selectedTl = tlList[0] || "";
  }
  if (selectedTr && !trList.includes(selectedTr)) {
    selectedTr = trList[0] || "";
  }

  return {
    settings: {
      tlList,
      trList,
      selectedTl,
      selectedTr,
      logoUrl,
      hasLogo,
      demoPurgedV2: true,
      updatedAt,
    },
    didPurgeDemo,
  };
}

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
 * Read synchronous snapshot from memoryCache or localStorage immediately on boot
 */
export function getInitialAdminSettingsSync(): PersistentAdminSettings {
  if (memoryCache) {
    return memoryCache;
  }

  if (typeof window === "undefined") {
    return sanitizeSettings(null).settings;
  }

  try {
    const rawTl = localStorage.getItem("saved_team_leaders");
    const rawTr = localStorage.getItem("saved_team_trainers");
    const savedTl = localStorage.getItem("last_selected_team_leader");
    const savedTr = localStorage.getItem("last_selected_team_trainer");
    const logoUrl = localStorage.getItem("company_logo") || "";
    const hasLogoRaw = localStorage.getItem("admin_settings_has_logo");
    const demoPurgedV2 = localStorage.getItem("admin_settings_demo_purged_v2") === "true";
    const updatedAt = Number(localStorage.getItem("admin_settings_updated_at") || "0");

    const parsedTl = rawTl !== null ? JSON.parse(rawTl) : [];
    const parsedTr = rawTr !== null ? JSON.parse(rawTr) : [];

    const { settings, didPurgeDemo } = sanitizeSettings({
      tlList: Array.isArray(parsedTl) ? parsedTl : [],
      trList: Array.isArray(parsedTr) ? parsedTr : [],
      selectedTl: savedTl ?? "",
      selectedTr: savedTr ?? "",
      logoUrl,
      hasLogo: hasLogoRaw !== null ? hasLogoRaw === "true" : Boolean(logoUrl),
      demoPurgedV2,
      updatedAt,
    });

    if (didPurgeDemo) {
      writeToLocalStorage(settings);
    }
    return settings;
  } catch (err) {
    console.warn("Failed reading localStorage admin settings:", err);
    return sanitizeSettings(null).settings;
  }
}

function writeToLocalStorage(settings: PersistentAdminSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("saved_team_leaders", JSON.stringify(settings.tlList));
    localStorage.setItem("saved_team_trainers", JSON.stringify(settings.trList));
    localStorage.setItem("last_selected_team_leader", settings.selectedTl || "");
    localStorage.setItem("last_selected_team_trainer", settings.selectedTr || "");
    localStorage.setItem("admin_settings_updated_at", String(settings.updatedAt));
    localStorage.setItem("admin_settings_has_logo", settings.hasLogo ? "true" : "false");
    localStorage.setItem("admin_settings_demo_purged_v2", "true");
  } catch (err) {
    console.warn("localStorage metadata write warning:", err);
  }

  try {
    if (settings.logoUrl) {
      localStorage.setItem("company_logo", settings.logoUrl);
    } else {
      localStorage.removeItem("company_logo");
    }
  } catch (err) {
    // Even if localStorage hits quota on large images, IndexedDB + Backend + Supabase retain logoUrl
    console.warn("localStorage logo write warning (recoverable via IndexedDB/Supabase):", err);
  }
}

async function syncSettingsToRemote(settings: PersistentAdminSettings): Promise<void> {
  const encodedMeta = JSON.stringify({
    tlList: settings.tlList,
    trList: settings.trList,
    selectedTl: settings.selectedTl,
    selectedTr: settings.selectedTr,
    hasLogo: Boolean(settings.logoUrl),
    demoPurgedV2: true,
    updatedAt: settings.updatedAt,
  });

  // 1. Direct Supabase upsert to permanent __admin_settings__ row
  const supabasePromise = (async () => {
    try {
      const { error } = await supabase.from("invoices").upsert({
        id: ADMIN_SETTINGS_RECORD_ID,
        name: "__ADMIN_SETTINGS__",
        email: encodedMeta,
        phone: "00000000000",
        referralCode: "ADMIN",
        teamCode: "ADMIN",
        teamLeader: settings.selectedTl || "",
        teamTrainer: settings.selectedTr || "",
        cashback: "0",
        amountPaid: "0",
        paymentMethod: "Bkash",
        companyName: "Unity Earning",
        companyWebsite: "www.unityearning.com",
        transactionId: "ADMIN-CONFIG",
        date: new Date().toISOString(),
        logoUrl: settings.logoUrl || "",
      });
      if (error) {
        console.warn("Supabase admin settings upsert error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase admin settings network warning:", err);
    }
  })();

  // 2. Backend API sync (also persists to Supabase + disk on server)
  const backendPromise = (async () => {
    try {
      await fetch("/api/admin-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch {
      // Normal on static deployment
    }
  })();

  await Promise.all([supabasePromise, backendPromise]);
}

/**
 * Save settings permanently across localStorage + IndexedDB + Supabase + Backend API.
 * Always hydrates from cloud first if this browser tab hasn't hydrated yet, preventing cold-tab overwrites.
 */
export async function savePermanentAdminSettings(
  partial: Partial<Omit<PersistentAdminSettings, "updatedAt">>
): Promise<PersistentAdminSettings> {
  if (!hasHydratedOnce) {
    try {
      await hydratePermanentAdminSettings();
    } catch {
      // Continue with local state if offline
    }
  }

  const base = memoryCache || getInitialAdminSettingsSync();

  const nextTlList =
    partial.tlList !== undefined
      ? Array.from(new Set(partial.tlList.map((s) => s.trim()).filter(Boolean)))
      : base.tlList;
  const nextTrList =
    partial.trList !== undefined
      ? Array.from(new Set(partial.trList.map((s) => s.trim()).filter(Boolean)))
      : base.trList;

  let nextSelectedTl = partial.selectedTl !== undefined ? partial.selectedTl.trim() : base.selectedTl;
  let nextSelectedTr = partial.selectedTr !== undefined ? partial.selectedTr.trim() : base.selectedTr;

  if (nextSelectedTl && !nextTlList.includes(nextSelectedTl)) {
    nextSelectedTl = nextTlList[0] || "";
  }
  if (nextSelectedTr && !nextTrList.includes(nextSelectedTr)) {
    nextSelectedTr = nextTrList[0] || "";
  }

  const nextLogoUrl = partial.logoUrl !== undefined ? partial.logoUrl : base.logoUrl;

  const merged: PersistentAdminSettings = {
    tlList: nextTlList,
    trList: nextTrList,
    selectedTl: nextSelectedTl,
    selectedTr: nextSelectedTr,
    logoUrl: nextLogoUrl,
    hasLogo: Boolean(nextLogoUrl),
    demoPurgedV2: true,
    updatedAt: Date.now(),
  };

  memoryCache = merged;
  writeToLocalStorage(merged);
  await saveToIndexedDB(merged);
  await syncSettingsToRemote(merged);

  return merged;
}

/**
 * Hydrate latest permanent settings from Local -> IndexedDB -> Backend -> Supabase on mount.
 * Never overwrites newer cloud records with cold/empty local defaults.
 */
export async function hydratePermanentAdminSettings(): Promise<PersistentAdminSettings> {
  if (activeHydrationPromise) {
    return activeHydrationPromise;
  }

  activeHydrationPromise = (async () => {
    try {
      const local = getInitialAdminSettingsSync();
      const candidates: PersistentAdminSettings[] = [local];
      let cloudHadLegacyDemo = false;
      let maxRemoteUpdatedAt = 0;

      // 1. Read IndexedDB
      const rawIdb = await readFromIndexedDB();
      if (rawIdb) {
        const { settings: idbClean } = sanitizeSettings(rawIdb);
        candidates.push(idbClean);
      }

      // 2. Read Backend API
      try {
        const res = await fetch("/api/admin-settings");
        if (res.ok) {
          const rawServer = (await res.json()) as Partial<PersistentAdminSettings> | null;
          if (rawServer) {
            const { settings: serverClean, didPurgeDemo } = sanitizeSettings(rawServer);
            if (didPurgeDemo) cloudHadLegacyDemo = true;
            if (serverClean.updatedAt > maxRemoteUpdatedAt) {
              maxRemoteUpdatedAt = serverClean.updatedAt;
            }
            candidates.push(serverClean);
          }
        }
      } catch {
        // Normal on static hosting
      }

      // 3. Read Supabase permanent __admin_settings__ row directly
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", ADMIN_SETTINGS_RECORD_ID)
          .maybeSingle();

        if (data && !error) {
          let parsedEmail: any = {};
          if (typeof data.email === "string" && data.email.trim().startsWith("{")) {
            try {
              parsedEmail = JSON.parse(data.email);
            } catch {
              parsedEmail = {};
            }
          }
          const rawSupabase: Partial<PersistentAdminSettings> = {
            tlList: Array.isArray(parsedEmail.tlList) ? parsedEmail.tlList : [],
            trList: Array.isArray(parsedEmail.trList) ? parsedEmail.trList : [],
            selectedTl:
              typeof parsedEmail.selectedTl === "string"
                ? parsedEmail.selectedTl
                : typeof data.teamLeader === "string"
                ? data.teamLeader
                : "",
            selectedTr:
              typeof parsedEmail.selectedTr === "string"
                ? parsedEmail.selectedTr
                : typeof data.teamTrainer === "string"
                ? data.teamTrainer
                : "",
            logoUrl: typeof data.logoUrl === "string" ? data.logoUrl : "",
            hasLogo:
              typeof parsedEmail.hasLogo === "boolean"
                ? parsedEmail.hasLogo
                : Boolean(data.logoUrl),
            demoPurgedV2: Boolean(parsedEmail.demoPurgedV2),
            updatedAt: typeof parsedEmail.updatedAt === "number" ? parsedEmail.updatedAt : 1,
          };

          const { settings: sbClean, didPurgeDemo } = sanitizeSettings(rawSupabase);
          if (didPurgeDemo) cloudHadLegacyDemo = true;
          if (sbClean.updatedAt > maxRemoteUpdatedAt) {
            maxRemoteUpdatedAt = sbClean.updatedAt;
          }
          candidates.push(sbClean);
        }
      } catch (err) {
        console.warn("Supabase hydration fetch warning:", err);
      }

      // Pick candidate with highest updatedAt (preferring later candidates i.e. cloud on ties)
      let best = candidates[0];
      for (let i = 1; i < candidates.length; i++) {
        if (candidates[i].updatedAt >= best.updatedAt) {
          best = candidates[i];
        }
      }

      // Recover logoUrl if winning candidate dropped base64 string (e.g. localStorage quota) while hasLogo is true
      if (!best.logoUrl && best.hasLogo !== false) {
        for (let i = candidates.length - 1; i >= 0; i--) {
          if (candidates[i].logoUrl) {
            best = { ...best, logoUrl: candidates[i].logoUrl, hasLogo: true };
            break;
          }
        }
      }

      memoryCache = best;
      hasHydratedOnce = true;
      writeToLocalStorage(best);
      await saveToIndexedDB(best);

      // Self-heal remote database if legacy demo names were cleaned up OR if local explicit save is newer than cloud
      if (cloudHadLegacyDemo || (best.updatedAt > 0 && best.updatedAt > maxRemoteUpdatedAt)) {
        const healed: PersistentAdminSettings = cloudHadLegacyDemo
          ? { ...best, updatedAt: Math.max(Date.now(), best.updatedAt + 1) }
          : best;
        memoryCache = healed;
        writeToLocalStorage(healed);
        await saveToIndexedDB(healed);
        await syncSettingsToRemote(healed);
      }

      return memoryCache;
    } finally {
      activeHydrationPromise = null;
    }
  })();

  return activeHydrationPromise;
}

/**
 * Resize and optimize uploaded logo image while preserving crisp alpha transparency
 * so PNG/WebP/JPG files save swiftly and permanently across Supabase, IndexedDB, and localStorage.
 */
export function optimizeLogoImageToDataUrl(file: File, maxDim = 400): Promise<string> {
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
          if (width <= maxDim && height <= maxDim && rawDataUrl.length < 180_000) {
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

          // Prefer lossless-alpha high-quality WebP for compact DB storage, fallback to PNG
          const webpUrl = canvas.toDataURL("image/webp", 0.92);
          if (webpUrl.startsWith("data:image/webp") && webpUrl.length < 300_000) {
            resolve(webpUrl);
            return;
          }
          const pngUrl = canvas.toDataURL("image/png");
          resolve(pngUrl);
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
