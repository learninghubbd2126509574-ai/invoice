import React, { useState, useRef, useEffect } from "react";
import { InvoiceData } from "../types";
import { getTodayFormattedDate } from "../utils/dateUtils";
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
} from "lucide-react";
import { toPng } from "html-to-image";

interface AdminPanelProps {
  initialData: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onSave: () => Promise<string>;
  isSaving: boolean;
  generatedId: string | null;
}

const DEFAULT_TLS = ["Sabbir Ahmed", "Tanvir Hasan", "Rakib Hossain", "Mehedi Hasan", "Mahmudul Hasan"];
const DEFAULT_TRS = ["Nafis Iqbal", "Sumon Mia", "Al Amin", "Arif Rahman", "Shakil Khan"];

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

  // TL & TR Management Modal State
  const [showTlTrModal, setShowTlTrModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"tl" | "tr">("tl");
  const [newTlInput, setNewTlInput] = useState("");
  const [newTrInput, setNewTrInput] = useState("");

  // Load TL & TR lists from localStorage
  const [tlList, setTlList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_team_leaders");
      return saved ? JSON.parse(saved) : DEFAULT_TLS;
    } catch {
      return DEFAULT_TLS;
    }
  });

  const [trList, setTrList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_team_trainers");
      return saved ? JSON.parse(saved) : DEFAULT_TRS;
    } catch {
      return DEFAULT_TRS;
    }
  });

  // Save TL & TR lists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("saved_team_leaders", JSON.stringify(tlList));
    } catch (e) {
      console.error(e);
    }
  }, [tlList]);

  useEffect(() => {
    try {
      localStorage.setItem("saved_team_trainers", JSON.stringify(trList));
    } catch (e) {
      console.error(e);
    }
  }, [trList]);

  // Load sticky selected TL & TR on mount or when lists change
  useEffect(() => {
    try {
      const savedTr = localStorage.getItem("last_selected_team_trainer");
      const savedTl = localStorage.getItem("last_selected_team_leader");

      let targetTr = initialData.teamTrainer;
      let targetTl = initialData.teamLeader;

      // Ensure Team Trainer is sticky
      if (savedTr && trList.includes(savedTr)) {
        targetTr = savedTr;
      } else if (!targetTr && trList.length > 0) {
        targetTr = trList[0];
      }

      // Ensure Team Leader is sticky
      if (savedTl && tlList.includes(savedTl)) {
        targetTl = savedTl;
      } else if (!targetTl && tlList.length > 0) {
        targetTl = tlList[0];
      }

      if (targetTr !== initialData.teamTrainer || targetTl !== initialData.teamLeader) {
        onChange({
          ...initialData,
          teamTrainer: targetTr,
          teamLeader: targetTl,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [trList, tlList]);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Add new TL
  const handleAddTl = () => {
    const trimmed = newTlInput.trim();
    if (!trimmed) return;
    if (!tlList.includes(trimmed)) {
      const updated = [...tlList, trimmed];
      setTlList(updated);
      onChange({ ...initialData, teamLeader: trimmed });
      localStorage.setItem("last_selected_team_leader", trimmed);
    } else {
      onChange({ ...initialData, teamLeader: trimmed });
      localStorage.setItem("last_selected_team_leader", trimmed);
    }
    setNewTlInput("");
  };

  // Delete TL
  const handleDeleteTl = (nameToDelete: string) => {
    const updated = tlList.filter((item) => item !== nameToDelete);
    setTlList(updated);
    if (initialData.teamLeader === nameToDelete) {
      const nextTl = updated[0] || "";
      onChange({ ...initialData, teamLeader: nextTl });
      localStorage.setItem("last_selected_team_leader", nextTl);
    }
  };

  // Add new TR
  const handleAddTr = () => {
    const trimmed = newTrInput.trim();
    if (!trimmed) return;
    if (!trList.includes(trimmed)) {
      const updated = [...trList, trimmed];
      setTrList(updated);
      onChange({ ...initialData, teamTrainer: trimmed });
      localStorage.setItem("last_selected_team_trainer", trimmed);
    } else {
      onChange({ ...initialData, teamTrainer: trimmed });
      localStorage.setItem("last_selected_team_trainer", trimmed);
    }
    setNewTrInput("");
  };

  // Delete TR
  const handleDeleteTr = (nameToDelete: string) => {
    const updated = trList.filter((item) => item !== nameToDelete);
    setTrList(updated);
    if (initialData.teamTrainer === nameToDelete) {
      const nextTr = updated[0] || "";
      onChange({ ...initialData, teamTrainer: nextTr });
      localStorage.setItem("last_selected_team_trainer", nextTr);
    }
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
      // Robust regex parser to support multiple variations including TL and TR
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
      if (tlMatch) {
        const parsedTl = tlMatch[1].trim();
        parsed.teamLeader = parsedTl;
        if (parsedTl) {
          localStorage.setItem("last_selected_team_leader", parsedTl);
          if (!tlList.includes(parsedTl)) {
            setTlList((prev) => [...prev, parsedTl]);
          }
        }
      }
      if (trMatch) {
        const parsedTr = trMatch[1].trim();
        parsed.teamTrainer = parsedTr;
        if (parsedTr) {
          localStorage.setItem("last_selected_team_trainer", parsedTr);
          if (!trList.includes(parsedTr)) {
            setTrList((prev) => [...prev, parsedTr]);
          }
        }
      }
      if (cashbackMatch) parsed.cashback = cashbackMatch[1].trim();
      if (amountMatch) parsed.amountPaid = amountMatch[1].trim();
      if (dateMatch) parsed.date = dateMatch[1].trim();

      if (Object.keys(parsed).length > 0) {
        onChange({
          ...initialData,
          // Preserve selected teamLeader and teamTrainer if not present in parsed text
          teamTrainer: parsed.teamTrainer || initialData.teamTrainer || localStorage.getItem("last_selected_team_trainer") || "",
          teamLeader: parsed.teamLeader || initialData.teamLeader || localStorage.getItem("last_selected_team_leader") || "",
          ...parsed,
        } as InvoiceData);
        setParseSuccess(true);
      } else {
        setParseSuccess(false);
      }
    } catch (err: any) {
      setParseError("পার্সিং ত্রুটি হয়েছে!");
      setParseSuccess(false);
    }
  };

  // Convert File to Base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Data = await fileToBase64(file);
      onChange({ ...initialData, logoUrl: base64Data });
      localStorage.setItem("company_logo", base64Data);
    } catch (err) {
      console.error("Failed to upload logo", err);
    }
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
        style: {
          transform: "scale(1)",
          borderRadius: "2rem",
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
      <div className="flex flex-col gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          ১. ডাটা অটো-পার্সিং প্যানেল
        </span>

        <textarea
          placeholder="এখানে ডাটা কপি-পেস্ট করুন (অটোমেটিক পার্স হবে):&#10;Name : Ahmed Sabbir&#10;Email : ahmedsabbir9845@gmail.com&#10;Phone : 01307118068&#10;Student ID : 8302946&#10;Team Leader : Sabbir Ahmed&#10;Team Trainer : Nafis Iqbal"
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

        {/* TEAM LEADER (TL) & TEAM TRAINER (TR) DROPDOWNS */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              টিম লিডার (TL) ও টিম ট্রেনার (TR) নির্বাচন
            </span>
            <button
              type="button"
              onClick={() => setShowTlTrModal(true)}
              className="text-[10px] font-black text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> নাম যুক্ত / পরিবর্তন করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Team Leader Select */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                টিম লিডার (Team Leader - TL)
              </label>
              <div className="flex gap-1.5">
                <select
                  value={initialData.teamLeader || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({ ...initialData, teamLeader: val });
                    if (val) {
                      localStorage.setItem("last_selected_team_leader", val);
                    }
                  }}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="">-- টিম লিডার সিলেক্ট করুন --</option>
                  {tlList.map((tl, idx) => (
                    <option key={idx} value={tl}>
                      {tl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Trainer Select */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                টিম ট্রেনার (Team Trainer - TR)
              </label>
              <div className="flex gap-1.5">
                <select
                  value={initialData.teamTrainer || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({ ...initialData, teamTrainer: val });
                    if (val) {
                      localStorage.setItem("last_selected_team_trainer", val);
                    }
                  }}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="">-- টিম ট্রেনার সিলেক্ট করুন --</option>
                  {trList.map((tr, idx) => (
                    <option key={idx} value={tr}>
                      {tr}
                    </option>
                  ))}
                </select>
              </div>
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
            {/* Custom Logo upload button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">অফিসিয়াল লোগো আপলোড (Company Logo)</span>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-1.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  লোগো ফাইল দিন
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {initialData.logoUrl ? (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-bold text-[#0F4C81]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    আপলোড হয়েছে
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold">ডিফল্ট লোগো সক্রিয়</span>
                )}
              </div>
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
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTl}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> যোগ করুন
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    সংরক্ষিত টিম লিডারদের তালিকা
                  </span>
                  {tlList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">কোনো নাম যুক্ত নেই</p>
                  ) : (
                    tlList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 group hover:border-amber-300 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-black">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTl(item)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
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
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTr}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> যোগ করুন
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    সংরক্ষিত টিম ট্রেনারদের তালিকা
                  </span>
                  {trList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">কোনো নাম যুক্ত নেই</p>
                  ) : (
                    trList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 group hover:border-amber-300 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-black">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTr(item)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTlTrModal(false)}
                className="bg-[#0F4C81] hover:bg-[#0A3960] text-white px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer shadow-md"
              >
                সম্পন্ন (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
