import React, { useState, useRef } from "react";
import { InvoiceData } from "../types";
import { Upload, Sparkles, Check, Copy, Download, RefreshCw, FileText, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";

interface AdminPanelProps {
  initialData: InvoiceData;
  onChange: (data: InvoiceData) => void;
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

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Real-time automatic parsing on paste or type
  const handleTextChange = (text: string) => {
    setPasteText(text);
    setParseError(null);
    if (!text.trim()) {
      setParseSuccess(false);
      return;
    }

    try {
      // Robust regex parser to support multiple variations
      const nameMatch = text.match(/(?:Name|নাম)\s*[:：-]?\s*(.*)/i);
      const emailMatch = text.match(/(?:Email|ইমেইল)\s*[:：-]?\s*(.*)/i);
      const phoneMatch = text.match(/(?:Phone|মোবাইল|ফোন)\s*[:：-]?\s*(.*)/i);
      const refMatch = text.match(/(?:Student\s*ID|Referral\s*Code|Ref\.?\s*ID|রেফার|স্টুডেন্ট\s*আইডি)\s*[:：-]?\s*(.*)/i);
      const teamMatch = text.match(/(?:Team\s*Code|টিম\s*কোড)\s*[:：-]?\s*(.*)/i);
      const cashbackMatch = text.match(/(?:Cashback|ক্যাশব্যাক)\s*[:：-]?\s*(.*)/i);
      const amountMatch = text.match(/(?:Amount\s*Paid|পেমেন্ট|টাকা)\s*[:：-]?\s*(.*)/i);

      const parsed: Partial<InvoiceData> = {};
      if (nameMatch) parsed.name = nameMatch[1].trim();
      if (emailMatch) parsed.email = emailMatch[1].trim();
      if (phoneMatch) parsed.phone = phoneMatch[1].trim();
      if (refMatch) parsed.referralCode = refMatch[1].trim();
      if (teamMatch) parsed.teamCode = teamMatch[1].trim();
      if (cashbackMatch) parsed.cashback = cashbackMatch[1].trim();
      if (amountMatch) parsed.amountPaid = amountMatch[1].trim();

      if (Object.keys(parsed).length > 0) {
        onChange({
          ...initialData,
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

  // Trigger download of the preview container in HD quality
  const handleDownloadHD = async () => {
    const element = document.getElementById("invoice-capture-area");
    if (!element) return;

    setDownloading(true);
    try {
      // Set to high resolution (pixelRatio: 3) for crisp HD quality printing!
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          borderRadius: '2rem',
        }
      });

      const link = document.createElement("a");
      link.download = `${initialData.name.replace(/\s+/g, "_")}_activation_invoice.png`;
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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 flex flex-col gap-6 text-slate-800">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-[#0F4C81]">ইনভয়েস ক্রিয়েটর প্যানেল</h2>
          <p className="text-xs text-slate-500 font-medium">সহজে ডাটা অটো-পার্স ও ইনভয়েস জেনারেট করুন</p>
        </div>
      </div>

      {/* 1. AUTO-PARSE TEXT ZONE */}
      <div className="flex flex-col gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          ১. ডাটা অটো-পার্সিং প্যানেল
        </span>

        <textarea
          placeholder="এখানে ডাটা কপি-পেস্ট করুন (অটোমেটিক পার্স হবে):&#10;Name : Ahmed Sabbir&#10;Email : ahmedsabbir9845@gmail.com&#10;Phone : 01307118068&#10;Student ID : 8302946"
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

        {/* Name, Email, Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">নাম (ID Holder Name)</label>
            <input
              type="text"
              value={initialData.name}
              onChange={(e) => onChange({ ...initialData, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ইমেইল (Email ID)</label>
            <input
              type="email"
              value={initialData.email}
              onChange={(e) => onChange({ ...initialData, email: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">ফোন নাম্বার (Phone)</label>
            <input
              type="text"
              value={initialData.phone}
              onChange={(e) => onChange({ ...initialData, phone: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">স্টুডেন্ট আইডি (Student ID)</label>
            <input
              type="text"
              value={initialData.referralCode}
              onChange={(e) => onChange({ ...initialData, referralCode: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
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
            <label className="text-[11px] font-bold text-slate-500">মোট পেমেন্ট (Amount Paid)</label>
            <input
              type="text"
              value={initialData.amountPaid}
              onChange={(e) => onChange({ ...initialData, amountPaid: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Payment Method, Custom Date, Transaction ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500">পেমেন্ট মেথড (Payment Method)</label>
            <select
              value={initialData.paymentMethod}
              onChange={(e) => onChange({ ...initialData, paymentMethod: e.target.value as any })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
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
            <label className="text-[11px] font-bold text-slate-500">তারিখ (Activation Date)</label>
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
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-1.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
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
          className="w-full bg-gradient-to-r from-blue-600 to-[#0F4C81] hover:from-blue-700 hover:to-[#0C3D68] text-white py-3 px-6 rounded-2xl font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-98 disabled:opacity-50"
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
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-98 disabled:opacity-50"
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
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-grow bg-white border border-emerald-200/50 rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-900 shadow-inner select-all outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
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
              </div>
            </div>

            {/* HD Download Button */}
            <button
              onClick={handleDownloadHD}
              disabled={downloading}
              className="w-full bg-[#002B4D] hover:bg-[#001D36] text-white py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
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
    </div>
  );
};
