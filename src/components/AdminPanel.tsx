import React, { useState, useRef, useEffect } from "react";
import { InvoiceData } from "../types";
import { getTodayFormattedDate } from "../utils/dateUtils";
import {
  getInitialAdminSettingsSync,
  hydratePermanentAdminSettings,
  savePermanentAdminSettings,
  optimizeLogoImageToDataUrl,
} from "../utils/adminStorage";
import {
  Upload,
  Sparkles,
  Check,
  Copy,
  Download,
  RefreshCw,
  FileText,
  Users,
  UserCheck,
  UserPlus,
  Plus,
  Trash2,
  Calendar,
  X,
  Award,
  ExternalLink,
  ClipboardPaste,
} from "lucide-react";
import { toPng } from "html-to-image";

interface AdminPanelProps {
  initialData: InvoiceData;
  onChange: React.Dispatch<React.SetStateAction<InvoiceData>>;
  onSave: () => Promise<string>;
  isSaving: boolean;
  generatedId: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  initialData,
  onChange,
  onSave,
  isSaving,
  generatedId,
}) => {
  const [pasteText, setPasteText] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const pasteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // TL & TR Management Modal State
  const [showTlTrModal, setShowTlTrModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"tl" | "tr">("tl");
  const [newTlInput, setNewTlInput] = useState("");
  const [newTrInput, setNewTrInput] = useState("");
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const [confirmClearType, setConfirmClearType] = useState<"tl" | "tr" | null>(null);

  // Load permanent TL & TR lists synchronously on boot (empty until user adds names)
  const [tlList, setTlList] = useState<string[]>(() => getInitialAdminSettingsSync().tlList);
  const [trList, setTrList] = useState<string[]>(() => getInitialAdminSettingsSync().trList);

  const flashSaveNotice = (msg: string) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(null), 2600);
  };

  // Hydrate from IndexedDB / Server / Supabase on mount so saved names & logo never disappear
  useEffect(() => {
    let active = true;
    hydratePermanentAdminSettings().then((persisted) => {
      if (!active) return;
      setTlList(persisted.tlList);
      setTrList(persisted.trList);

      const nextTl =
        persisted.selectedTl && persisted.tlList.includes(persisted.selectedTl)
          ? persisted.selectedTl
          : persisted.tlList[0] || "";
      const nextTr =
        persisted.selectedTr && persisted.trList.includes(persisted.selectedTr)
          ? persisted.selectedTr
          : persisted.trList[0] || "";
      const nextLogo = persisted.logoUrl || "";

      onChange((prev) => ({
        ...prev,
        teamLeader: nextTl,
        teamTrainer: nextTr,
        logoUrl: nextLogo,
      }));
    });
    return () => {
      active = false;
    };
  }, [onChange]);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Switch active TL
  const handleSelectTl = (tlName: string) => {
    onChange((prev) => ({ ...prev, teamLeader: tlName }));
    void savePermanentAdminSettings({ tlList, selectedTl: tlName });
  };

  // Switch active TR
  const handleSelectTr = (trName: string) => {
    onChange((prev) => ({ ...prev, teamTrainer: trName }));
    void savePermanentAdminSettings({ trList, selectedTr: trName });
  };

  // Add & Permanently Save new TL
  const handleAddTl = async () => {
    const trimmed = newTlInput.trim();
    if (!trimmed) return;
    const updated = tlList.includes(trimmed) ? tlList : [...tlList, trimmed];
    setTlList(updated);
    setNewTlInput("");
    onChange((prev) => ({ ...prev, teamLeader: trimmed }));
    await savePermanentAdminSettings({ tlList: updated, selectedTl: trimmed });
    flashSaveNotice(`টিম লিডার "${trimmed}" স্থায়ীভাবে ডাটাবেজে সেভ হয়েছে!`);
  };

  // Delete TL (Only when admin explicitly clicks Delete)
  const handleDeleteTl = async (nameToDelete: string) => {
    const updated = tlList.filter((item) => item !== nameToDelete);
    setTlList(updated);
    const nextTl = initialData.teamLeader === nameToDelete ? updated[0] || "" : initialData.teamLeader || "";
    onChange((prev) => ({ ...prev, teamLeader: nextTl }));
    await savePermanentAdminSettings({ tlList: updated, selectedTl: nextTl });
    flashSaveNotice(`"${nameToDelete}" তালিকা থেকে ডিলিট করা হয়েছে`);
  };

  // Clear All TLs (Only when admin explicitly confirms Clear All)
  const handleClearAllTls = async () => {
    setTlList([]);
    setConfirmClearType(null);
    onChange((prev) => ({ ...prev, teamLeader: "" }));
    await savePermanentAdminSettings({ tlList: [], selectedTl: "" });
    flashSaveNotice("সকল টিম লিডারের নাম ক্লিয়ার করা হয়েছে");
  };

  // Add & Permanently Save new TR
  const handleAddTr = async () => {
    const trimmed = newTrInput.trim();
    if (!trimmed) return;
    const updated = trList.includes(trimmed) ? trList : [...trList, trimmed];
    setTrList(updated);
    setNewTrInput("");
    onChange((prev) => ({ ...prev, teamTrainer: trimmed }));
    await savePermanentAdminSettings({ trList: updated, selectedTr: trimmed });
    flashSaveNotice(`টিম ট্রেনার "${trimmed}" স্থায়ীভাবে ডাটাবেজে সেভ হয়েছে!`);
  };

  // Delete TR (Only when admin explicitly clicks Delete)
  const handleDeleteTr = async (nameToDelete: string) => {
    const updated = trList.filter((item) => item !== nameToDelete);
    setTrList(updated);
    const nextTr = initialData.teamTrainer === nameToDelete ? updated[0] || "" : initialData.teamTrainer || "";
    onChange((prev) => ({ ...prev, teamTrainer: nextTr }));
    await savePermanentAdminSettings({ trList: updated, selectedTr: nextTr });
    flashSaveNotice(`"${nameToDelete}" তালিকা থেকে ডিলিট করা হয়েছে`);
  };

  // Clear All TRs (Only when admin explicitly confirms Clear All)
  const handleClearAllTrs = async () => {
    setTrList([]);
    setConfirmClearType(null);
    onChange((prev) => ({ ...prev, teamTrainer: "" }));
    await savePermanentAdminSettings({ trList: [], selectedTr: "" });
    flashSaveNotice("সকল টিম ট্রেনারের নাম ক্লিয়ার করা হয়েছে");
  };

  // Save any pending input & close modal
  const handleSaveAndCloseModal = async () => {
    let nextTlList = tlList;
    let nextTrList = trList;
    let nextSelectedTl = initialData.teamLeader || "";
    let nextSelectedTr = initialData.teamTrainer || "";

    if (newTlInput.trim()) {
      const t = newTlInput.trim();
      if (!nextTlList.includes(t)) nextTlList = [...nextTlList, t];
      nextSelectedTl = t;
      setTlList(nextTlList);
      setNewTlInput("");
    }
    if (newTrInput.trim()) {
      const r = newTrInput.trim();
      if (!nextTrList.includes(r)) nextTrList = [...nextTrList, r];
      nextSelectedTr = r;
      setTrList(nextTrList);
      setNewTrInput("");
    }

    onChange((prev) => ({
      ...prev,
      teamLeader: nextSelectedTl,
      teamTrainer: nextSelectedTr,
    }));
    setShowTlTrModal(false);
    setConfirmClearType(null);
    await savePermanentAdminSettings({
      tlList: nextTlList,
      trList: nextTrList,
      selectedTl: nextSelectedTl,
      selectedTr: nextSelectedTr,
    });
  };

  // Real-time automatic parsing on paste or type
  const handleTextChange = (text: string) => {
    setPasteText(text);
    setParseError(null);
    if (!text.trim()) {
      setParseSuccess(false);
      return;
    }

    try {
      const nameMatch = text.match(/(?:Name|নাম)\s*[:：-]?\s*(.*)/i);
      const emailMatch = text.match(/(?:Email|ইমেইল)\s*[:：-]?\s*(.*)/i);
      const phoneMatch = text.match(/(?:Phone|মোবাইল|ফোন)\s*[:：-]?\s*(.*)/i);
      const refMatch = text.match(/(?:Student\s*ID|Referral\s*Code|Ref\.?\s*ID|রেফার|স্টুডেন্ট\s*আইডি)\s*[:：-]?\s*(.*)/i);
      const teamMatch = text.match(/(?:Team\s*Code|টিম\s*কোড)\s*[:：-]?\s*(.*)/i);
      const tlMatch = text.match(/(?:Team\s*Leader|TL|টিম\s*লিডার|Leader|লিডার)\s*[:：-]?\s*(.*)/i);
      const trMatch = text.match(/(?:Team\s*Trainer|TR|টিম\s*ট্রেনার|Trainer|ট্রেনার)\s*[:：-]?\s*(.*)/i);
      const cashbackMatch = text.match(/(?:Cashback|ক্যাশব্যাক)\s*[:：-]?\s*(.*)/i);
      const amountMatch = text.match(/(?:Amount\s*Paid|পেমেন্ট|টাকা)\s*[:：-]?\s*(.*)/i);
      const dateMatch = text.match(/(?:Date|তারিখ)\s*[:：-]?\s*(.*)/i);

      const parsed: Partial<InvoiceData> = {};
      if (nameMatch) parsed.name = nameMatch[1].trim();
      if (emailMatch) parsed.email = emailMatch[1].trim();
      if (phoneMatch) parsed.phone = phoneMatch[1].trim();
      if (refMatch) parsed.referralCode = refMatch[1].trim();
      if (teamMatch) parsed.teamCode = teamMatch[1].trim();

      let updatedTlList = tlList;
      let updatedTrList = trList;

      if (tlMatch) {
        const parsedTl = tlMatch[1].trim();
        parsed.teamLeader = parsedTl;
        if (parsedTl && !updatedTlList.includes(parsedTl)) {
          updatedTlList = [...updatedTlList, parsedTl];
          setTlList(updatedTlList);
        }
      }
      if (trMatch) {
        const parsedTr = trMatch[1].trim();
        parsed.teamTrainer = parsedTr;
        if (parsedTr && !updatedTrList.includes(parsedTr)) {
          updatedTrList = [...updatedTrList, parsedTr];
          setTrList(updatedTrList);
        }
      }
      if (cashbackMatch) parsed.cashback = cashbackMatch[1].trim();
      if (amountMatch) parsed.amountPaid = amountMatch[1].trim();
      if (dateMatch) parsed.date = dateMatch[1].trim();

      if (Object.keys(parsed).length > 0) {
        const finalTl = parsed.teamLeader || initialData.teamLeader || "";
        const finalTr = parsed.teamTrainer || initialData.teamTrainer || "";
        onChange((prev) => ({
          ...prev,
          teamTrainer: finalTr,
          teamLeader: finalTl,
          ...parsed,
        }));
        if (parsed.teamLeader || parsed.teamTrainer) {
          void savePermanentAdminSettings({
            tlList: updatedTlList,
            trList: updatedTrList,
            selectedTl: finalTl,
            selectedTr: finalTr,
          });
        }
        setParseSuccess(true);
      } else {
        setParseSuccess(false);
      }
    } catch (err: any) {
      setParseError("পার্সিং ত্রুটি হয়েছে!");
      setParseSuccess(false);
    }
  };

  // One-click paste from clipboard
  const handlePasteFromClipboard = async () => {
    setParseError(null);
    // Focus textarea immediately to prepare for paste
    pasteTextareaRef.current?.focus();

    if (navigator?.clipboard?.readText) {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          handleTextChange(text);
          return;
        } else {
          setParseError("ক্লিপবোর্ডে কোনো কপি করা টেক্সট পাওয়া যায়নি! আগে মেসেজ কপি করুন।");
          return;
        }
      } catch {
        // Fallback if browser Permissions-Policy restricts readText in iframe
        setParseError("ব্রাউজার সিকিউরিটির কারণে বক্সে কার্সার সেট করা হয়েছে। বক্সে সরাসরি Ctrl+V বা মোবাইলে Paste চাপুন।");
        return;
      }
    } else {
      setParseError("বক্সে কার্সার সেট করা হয়েছে। দয়া করে সরাসরি পেস্ট (Ctrl+V) করুন।");
    }
  };

  // Clear parsed textarea
  const handleClearPasteText = () => {
    setPasteText("");
    setParseSuccess(false);
    setParseError(null);
  };

  // Handle permanent logo upload (stays saved forever until explicitly deleted)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimizedLogo = await optimizeLogoImageToDataUrl(file, 400);
      onChange((prev) => ({ ...prev, logoUrl: optimizedLogo }));
      await savePermanentAdminSettings({ logoUrl: optimizedLogo });
      flashSaveNotice("লোগো স্থায়ীভাবে ডাটাবেজে সেভ হয়েছে!");
    } catch (err) {
      console.error("Failed to upload logo", err);
    } finally {
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  // Explicit logo delete handler (only removes when admin clicks Delete)
  const handleDeleteLogo = async () => {
    onChange((prev) => ({ ...prev, logoUrl: "" }));
    await savePermanentAdminSettings({ logoUrl: "" });
    flashSaveNotice("আপলোড করা লোগো ডিলিট করা হয়েছে");
  };

  // Set Today's Date
  const handleSetTodayDate = () => {
    const today = getTodayFormattedDate();
    onChange({ ...initialData, date: today });
  };

  // Trigger download of the preview container in HD quality
  const handleDownloadHD = async () => {
    const element = document.getElementById("invoice-capture-area");
    if (!element) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: "none",
          transformOrigin: "top left",
          borderRadius: "0px",
        },
      });

      const link = document.createElement("a");
      link.download = `${(initialData.name || "activation").replace(/\s+/g, "_")}_invoice.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate download image", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedId) return;
    const shareUrl = `${window.location.origin}/?id=${generatedId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomTxId = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "TR-";
    for (let i = 0; i < 5; i++) {
      randomString += chars[Math.floor(Math.random() * chars.length)];
    }
    randomString += "-" + Math.floor(100 + Math.random() * 900);
    onChange({ ...initialData, transactionId: randomString });
  };

  const shareUrl = generatedId ? `${window.location.origin}/?id=${generatedId}` : "";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 flex flex-col gap-6 text-slate-800 relative">
      {/* Top Header with TL/TR Manager Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-[#0F4C81]">ইনভয়েস ক্রিয়েটর প্যানেল</h2>
            <p className="text-xs text-slate-500 font-medium">সহজে ডাটা অটো-পার্স ও ইনভয়েস জেনারেট করুন</p>
          </div>
        </div>

        {/* Highlighted Manage TL & TR Button */}
        <button
          type="button"
          onClick={() => setShowTlTrModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Users className="w-4 h-4" />
          এড TL / TR (Manage)
        </button>
      </div>

      {/* 1. AUTO-PARSE TEXT ZONE */}
      <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            ১. ডাটা অটো-পার্সিং প্যানেল
          </span>

          <div className="flex items-center gap-2">
            {pasteText && (
              <button
                type="button"
                onClick={handleClearPasteText}
                className="text-[11px] font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1"
                title="বক্স পরিষ্কার করুন"
              >
                <X className="w-3.5 h-3.5" />
                মুছুন
              </button>
            )}

            {/* Prominent One-Click Paste Button */}
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md shadow-blue-500/25 active:scale-95 transition cursor-pointer"
              title="ক্লিপবোর্ডে কপি করা টেক্সট অটো পেস্ট করুন"
            >
              <ClipboardPaste className="w-4 h-4 text-sky-200" />
              <span>পেস্ট করুন (Paste)</span>
            </button>
          </div>
        </div>

        <textarea
          ref={pasteTextareaRef}
          placeholder="এখানে ডাটা পেস্ট করুন অথবা উপরের 'পেস্ট করুন' বাটনে চাপুন (অটোমেটিক পার্স হবে):&#10;Name : Student Name&#10;Email : student@gmail.com&#10;Phone : 01700000000&#10;Student ID : 8302946&#10;Team Code : 336251"
          value={pasteText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner"
        />

        {parseSuccess && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>ডাটা সফলভাবে অটো-পার্স হয়েছে! নিচের ফিল্ডগুলোতে চেক করুন।</span>
          </div>
        )}

        {parseError && (
          <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">
            {parseError}
          </p>
        )}
      </div>

      {/* 2. MANUAL FIELD EDITORS */}
      <div className="flex flex-col gap-4">
        <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          ২. ডাটা এডিট ও কাস্টমাইজেশন
        </span>

        {/* Name, Email, Phone, Student ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">নাম (ID Holder Name)</label>
            <input
              type="text"
              placeholder="শিক্ষার্থীর নাম লিখুন"
              value={initialData.name}
              onChange={(e) => onChange({ ...initialData, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ইমেইল (Email ID)</label>
            <input
              type="email"
              placeholder="ইমেইল এড্রেস"
              value={initialData.email}
              onChange={(e) => onChange({ ...initialData, email: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ফোন নাম্বার (Phone)</label>
            <input
              type="text"
              placeholder="মোবাইল নাম্বার"
              value={initialData.phone}
              onChange={(e) => onChange({ ...initialData, phone: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">স্টুডেন্ট আইডি (Student ID)</label>
            <input
              type="text"
              placeholder="Student ID / Ref ID"
              value={initialData.referralCode}
              onChange={(e) => onChange({ ...initialData, referralCode: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>
        </div>

        {/* TEAM LEADER (TL) & TEAM TRAINER (TR) PERMANENT SWITCHER & MANAGER */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              টিম লিডার (TL) ও টিম ট্রেনার (TR) সুইচ ও সেভ প্যানেল
            </span>
            <button
              type="button"
              onClick={() => setShowTlTrModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg text-[10.5px] font-black flex items-center gap-1 shadow-2xs transition cursor-pointer shrink-0"
            >
              <Plus className="w-3 h-3" /> নতুন যোগ / ডিলিট
            </button>
          </div>

          {saveNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {saveNotice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Team Leader Select + Quick Switch Buttons */}
            <div className="flex flex-col gap-1.5 bg-white/80 border border-amber-200/70 rounded-xl p-2.5">
              <label className="text-[11px] font-extrabold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  টিম লিডার (TL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTab("tl");
                    setShowTlTrModal(true);
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  + এড/ম্যানেজ ({tlList.length})
                </button>
              </label>
              <select
                value={initialData.teamLeader || ""}
                onChange={(e) => handleSelectTl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- টিম লিডার সিলেক্ট করুন --</option>
                {tlList.map((tl, idx) => (
                  <option key={idx} value={tl}>
                    {tl}
                  </option>
                ))}
              </select>

              {/* One-Click Quick Switch Chips for Saved TLs */}
              {tlList.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5 max-h-20 overflow-y-auto">
                  {tlList.map((tl, idx) => {
                    const isActive = initialData.teamLeader === tl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectTl(tl)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer border ${
                          isActive
                            ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs"
                            : "bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {tl}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Team Trainer Select + Quick Switch Buttons */}
            <div className="flex flex-col gap-1.5 bg-white/80 border border-amber-200/70 rounded-xl p-2.5">
              <label className="text-[11px] font-extrabold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  টিম ট্রেনার (TR)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTab("tr");
                    setShowTlTrModal(true);
                  }}
                  className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  + এড/ম্যানেজ ({trList.length})
                </button>
              </label>
              <select
                value={initialData.teamTrainer || ""}
                onChange={(e) => handleSelectTr(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="">-- টিম ট্রেনার সিলেক্ট করুন --</option>
                {trList.map((tr, idx) => (
                  <option key={idx} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>

              {/* One-Click Quick Switch Chips for Saved TRs */}
              {trList.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5 max-h-20 overflow-y-auto">
                  {trList.map((tr, idx) => {
                    const isActive = initialData.teamTrainer === tr;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectTr(tr)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer border ${
                          isActive
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                            : "bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {tr}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Code, Cashback, Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">টিম কোড (Team Code)</label>
            <input
              type="text"
              value={initialData.teamCode}
              onChange={(e) => onChange({ ...initialData, teamCode: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ক্যাশব্যাক (Cashback Received)</label>
            <input
              type="text"
              value={initialData.cashback}
              onChange={(e) => onChange({ ...initialData, cashback: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500">মোট পেমেন্ট (Amount Paid)</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ ...initialData, amountPaid: "599" })}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-black transition-all ${
                    initialData.amountPaid === "599"
                      ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  599 ৳
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...initialData, amountPaid: "499" })}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-black transition-all ${
                    initialData.amountPaid === "499"
                      ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  499 ৳
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={initialData.amountPaid}
                onChange={(e) => onChange({ ...initialData, amountPaid: e.target.value })}
                placeholder="599 বা 499 লিখুন"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                ৳
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method, Custom Date, Transaction ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">পেমেন্ট মেথড (Payment Method)</label>
            <select
              value={initialData.paymentMethod}
              onChange={(e) => {
                const selectedMethod = e.target.value as any;
                onChange({ ...initialData, paymentMethod: selectedMethod });
                try {
                  localStorage.setItem("last_selected_payment_method", selectedMethod);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer"
            >
              <option value="Bkash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Rocket">Rocket (রকেট)</option>
              <option value="Upay">Upay (উপায়)</option>
              <option value="Bank">Bank (ব্যাংক)</option>
              <option value="Upi">UPI</option>
              <option value="Google pay">Google Pay</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500">তারিখ (Activation Date)</label>
              <button
                type="button"
                onClick={handleSetTodayDate}
                className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                title="আজকের তারিখ অটোমেটিক সেট করুন"
              >
                <Calendar className="w-3 h-3" /> আজকের তারিখ
              </button>
            </div>
            <input
              type="text"
              value={initialData.date}
              onChange={(e) => onChange({ ...initialData, date: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ট্রানজেকশন আইডি</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={initialData.transactionId}
                onChange={(e) => onChange({ ...initialData, transactionId: e.target.value })}
                className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={generateRandomTxId}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition flex items-center justify-center active:scale-95"
                title="র্যান্ডম আইডি জেনারেট করুন"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. BRANDING SETTINGS (Company customization) */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
          <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">
            ৩. কোম্পানি ব্র্যান্ডিং কাস্টমাইজেশন
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500">কোম্পানির নাম (Company Name)</label>
              <input
                type="text"
                value={initialData.companyName}
                onChange={(e) => onChange({ ...initialData, companyName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500">কোম্পানির ওয়েবসাইট (Website URL)</label>
              <input
                type="text"
                value={initialData.companyWebsite}
                onChange={(e) => onChange({ ...initialData, companyWebsite: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-1.5">
            {/* Permanent Custom Logo Upload & Delete Box */}
            <div className="flex flex-col gap-2 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3">
              <span className="text-[11px] font-bold text-slate-600">
                অফিসিয়াল লোগো আপলোড (ডিলিট না করা পর্যন্ত সবসময় সেভ থাকবে)
              </span>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              {initialData.logoUrl ? (
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white border border-emerald-200 rounded-xl p-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={initialData.logoUrl}
                      alt="Saved Logo"
                      className="w-10 h-10 rounded-full object-contain border border-slate-200 bg-white p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        লোগো স্থায়ীভাবে সেভ আছে
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        ডিলিট না করলে সবসময় এটিই থাকবে
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="text-[10.5px] font-bold text-[#0F4C81] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      পরিবর্তন
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      className="text-[10.5px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      লোগো ডিলিট করুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    নতুন লোগো আপলোড ও সেভ করুন
                  </button>
                  <span className="text-[10.5px] text-slate-400 font-semibold">
                    বর্তমানে ডিফল্ট লোগো সক্রিয় আছে
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SAVE / CONFIRM ACTION */}
      <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-600 to-[#0F4C81] hover:from-blue-700 hover:to-[#0C3D68] text-white py-3 px-6 rounded-2xl font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              ডাটাবেজে সেভ হচ্ছে...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              ইনভয়েস কনফার্ম ও লাইভ লিঙ্ক জেনারেট করুন
            </>
          )}
        </button>

        {/* DIRECT DOWNLOAD WITHOUT DATABASE SAVE */}
        <button
          type="button"
          onClick={handleDownloadHD}
          disabled={downloading}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              এইচডি ছবি তৈরি হচ্ছে...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              সেভ ছাড়া সরাসরি ডাউনলোড করুন (Direct Download)
            </>
          )}
        </button>

        {/* SUCCESS OUTCOME / SHAREABLE LINK ZONE */}
        {generatedId && (
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-4 animate-fade-in-up">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm">ইনভয়েসটি সফলভাবে লাইভ ডাটাবেজে যুক্ত হয়েছে!</span>
            </div>

            {/* Link Copy Bar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                লাইভ ভেরিফিকেশন লিঙ্ক (Live Verification Link)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-grow bg-white border border-emerald-200/50 rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-900 shadow-inner select-all outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        কপি হয়েছে
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        লিঙ্ক কপি
                      </>
                    )}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4" />
                    পেজ দেখুন (Open)
                  </a>
                </div>
              </div>
            </div>

            {/* HD Download Button */}
            <button
              onClick={handleDownloadHD}
              disabled={downloading}
              className="w-full bg-[#002B4D] hover:bg-[#001D36] text-white py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  এইচডি ছবি তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  এইচডি কোয়ালিটিতে ডাউনলোড করুন (Download HD PNG)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* --- TL & TR MANAGEMENT MODAL --- */}
      {showTlTrModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-5 relative text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0F4C81]">TL & TR নাম ব্যবস্থাপনা</h3>
                  <p className="text-[11px] text-slate-500 font-medium">টিম লিডার ও ট্রেনারদের নাম সংরক্ষণ করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTlTrModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab selector */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setActiveModalTab("tl")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  activeModalTab === "tl"
                    ? "bg-white text-[#0F4C81] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                টিম লিডার ({tlList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("tr")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  activeModalTab === "tr"
                    ? "bg-white text-[#0F4C81] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                টিম ট্রেনার ({trList.length})
              </button>
            </div>

            {/* Tab 1: Team Leader Manager */}
            {activeModalTab === "tl" && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="নতুন টিম লিডারের নাম লিখুন..."
                    value={newTlInput}
                    onChange={(e) => setNewTlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTl())}
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTl}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" /> সেভ করুন
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      স্থায়ীভাবে সংরক্ষিত টিম লিডার (ক্লিক করে সুইচ করুন)
                    </span>
                    {tlList.length > 0 && (
                      confirmClearType === "tl" ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleClearAllTls}
                            className="text-[10px] font-black text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded cursor-pointer"
                          >
                            হ্যাঁ, সব মুছুন
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearType(null)}
                            className="text-[10px] font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded cursor-pointer"
                          >
                            না
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmClearType("tl")}
                          className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          সব ক্লিয়ার করুন
                        </button>
                      )
                    )}
                  </div>
                  {tlList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-3 text-center">
                      এখনো কোনো টিম লিডারের নাম যুক্ত করা হয়নি
                    </p>
                  ) : (
                    tlList.map((item, idx) => {
                      const isSelected = initialData.teamLeader === item;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition border ${
                            isSelected
                              ? "bg-blue-50 border-blue-300 text-[#0F4C81]"
                              : "bg-slate-50 border-slate-200/80 text-slate-800 hover:border-blue-200"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectTl(item)}
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                          >
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                                isSelected ? "bg-[#0F4C81] text-white" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {isSelected ? "✓" : idx + 1}
                            </span>
                            <span>{item}</span>
                            {isSelected && (
                              <span className="text-[9.5px] font-extrabold bg-[#0F4C81] text-white px-1.5 py-0.5 rounded ml-1">
                                Active
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTl(item)}
                            className="text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            ডিলিট
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Team Trainer Manager */}
            {activeModalTab === "tr" && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="নতুন টিম ট্রেনারের নাম লিখুন..."
                    value={newTrInput}
                    onChange={(e) => setNewTrInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTr())}
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTr}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" /> সেভ করুন
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      স্থায়ীভাবে সংরক্ষিত টিম ট্রেনার (ক্লিক করে সুইচ করুন)
                    </span>
                    {trList.length > 0 && (
                      confirmClearType === "tr" ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleClearAllTrs}
                            className="text-[10px] font-black text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded cursor-pointer"
                          >
                            হ্যাঁ, সব মুছুন
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearType(null)}
                            className="text-[10px] font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded cursor-pointer"
                          >
                            না
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmClearType("tr")}
                          className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          সব ক্লিয়ার করুন
                        </button>
                      )
                    )}
                  </div>
                  {trList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-3 text-center">
                      এখনো কোনো টিম ট্রেনারের নাম যুক্ত করা হয়নি
                    </p>
                  ) : (
                    trList.map((item, idx) => {
                      const isSelected = initialData.teamTrainer === item;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition border ${
                            isSelected
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-slate-50 border-slate-200/80 text-slate-800 hover:border-emerald-200"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectTr(item)}
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                          >
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                                isSelected ? "bg-emerald-700 text-white" : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {isSelected ? "✓" : idx + 1}
                            </span>
                            <span>{item}</span>
                            {isSelected && (
                              <span className="text-[9.5px] font-extrabold bg-emerald-700 text-white px-1.5 py-0.5 rounded ml-1">
                                Active
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTr(item)}
                            className="text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            ডিলিট
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-bold text-slate-500">
                ডিলিট বা ক্লিয়ার না করা পর্যন্ত নাম স্থায়ীভাবে সেভ থাকবে
              </span>
              <button
                type="button"
                onClick={handleSaveAndCloseModal}
                className="bg-[#0F4C81] hover:bg-[#0A3960] text-white px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer shadow-md whitespace-nowrap"
              >
                সেভ ও সম্পন্ন (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
