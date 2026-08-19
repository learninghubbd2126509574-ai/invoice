import React from "react";
import { InvoiceData } from "../types";
import { PaymentMethodLogo } from "./BrandLogos";
import { QRCodeSVG } from "qrcode.react";

interface InvoicePreviewProps {
  data: InvoiceData;
  verificationUrl?: string;
  isSharedPage?: boolean;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  data,
  verificationUrl = "",
  isSharedPage = false,
}) => {
  // Use data values with fallbacks
  const {
    name = "Minhaz Ahmed",
    email = "minhaz960@gmail.com",
    phone = "01863091123",
    referralCode = "4845156",
    teamCode = "241324",
    teamLeader = "Sabbir Ahmed",
    teamTrainer = "Nafis Iqbal",
    cashback = "300",
    amountPaid = "599",
    paymentMethod = "Bkash",
    companyName = "Unity Earning",
    companyWebsite = "www.unityearning.com",
    transactionId = "TR-608C9-654",
    date = "July 13, 2026",
    logoUrl,
    avatarUrl,
  } = data;

  // Real verification link or fallback
  const shareLink = verificationUrl || (typeof window !== "undefined" ? `${window.location.origin}/?id=${data.id || "demo"}` : "https://www.unityearning.com/verify");

  return (
    <div
      id="invoice-capture-area"
      className="w-[640px] bg-[#F8FAFC] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col font-sans select-none mx-auto relative p-0"
      style={{ minHeight: "1120px" }}
    >
      {/* 1. TOP HEADER BANNER */}
      <div className="relative bg-[#041931] pt-7 pb-9 pl-7 pr-7 text-white border-b-4 border-[#C59B3F] rounded-t-[2rem] overflow-hidden">
        {/* Luxury Micro Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-luxury-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                {/* Micro tech/luxury grid with diamond & dot accents */}
                <path d="M 32 0 L 0 32 M 0 0 L 32 32" fill="none" stroke="#C59B3F" strokeWidth="0.5" strokeOpacity="0.4" />
                <circle cx="16" cy="16" r="1" fill="#38BDF8" fillOpacity="0.6" />
                <circle cx="0" cy="0" r="1.2" fill="#E5B84B" fillOpacity="0.8" />
                <circle cx="32" cy="0" r="1.2" fill="#E5B84B" fillOpacity="0.8" />
                <circle cx="0" cy="32" r="1.2" fill="#E5B84B" fillOpacity="0.8" />
                <circle cx="32" cy="32" r="1.2" fill="#E5B84B" fillOpacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-luxury-pattern)" />
          </svg>
        </div>

        {/* Elegant Subtle Security Wave Lines across entire header */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg viewBox="0 0 640 180" className="w-full h-full" preserveAspectRatio="none">
            <path d="M 0 35 C 160 85, 480 -15, 640 45" fill="none" stroke="#C59B3F" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 0 75 C 200 120, 440 20, 640 85" fill="none" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
            <path d="M 0 115 C 220 150, 420 60, 640 125" fill="none" stroke="#C59B3F" strokeWidth="0.8" strokeDasharray="2 4" strokeOpacity="0.5" />
          </svg>
        </div>

        <div className="flex justify-between items-center relative z-10 w-full">
          {/* Left Block: Logo & Platform Info */}
          <div className="flex items-center gap-3 max-w-[260px] flex-shrink-0">
            {/* Logo with double golden ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-[#C59B3F]/30 blur-sm pointer-events-none"></div>
              {logoUrl ? (
                <div className="relative w-16 h-16 rounded-full border-2 border-[#C59B3F] bg-white overflow-hidden flex items-center justify-center p-1 shadow-xl">
                  <img src={logoUrl} alt="Custom Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#0F4C81] via-[#092B4D] to-[#04162B] border-2 border-[#C59B3F] flex items-center justify-center shadow-xl p-1">
                  <div className="w-full h-full rounded-full border border-dashed border-[#C59B3F]/80 flex items-center justify-center bg-[#07203D]">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#E5B84B] fill-current drop-shadow-md">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Typography */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[18px] font-black tracking-tight text-white leading-tight uppercase drop-shadow-sm truncate">
                  {companyName || "UNITY EARNING"}
                </h1>
                <span className="text-[#FBBF24] text-[13px] font-bold" title="Verified Platform">✦</span>
              </div>
              <span className="text-[11px] text-[#38BDF8] font-black tracking-[0.14em] uppercase mt-0.5">
                E-LEARNING PLATFORM
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-200">
                <span className="text-[#E5B84B] text-[12px] font-bold">•</span>
                <span>Learn</span>
                <span className="text-[#E5B84B] text-[12px] font-bold">•</span>
                <span>Grow</span>
                <span className="text-[#E5B84B] text-[12px] font-bold">•</span>
                <span>Earn</span>
              </div>
            </div>
          </div>

          {/* Right Block: Verified Badge & Invoice Receipt Details - Fully padded & protected against clipping */}
          <div className="flex flex-col items-end text-right flex-shrink-0 max-w-[210px] pr-1">
            {/* Top Pill Badge: VERIFIED & SECURED */}
            <div className="flex items-center gap-1.5 bg-[#031326]/95 border border-emerald-500/50 px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 flex-shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <span className="text-[9px] text-white font-black tracking-wider uppercase whitespace-nowrap">
                VERIFIED & SECURED
              </span>
            </div>

            {/* Invoice / Receipt Heading - Positioned comfortably lower with mt-3.5 */}
            <div className="flex flex-col mt-3.5 items-end">
              <span className="text-[11.5px] text-slate-100 font-black tracking-widest uppercase whitespace-nowrap drop-shadow-sm">
                INVOICE / RECEIPT
              </span>

              {/* Date */}
              <span className="text-[11.5px] text-white font-black mt-1 flex items-center gap-1.5 justify-end drop-shadow-sm whitespace-nowrap">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#E5B84B] fill-none stroke-current flex-shrink-0" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {date}
              </span>

              {/* Secure ID pill */}
              <div className="mt-1.5 flex items-center gap-1.5 bg-[#031326]/95 px-2 py-0.5 rounded-md border border-sky-400/30 shadow-inner whitespace-nowrap">
                <span className="text-[7.5px] text-[#38BDF8] font-black tracking-wider uppercase leading-none">
                  SECURE ID:
                </span>
                <span className="text-[8.5px] text-white font-mono font-bold leading-none">
                  EL-{referralCode || "9152178"}-{teamCode || "336251"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS ACTIVATION BANNER */}
      <div className="px-6 -mt-5 relative z-20">
        <div className="bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] border-2 border-[#10B981]/40 rounded-2xl py-3 px-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-md relative">
              <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40"></div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[#042F1A] font-black text-[17px] tracking-tight">
                Activation Successful
              </span>
              <span className="text-[#0A1D37] text-[12px] font-black uppercase tracking-wider">
                System Verified ID
              </span>
            </div>
          </div>
          <div className="bg-[#D1FAE5] border border-[#10B981]/50 text-[#065F46] text-[11.5px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            ACTIVE
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5 flex-grow">
        {/* 3. ID HOLDER DETAILS CARD - WITH BALANCED COLOR PALETTE */}
        <div className="rounded-[1.5rem] border border-slate-300/80 overflow-hidden shadow-md flex bg-white relative">
          {/* Left Details Block with 8 perfectly aligned rows */}
          <div className="w-[72%] flex flex-col border-r border-slate-200">
            {/* Row 1: Status */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6z" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Status</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-500/40 px-3 py-1 rounded-full text-[12px] font-black text-emerald-700 shadow-sm">
                  <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse"></span>
                  একটিভ (Active)
                </span>
              </div>
            </div>

            {/* Row 2: ID Holder (Name) */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">ID Holder</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center gap-2 overflow-hidden">
                <span className="text-[#0A1D37] font-black text-[17px] tracking-tight truncate">{name}</span>
                <span className="w-5 h-5 rounded-full bg-[#1E40AF] flex items-center justify-center text-white p-0.5 shadow-sm flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 3: Email */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Email ID</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center overflow-hidden">
                <span className="text-slate-800 font-extrabold text-[14.5px] break-all truncate">{email}</span>
              </div>
            </div>

            {/* Row 4: Phone */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Phone</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-slate-800 font-extrabold text-[14.5px] tracking-wide">{phone}</span>
              </div>
            </div>

            {/* Row 5: Student ID */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="4" />
                  <line x1="8" y1="2" x2="8" y2="4" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Student ID</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-slate-900 font-extrabold text-[14.5px] tracking-widest">{referralCode}</span>
              </div>
            </div>

            {/* Row 6: Team Code */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Team Code</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-[#1E40AF] font-black text-[14.5px] tracking-wider">{teamCode}</span>
              </div>
            </div>

            {/* Row 7: Team Leader (TL) */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Team Leader</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-[#0A1D37] font-black text-[14.5px] tracking-tight">{teamLeader || "N/A"}</span>
              </div>
            </div>

            {/* Row 8: Team Trainer (TR) */}
            <div className="flex min-h-[46px]">
              <div className="w-[36%] bg-[#06203D] px-3.5 py-2.5 flex items-center gap-2 text-white border-r border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] fill-none stroke-current" strokeWidth="2.5">
                  <path d="M12 15l-2 5l4-2l4 2l-2-5" />
                  <circle cx="12" cy="9" r="6" />
                </svg>
                <span className="text-[12px] font-black tracking-wide text-white whitespace-nowrap">Team Trainer</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-[#0A1D37] font-black text-[14.5px] tracking-tight">{teamTrainer || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign / ID Activation Successful Seal */}
          <div className="w-[28%] bg-gradient-to-b from-emerald-50/30 via-slate-50/60 to-slate-100/80 flex flex-col items-center justify-center p-3 relative overflow-hidden">
            {/* Background Circular Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
              <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#10B981]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <div className="w-36 h-36 rounded-full border border-[#0F4C81]"></div>
            </div>

            {avatarUrl ? (
              <div className="relative w-24 h-24 rounded-full border-4 border-[#10B981] shadow-lg overflow-hidden p-0.5 bg-white z-10">
                <img src={avatarUrl} alt="ID Holder" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="relative flex flex-col items-center z-10">
                {/* Professional Green Sign & Verification Seal SVG */}
                <svg viewBox="0 0 120 120" className="w-26 h-26 drop-shadow-md">
                  <defs>
                    <linearGradient id="sealGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="40%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="innerGreenDisc" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#064E3B" />
                      <stop offset="100%" stopColor="#022C22" />
                    </linearGradient>
                    <linearGradient id="goldAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer Rosette / Star Rays */}
                  <circle cx="60" cy="56" r="46" fill="none" stroke="url(#sealGreenGrad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
                  
                  {/* Outer Solid Green Ring */}
                  <circle cx="60" cy="56" r="41" fill="none" stroke="url(#sealGreenGrad)" strokeWidth="2.5" />
                  
                  {/* Inner Dark Emerald Disc */}
                  <circle cx="60" cy="56" r="37" fill="url(#innerGreenDisc)" />
                  <circle cx="60" cy="56" r="34" fill="none" stroke="#34D399" strokeWidth="1" opacity="0.4" />
                  
                  {/* Decorative Stars */}
                  <path d="M 60 25 L 61.5 29 L 65.5 29.5 L 62.5 32 L 63.5 36 L 60 33.5 L 56.5 36 L 57.5 32 L 54.5 29.5 L 58.5 29 Z" fill="#34D399" transform="scale(0.55) translate(49, 18)" />
                  
                  {/* Professional Green Sign / Signature Pen & Wave Stroke */}
                  {/* Pen / Stylus */}
                  <path d="M 69 36 L 77 44 L 53 68 L 45 68 L 45 60 Z" fill="url(#sealGreenGrad)" />
                  <path d="M 73 32 L 79 38 L 77 40 L 71 34 Z" fill="#A7F3D0" />
                  <circle cx="45" cy="68" r="1.5" fill="#34D399" />
                  
                  {/* Green Handwritten Signature Wave */}
                  <path d="M 37 66 Q 44 58 50 66 T 64 63 T 76 66" fill="none" stroke="#6EE7B7" strokeWidth="2.4" strokeLinecap="round" />
                  
                  {/* Verified Checkmark Stamp in Green */}
                  <circle cx="73" cy="63" r="9.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.8" />
                  <path d="M 69.5 63 L 72 65.5 L 76.5 60.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute -top-1 left-2 text-[#34D399] text-[11px] animate-pulse">✦</span>
                <span className="absolute top-2 right-2 text-[#34D399] text-[11px] animate-pulse delay-100">✦</span>
              </div>
            )}

            {/* ID Activation Successful Text (No official seal text) */}
            <div className="mt-3 flex flex-col items-center text-center z-10 select-none px-1">
              <span className="text-[#0A2E5C] font-black text-[11px] tracking-tight leading-tight uppercase">
                ID Activation
              </span>
              <span className="text-[#10B981] font-black text-[10.5px] tracking-wider leading-tight uppercase mt-0.5">
                Successful
              </span>
            </div>
          </div>
        </div>

        {/* 4. FINANCIAL SUMMARY PANEL (Cashback, Payment Method, Amount Paid) */}
        <div className="bg-[#002B4D] rounded-[1.5rem] p-4 flex items-center text-white shadow-lg border border-[#001D36]">
          {/* Column 1: Cashback */}
          <div className="w-[33%] flex items-center gap-3 border-r border-[#1E3A5F] pr-2">
            <div className="w-11 h-11 rounded-full bg-[#1E40AF]/60 border border-sky-400/30 flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 text-sky-300 fill-none stroke-current" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                <line x1="12" y1="17" x2="12" y2="17" />
                <path d="M12 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[#7DD3FC] text-[8.5px] font-extrabold tracking-wider uppercase leading-none">
                CASHBACK RECEIVED
              </span>
              <span className="text-[#FBBF24] text-2xl font-black font-sans mt-0.5 tracking-tight flex items-center leading-none">
                {cashback} <span className="text-lg ml-0.5">৳</span>
              </span>
            </div>
          </div>

          {/* Column 2: Payment Method */}
          <div className="w-[34%] flex flex-col items-center border-r border-[#1E3A5F] px-2 text-center">
            <span className="text-[#7DD3FC] text-[8.5px] font-extrabold tracking-wider uppercase mb-1.5 leading-none">
              PAYMENT METHOD
            </span>
            <div className="flex justify-center items-center h-8">
              <PaymentMethodLogo method={paymentMethod} className="h-7" />
            </div>
          </div>

          {/* Column 3: Amount Paid */}
          <div className="w-[33%] flex items-center justify-end gap-3 pl-2">
            <div className="flex flex-col items-end text-right">
              <span className="text-[#7DD3FC] text-[8.5px] font-extrabold tracking-wider uppercase leading-none">
                AMOUNT PAID
              </span>
              <span className="text-[#FBBF24] text-2xl font-black font-sans mt-0.5 tracking-tight flex items-center leading-none">
                {amountPaid} <span className="text-lg ml-0.5">৳</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 5. THANK YOU BANNER */}
        <div className="bg-gradient-to-r from-[#F0FDF4] via-[#F6FDF9] to-[#ECFDF5] border border-[#10B981]/30 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          {/* Ribbon Award badge on left */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-[#10B981] fill-current">
                <path d="M12,24 L10,38 L20,32 L30,38 L28,24 Z" fill="#047857" />
                <circle cx="20" cy="18" r="14" />
                <circle cx="20" cy="18" r="11" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
                <text x="20" y="23" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="sans-serif">
                  ৳
                </text>
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-serif italic font-black text-xl text-[#03543F] leading-none mb-1">
                Thank You!
              </span>
              <p className="text-[12px] text-slate-900 font-black leading-normal">
                We appreciate your trust in <span className="text-[#03543F]">{companyName}</span>.
              </p>
              <p className="text-[11.5px] text-slate-800 font-extrabold leading-normal">
                Keep learning, keep earning.
              </p>
            </div>
          </div>

          {/* Stack of books + Graduation Cap Vector Graphic */}
          <div className="pr-1">
            <svg viewBox="0 0 100 80" className="w-16 h-14">
              <defs>
                <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              <path d="M 15,20 C 12,15 20,10 22,15 C 24,20 18,22 15,20 Z" fill="#34D399" opacity="0.6" />
              <path d="M 85,30 C 82,25 90,20 92,25 C 94,30 88,32 85,30 Z" fill="#34D399" opacity="0.6" />

              <rect x="25" y="48" width="50" height="10" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="25" y="48" width="8" height="10" fill="#EF4444" />
              
              <rect x="20" y="55" width="60" height="12" rx="2" fill="url(#bookGrad)" />
              <rect x="20" y="55" width="10" height="12" fill="#FBBF24" />
              <line x1="72" y1="57" x2="78" y2="57" stroke="white" strokeWidth="1.5" />
              <line x1="72" y1="61" x2="78" y2="61" stroke="white" strokeWidth="1.5" />

              <polygon points="50,22 80,32 50,42 20,32" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
              <rect x="42" y="36" width="16" height="8" fill="#334155" />
              <path d="M 50,32 L 32,36 L 32,44" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="32" cy="45" r="2" fill="#FBBF24" />
            </svg>
          </div>
        </div>

        {/* 6. BENGALI NOTIFICATIONS / GUIDANCE BOXES */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Box 1: Successful Activation */}
          <div className="bg-[#EEF6FF] border-2 border-[#BFDBFE] rounded-2xl px-5 py-3.5 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="3.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 11l2 2 4-4" />
              </svg>
            </div>
            <p className="text-[14.5px] text-[#0A2540] font-black leading-snug">
              {companyName} ই-লার্নিং প্ল্যাটফর্মে আপনার আইডি সফলভাবে সক্রিয় হয়েছে।
            </p>
          </div>

          {/* Box 2: Password Security Warning */}
          <div className="bg-[#FFF5F5] border-2 border-[#FECACA] rounded-2xl px-5 py-3.5 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="3.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <p className="text-[14.5px] text-[#7A0D0D] font-black leading-snug">
              আপনার অ্যাকাউন্টের পাসওয়ার্ড সুরক্ষিত রাখুন, পাসওয়ার্ড কাউকে শেয়ার করবেন না।
            </p>
          </div>
        </div>
      </div>

      {/* 7. FOOTER INFORMATION GRID (TxID, QR Code, Stay Connected) */}
      <div className="border-t border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-slate-50 flex items-center justify-between mt-auto">
        {/* Transaction ID Info */}
        <div className="w-[33%] flex flex-col items-start">
          <span className="text-[8.5px] text-slate-500 font-black tracking-wider uppercase">
            TRANSACTION ID
          </span>
          <span className="text-[14px] font-mono font-black text-[#0A1D37] mt-0.5 tracking-wide">
            #{transactionId}
          </span>
          {/* Handwritten ink signature */}
          <div className="mt-1 flex flex-col items-start">
            <svg viewBox="0 0 140 40" className="w-28 h-7 text-[#1E40AF] opacity-95 -mb-1 transform -rotate-1">
              <path
                d="M 10,28 C 20,25 35,5 45,15 C 55,25 40,35 60,18 C 80,1 90,30 100,12 C 110,-4 115,35 125,20 C 130,12 135,18 140,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 25,20 Q 75,32 125,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
            <span className="text-[7.5px] text-slate-500 font-extrabold tracking-wider uppercase leading-none mt-0.5">
              Authorized Signature
            </span>
          </div>
        </div>

        {/* Dynamic Scan to Visit QR Code */}
        <div className="w-[34%] flex flex-col items-center justify-center text-center">
          <span className="text-[8.5px] text-slate-500 font-black tracking-wider uppercase mb-1.5">
            SCAN TO VISIT
          </span>
          <div className="relative p-1 bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C59B3F]"></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C59B3F]"></div>
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#C59B3F]"></div>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C59B3F]"></div>
            <QRCodeSVG value={shareLink} size={48} level="M" />
          </div>
        </div>

        {/* Stay Connected info */}
        <div className="w-[33%] flex flex-col items-end text-right">
          <span className="text-[8.5px] text-slate-500 font-black tracking-wider uppercase">
            STAY CONNECTED
          </span>
          <a
            href={`https://${companyWebsite}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-black text-[#0A1D37] hover:underline mt-0.5"
          >
            {companyWebsite}
          </a>
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.91 9c-.14.65-.53.81-1.08.5l-2.91-2.15-1.4 1.35c-.15.15-.28.27-.58.27l.2-2.9 5.28-4.77c.23-.2-.05-.31-.36-.1L10.02 13.1l-2.81-.88c-.61-.19-.62-.61.13-.9l11-4.24c.51-.19.96.12.78.91l-.16.62z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 8. BOTTOM FOOTER STRIP */}
      <div className="bg-[#011C30] text-slate-400 py-2 px-6 flex justify-between items-center text-[9px] rounded-b-[2rem]">
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#C59B3F] fill-current">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
          </svg>
          <span className="font-extrabold tracking-wide uppercase">{companyName.toUpperCase()} E-LEARNING PLATFORM</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span>Your Success, Our Priority</span>
          <span className="text-[#C59B3F] text-[11.5px] animate-pulse">💛</span>
        </div>
      </div>
    </div>
  );
};
