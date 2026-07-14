import React, { useState, useEffect, useRef } from "react";
import { InvoiceData } from "./types";
import { AdminPanel } from "./components/AdminPanel";
import { InvoicePreview } from "./components/InvoicePreview";
import { ShieldCheck, Database, HelpCircle, Download, CheckCircle, RefreshCw, AlertCircle, Copy, Check, ExternalLink, ArrowLeft, Trash2 } from "lucide-react";
import { toPng } from "html-to-image";

const DEFAULT_INVOICE_DATA: InvoiceData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  referralCode: "4845156",
  teamCode: "336251",
  cashback: "300",
  amountPaid: "599",
  paymentMethod: "Bkash",
  companyName: "Unity Earning",
  companyWebsite: "www.unityearning.com",
  transactionId: "TR-608C9-654",
  date: "July 13, 2026",
};

const ScaleWrapper = ({ children, maxWidth = 330 }: { children: React.ReactNode; maxWidth?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || maxWidth;
        // Restrict to max maxWidth display width
        const availableWidth = Math.min(parentWidth - 8, maxWidth);
        const currentScale = availableWidth / 640;
        setScale(currentScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth]);

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center">
      <div
        style={{
          width: `${640 * scale}px`,
          height: `${1060 * scale}px`,
          overflow: "hidden",
          position: "relative"
        }}
        className="flex-shrink-0 transition-all duration-200 rounded-[1.8rem]"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: "640px",
            height: "1060px",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Verification lookup states
  const [verifiedData, setVerifiedData] = useState<InvoiceData | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [downloadingVerified, setDownloadingVerified] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [phoneScale, setPhoneScale] = useState<number>(0.42); // Default to a beautifully zoomed-out scale to fit perfectly on standard screen sizes.
  
  // Custom dialogs/notifications for smooth iframe-friendly UX
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleClearDatabase = async () => {
    setShowClearConfirm(false);
    setIsClearing(true);
    try {
      const response = await fetch("/api/clear-database", {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("ডাটা ক্লিয়ার করতে সমস্যা হয়েছে!");
      }
      showToast("ডাটাবেজ সফলভাবে সম্পূর্ণ ক্লিয়ার করা হয়েছে!", "success");
      // Reset state if cleared
      setInvoiceData(DEFAULT_INVOICE_DATA);
      setGeneratedId(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "ত্রুটি হয়েছে!", "error");
    } finally {
      setIsClearing(false);
    }
  };

  // Load logoUrl from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("company_logo");
    if (savedLogo) {
      setInvoiceData(prev => ({ ...prev, logoUrl: savedLogo }));
    }
  }, []);

  // Sync logoUrl to localStorage whenever it changes
  useEffect(() => {
    if (invoiceData.logoUrl) {
      localStorage.setItem("company_logo", invoiceData.logoUrl);
    }
  }, [invoiceData.logoUrl]);

  // Check URL query parameters for verification ID (?id=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");
      if (id) {
        setVerificationId(id);
        fetchVerifiedInvoice(id);
      }
    }
  }, []);

  // Fetch verified invoice from backend
  const fetchVerifiedInvoice = async (id: string) => {
    setIsLookupLoading(true);
    setLookupError(null);
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) {
        throw new Error("ভেরিফিকেশন আইডি পাওয়া যায়নি অথবা ডাটাবেজে রেকর্ডটি নেই!");
      }
      const data = await response.json();
      setVerifiedData(data);
    } catch (err: any) {
      console.error("Lookup error:", err);
      setLookupError(err.message || "ভেরিফিকেশন ডাটা ফেচ করতে সমস্যা হয়েছে!");
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Save invoice to backend Firestore / Memory DB
  const handleSaveInvoice = async (): Promise<string> => {
    setIsSaving(true);
    try {
      // Create a unique ID if not present
      const uniqueId = "inv_" + Math.random().toString(36).substring(2, 15);
      const updatedData = {
        ...invoiceData,
        id: uniqueId,
      };

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("ইনভয়েস সেভ করতে সমস্যা হয়েছে!");
      }

      const result = await response.json();
      setGeneratedId(result.id);
      setInvoiceData(updatedData);
      setIsSaving(false);
      return result.id;
    } catch (err) {
      console.error("Save error:", err);
      setIsSaving(false);
      throw err;
    }
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownloadHD = async (fileName: string = "invoice") => {
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
      link.download = `${fileName.replace(/\s+/g, "_")}_receipt.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate download image", err);
    } finally {
      setDownloading(false);
    }
  };

  const formatCreatedAtEn = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const dateObj = new Date(isoString);
      return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      return isoString;
    }
  };

  // --- RENDER 1: VERIFICATION PORTAL VIEW (?id=...) ---
  if (verificationId) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0F172A] py-10 px-4 text-white flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          {/* Top Logo and verification banner */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center shadow-lg">
                <Database className="w-8 h-8 text-blue-100" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 justify-center">
                অফিসিয়াল পেমেন্ট ভেরিফিকেশন পোর্টাল
              </h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Official E-Learning Platform Payment Verification Database
              </p>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLookupLoading && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-bold text-base text-slate-100">ডাটাবেজে সার্চ হচ্ছে...</h3>
                <p className="text-xs text-slate-400 mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন, পেমেন্ট রেকর্ড যাচাই করা হচ্ছে।</p>
              </div>
            </div>
          )}

          {/* ERROR / NOT FOUND STATE */}
          {lookupError && (
            <div className="bg-slate-900/80 border border-red-950/40 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-100">রেকর্ডটি পাওয়া যায়নি!</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{lookupError}</p>
              </div>
              <a
                href="/"
                className="mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition"
              >
                নতুন ইনভয়েস তৈরি করুন
              </a>
            </div>
          )}

          {/* VERIFIED SUCCESS DATA VIEW */}
          {verifiedData && !isLookupLoading && (
            <div className="flex flex-col items-center gap-6 w-full animate-fade-in-up">
              
              {/* Top Download Header Bar */}
              <div className="w-full max-w-sm bg-emerald-950/60 border border-emerald-500/30 p-3 px-4 rounded-2xl flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-emerald-300 font-extrabold uppercase tracking-widest">Verified ID Receipt</span>
                </div>
                <button
                  onClick={() => handleDownloadHD(verifiedData?.name || "verified_receipt")}
                  disabled={downloading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ডাউনলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      ডাউনলোড করুন (Download)
                    </>
                  )}
                </button>
              </div>

              {/* Beautiful text-based details view */}
              <div className="w-full max-w-[500px] bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl mb-4 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-4 border-b border-slate-800 pb-6 mb-6">
                  {verifiedData.logoUrl ? (
                    <img src={verifiedData.logoUrl} alt="Logo" className="w-20 h-20 object-contain rounded-full border-2 border-slate-700 bg-white p-1 shadow-lg" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0F4C81] to-[#1E3A8A] flex items-center justify-center shadow-lg border-2 border-slate-700">
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                  )}
                  <div className="text-center">
                    <h2 className="text-xl font-black text-white tracking-wide">{verifiedData.companyName.toUpperCase()}</h2>
                    <p className="text-[11px] text-emerald-400 font-bold mt-1 tracking-widest uppercase">Account Activated</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  {[
                    { label: "Name", value: verifiedData.name },
                    { label: "Email", value: verifiedData.email },
                    { label: "Phone", value: verifiedData.phone },
                    { label: "Student ID", value: verifiedData.referralCode },
                    { label: "Team Code", value: verifiedData.teamCode },
                    { label: "Cashback", value: `৳${verifiedData.cashback}` },
                    { label: "Amount Paid", value: `৳${verifiedData.amountPaid}` },
                    { label: "Payment Method", value: verifiedData.paymentMethod },
                    { label: "Date", value: verifiedData.date },
                    { label: "Verification ID", value: verifiedData.id },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-800/50 last:border-0">
                      <span className="text-slate-400 font-semibold text-[13px]">{item.label}</span>
                      <span className="text-slate-100 font-bold text-[13px] text-right max-w-[60%] break-words">{item.value || "-"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden invoice view just for downloading */}
              <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
                <ScaleWrapper maxWidth={640}>
                  <InvoicePreview data={verifiedData} isSharedPage={true} />
                </ScaleWrapper>
              </div>

            </div>
          )}

          {/* Footer branding lookup */}
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-4">
            SECURE VERIFICATION SHIELD © 2026
          </span>
        </div>
      </div>
    );
  }

  // --- RENDER 2: ADMIN CREATOR DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Professional App Header */}
      <header className="bg-white border-b border-slate-200/80 py-4 px-6 sticky top-0 z-50 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-[15px] tracking-tight text-slate-900">E-LEARNING ACTIVATION PANEL</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Payment Receipt Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Clear Database Button */}
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={isClearing}
              className="flex items-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-red-700 shadow-sm active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              {isClearing ? "ডাটা ক্লিয়ার হচ্ছে..." : "ডাটাবেজ ক্লিয়ার করুন"}
            </button>

            <div className="flex items-center gap-3 bg-blue-50 border border-slate-100 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-blue-700 shadow-inner">
              <Database className="w-3.5 h-3.5 animate-pulse" />
              ফায়ারবেস লাইভ ডাটাবেজ সক্রিয় (Firebase Connected)
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Admin panel configurator (takes 5 cols) */}
          <div className="lg:col-span-5">
            <AdminPanel
              initialData={invoiceData}
              onChange={setInvoiceData}
              onSave={handleSaveInvoice}
              isSaving={isSaving}
              generatedId={generatedId}
            />
          </div>

          {/* Right Block: Live high fidelity preview (takes 7 cols) with dynamic smartphone frame */}
          <div className="lg:col-span-7 flex flex-col items-center gap-5">
            <div className="w-full flex justify-between items-center px-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                রিয়েল-টাইম লাইভ ইনভয়েস প্রিভিউ (Live Preview)
              </span>
              <span className="text-[10px] font-bold text-[#0F4C81] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                MOBILE FRAME PREVIEW
              </span>
            </div>

            {/* Dynamic Zoom Controller Panel inside main screen */}
            <div className="w-full bg-white border border-slate-100 p-4 rounded-[2rem] flex flex-col gap-3 shadow-md text-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
                  🔍 ইনভয়েস জুম কন্ট্রোল প্যানেল (Zoom Scale)
                </span>
                <span className="text-xs text-blue-800 font-extrabold bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                  জুম সাইজ: {Math.round(phoneScale * 100)}%
                </span>
              </div>

              {/* Slider control */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400">ছোট</span>
                <input
                  type="range"
                  min="0.25"
                  max="0.80"
                  step="0.01"
                  value={phoneScale}
                  onChange={(e) => setPhoneScale(parseFloat(e.target.value))}
                  className="flex-grow h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[10px] font-bold text-slate-400">বড়</span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "৩০% (ছোট)", value: 0.30 },
                  { label: "৪০% (মিডিয়াম)", value: 0.40 },
                  { label: "৫০% (বড়)", value: 0.50 },
                  { label: "৬০% (ফুল)", value: 0.60 }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPhoneScale(preset.value)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black transition-all border ${
                      Math.abs(phoneScale - preset.value) < 0.02
                        ? "bg-gradient-to-r from-blue-600 to-[#0F4C81] text-white border-transparent shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              <div className="text-[9.5px] text-slate-500 text-center font-bold">
                💡 আপনার স্ক্রিনের সাথে মেলাতে জুম এডজাস্ট করুন। পুরো ইনভয়েসের তথ্য ফ্রেমের ভেতরে দেখতে পাবেন এবং স্ক্রিনশট নিতে পারবেন।
              </div>
            </div>

            {/* Smartphone Frame Mockup with scaled down view */}
            <div className="relative bg-slate-900 p-4 pb-6 pt-10 rounded-[3.5rem] shadow-3xl border-4 border-slate-800/95 max-w-full overflow-hidden flex flex-col items-center animate-fade-in">
              {/* Speaker Grill */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center border border-slate-800">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
              </div>
              
              {/* Camera Lens */}
              <div className="absolute top-3.5 left-1/3 w-3 h-3 bg-slate-950 rounded-full z-20 border border-slate-800"></div>

              {/* Internal Screen Area containing dynamically scaled Invoice - 1250px height for complete fitting */}
              <div className="rounded-[2.4rem] overflow-hidden bg-slate-950 border border-slate-950 p-1 flex justify-center items-center">
                <div
                  style={{
                    width: `${640 * phoneScale}px`,
                    height: `${1250 * phoneScale}px`,
                    overflow: "hidden",
                    position: "relative"
                  }}
                  className="flex-shrink-0 transition-all duration-200 rounded-[1.8rem]"
                >
                  <div
                    style={{
                      transform: `scale(${phoneScale})`,
                      transformOrigin: "top left",
                      width: "640px",
                      height: "1250px",
                      position: "absolute",
                      top: 0,
                      left: 0
                    }}
                  >
                    <InvoicePreview data={invoiceData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              ইনভয়েস কনফার্ম করলে লাইভ ক্লাউড লিঙ্ক ও ডাউনলোড অপশন চালু হবে।
            </div>
          </div>
        </div>
      </main>

      {/* SUCCESS OVERLAY / MODAL STAGE */}
      {generatedId && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[999] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8 animate-fade-in">
          {/* Top Header Navigation Bar */}
          <div className="w-full max-w-xl bg-[#0b2447] border border-slate-700/60 p-3 px-4 rounded-2xl mb-6 flex items-center justify-between shadow-2xl relative mt-2 md:mt-6">
            {/* Back Button on Left */}
            <button
              onClick={() => setGeneratedId(null)}
              className="text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800/80 text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95"
            >
              ← ফিরে যান
            </button>
            {/* Download Button on Right */}
            <button
              onClick={() => handleDownloadHD(invoiceData.name || "unity_earning")}
              disabled={downloading}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ডাউনলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  ডাউনলোড করুন
                </>
              )}
            </button>
          </div>

          {/* Shareable Link Caption Box */}
          <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl mb-8 flex flex-col gap-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block text-left">
                অটোমেটিক ক্যাপশন শেয়ারিং প্যানেল
              </span>
              <span className="text-[10px] text-slate-400 font-bold">কপি করে সরাসরি শেয়ার করুন</span>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-xs font-medium text-slate-100 whitespace-pre-wrap text-left relative overflow-hidden leading-relaxed mt-2">
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black px-2 py-0.5 rounded">
                  Caption Template
                </div>
              </div>
              {`🎉 অভিনন্দন!

Unity Earning E-Learning Platform-এ আপনার অ্যাকাউন্ট সফলভাবে অ্যাক্টিভ হয়েছে।

আপনার অ্যাকাউন্টের বিস্তারিত দেখতে নিচের লিংকে ক্লিক করুন:
👉 ${generatedId ? `${window.location.origin}${window.location.pathname}?id=${generatedId}` : ""}`}
            </div>
            <button
              onClick={() => {
                const text = `🎉 অভিনন্দন!\n\nUnity Earning E-Learning Platform-এ আপনার অ্যাকাউন্ট সফলভাবে অ্যাক্টিভ হয়েছে।\n\nআপনার অ্যাকাউন্টের বিস্তারিত দেখতে নিচের লিংকে ক্লিক করুন:\n👉 ${generatedId ? `${window.location.origin}${window.location.pathname}?id=${generatedId}` : ""}`;
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-1 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  কপি হয়েছে!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  ক্যাপশন কপি করুন
                </>
              )}
            </button>
          </div>

          {/* Smartphone Frame Mockup with scaled down view */}
          <div className="relative bg-slate-900 p-4 pb-6 pt-10 rounded-[3.5rem] shadow-3xl border-4 border-slate-800/90 max-w-full overflow-hidden mb-16 flex flex-col items-center">
            {/* Speaker Grill */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center border border-slate-800">
              <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            </div>
            
            {/* Camera Lens */}
            <div className="absolute top-3.5 left-1/3 w-3 h-3 bg-slate-950 rounded-full z-20 border border-slate-800"></div>

            {/* Internal Screen Area containing dynamically scaled Invoice */}
            <div className="rounded-[2.4rem] overflow-hidden bg-slate-950 border border-slate-950 p-1 flex justify-center items-center">
              <div
                style={{
                  width: `${640 * phoneScale}px`,
                  height: `${1120 * phoneScale}px`,
                  overflow: "hidden",
                  position: "relative"
                }}
                className="flex-shrink-0 transition-all duration-200 rounded-[1.8rem]"
              >
                <div
                  style={{
                    transform: `scale(${phoneScale})`,
                    transformOrigin: "top left",
                    width: "640px",
                    height: "1120px",
                    position: "absolute",
                    top: 0,
                    left: 0
                  }}
                >
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CLEAR DATABASE CONFIRMATION MODAL --- */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1001] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800/80 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl relative overflow-hidden text-slate-100 transform scale-100 transition-all duration-300">
            {/* Top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>
            
            <div className="flex flex-col items-center text-center gap-4 mt-2">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                <Trash2 className="w-7 h-7" />
              </div>
              
              <div>
                <h3 className="text-lg font-black tracking-tight text-white">ডাটাবেজ চিরতরে মুছুন?</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-extrabold">Confirm Database Clearance</p>
              </div>

              <p className="text-xs text-slate-300 font-bold bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60 leading-relaxed">
                আপনি কি নিশ্চিত যে ডাটাবেজের সকল ইনভয়েস ও ইউজারের তথ্য চিরতরে মুছে ফেলতে চান? এটি আর কোনোভাবেই ফিরিয়ে আনা সম্ভব হবে না!
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all duration-200 border border-slate-700/80 active:scale-95 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleClearDatabase}
                  disabled={isClearing}
                  className="py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-950/40 hover:shadow-red-900/40 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isClearing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      মুছা হচ্ছে...
                    </>
                  ) : (
                    "হ্যাঁ, ডিলিট করুন"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM GLOWING TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[1002] animate-slide-in flex items-center gap-3 bg-slate-900/95 border border-slate-800/80 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm text-slate-100 border-l-4 min-w-[280px] ${
          toast.type === "success" ? "border-l-emerald-500" : toast.type === "error" ? "border-l-red-500" : "border-l-blue-500"
        }`}>
          {toast.type === "success" && (
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
          )}
          {toast.type === "error" && (
            <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {toast.type === "info" && (
            <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Database className="w-4 h-4 animate-pulse" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black leading-tight">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
