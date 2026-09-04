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
      <div className="relative bg-[#0a2353] pt-8 pb-10 pl-8 pr-8 text-white border-b-0 rounded-t-[2rem] overflow-hidden flex items-center justify-between">
        
        {/* Subtle Background Pattern (Circuit/Tech Pattern) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="header-circuit-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M10 10h10v10M30 10v10h-10M10 30h10v-10M30 30v-10h-10" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <circle cx="10" cy="10" r="1.5" fill="#60a5fa" />
                <circle cx="30" cy="10" r="1.5" fill="#60a5fa" />
                <circle cx="10" cy="30" r="1.5" fill="#60a5fa" />
                <circle cx="30" cy="30" r="1.5" fill="#60a5fa" />
                <path d="M5 20h30M20 5v30" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <path d="M 0 5 L 5 10 L 5 15 M 40 5 L 35 10 L 35 15 M 15 40 L 15 35 L 25 35 M 5 25 L 5 35 L 10 40" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <circle cx="5" cy="15" r="1" fill="#60a5fa" />
                <circle cx="35" cy="15" r="1" fill="#60a5fa" />
                <circle cx="15" cy="35" r="1" fill="#60a5fa" />
                <circle cx="5" cy="25" r="1" fill="#60a5fa" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-circuit-pattern)" />
          </svg>
        </div>
        {/* Radial gradient overlay to soften edges and text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2353]/50 via-transparent to-[#0a2353]/80 pointer-events-none" />

        {/* Left Block: Logo & Title */}
        <div className="flex items-center gap-4 z-10">
          <div className="relative flex-shrink-0">
             {logoUrl ? (
                <div className="relative w-20 h-20 rounded-full bg-white overflow-hidden flex items-center justify-center p-1 shadow-xl">
                  <img src={logoUrl} alt="Custom Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="relative w-20 h-20 rounded-full border-[2px] border-[#cbd5e1] bg-[#0c244b] flex items-center justify-center shadow-xl p-0.5 overflow-hidden">
                   {/* Circular Badge Seal matching uploaded image */}
                   <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="outerBlueSeal" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e3a8a"/>
                          <stop offset="100%" stopColor="#0f172a"/>
                        </linearGradient>
                        <linearGradient id="silverRing" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#94a3b8"/>
                          <stop offset="50%" stopColor="#f8fafc"/>
                          <stop offset="100%" stopColor="#cbd5e1"/>
                        </linearGradient>
                      </defs>

                      <circle cx="100" cy="100" r="98" fill="url(#silverRing)" />
                      <circle cx="100" cy="100" r="94" fill="url(#outerBlueSeal)" />
                      
                      {/* Text paths */}
                      <path id="tpTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="transparent" />
                      <path id="tpBottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="transparent" />

                      <text fill="#ffffff" fontSize="22" fontWeight="bold" fontFamily="sans-serif" letterSpacing="3">
                        <textPath href="#tpTop" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">UNITY EARNING</textPath>
                      </text>
                      <text fill="#ffffff" fontSize="15" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5">
                        <textPath href="#tpBottom" startOffset="50%" textAnchor="middle" dominantBaseline="baseline">E-LEARNING PLATFORM</textPath>
                      </text>

                      {/* Side Stars */}
                      <polygon points="25,95 28,103 36,103 30,108 32,116 25,111 18,116 20,108 14,103 22,103" fill="#cbd5e1"/>
                      <polygon points="175,95 178,103 186,103 180,108 182,116 175,111 168,116 170,108 164,103 172,103" fill="#cbd5e1"/>

                      {/* Inner circle */}
                      <circle cx="100" cy="100" r="56" fill="url(#silverRing)" />
                      <circle cx="100" cy="100" r="50" fill="#0f172a" />

                      {/* Center Graduation Cap Icon */}
                      <circle cx="100" cy="78" r="7" fill="#cbd5e1" />
                      <path d="M 82,74 L 100,64 L 118,74 L 100,79 Z" fill="#cbd5e1" />
                      <path d="M 85,82 Q 100,95 115,82 L 115,92 Q 100,102 85,92 Z" fill="#cbd5e1" />
                   </svg>
                </div>
              )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
              UNITY <span className="text-[#38bdf8] font-semibold">EARNING</span>
            </h1>
            <span className="text-[13px] text-[#e2e8f0] font-normal tracking-[0.1em] mt-1 uppercase">
              E-LEARNING PLATFORM
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-[12px] font-medium text-white/90">
              <span>Learn</span>
              <span className="text-[#c49a45] text-[16px] leading-none">•</span>
              <span>Grow</span>
              <span className="text-[#c49a45] text-[16px] leading-none">•</span>
              <span>Earn</span>
            </div>
          </div>
        </div>

        {/* Right Block: Details */}
        <div className="flex flex-col items-end z-10 text-right space-y-2">
            {/* Top Pill Badge: VERIFIED & SECURED */}
            <div className="flex items-center gap-1.5 bg-blue-500/20 text-[#60a5fa] px-3 py-1 rounded-full font-bold shadow-sm border border-blue-400/30">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                 {/* Lock icon small */}
                 <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
              <span className="text-[10px] tracking-wide uppercase">
                VERIFIED & SECURED
              </span>
            </div>

            <div className="text-xl font-extrabold tracking-wide uppercase text-white mt-1 drop-shadow-md">
              INVOICE / RECEIPT
            </div>

            <div className="flex items-center gap-2 text-[13px] font-medium text-white/90">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#60a5fa] fill-none stroke-current" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {date}
            </div>

            <div className="flex items-center overflow-hidden rounded-md border border-white/20 shadow-sm mt-1">
              <div className="bg-[#2563eb] text-white/90 text-[9px] font-bold px-2 py-1 uppercase tracking-wider">
                SECURE ID:
              </div>
              <div className="bg-white text-[#0f172a] text-[10px] font-bold px-2 py-1 tracking-widest">
                EL-{referralCode || "9152178"}-{teamCode || "336251"}
              </div>
            </div>
        </div>
      </div>

      {/* 2. SUCCESS ACTIVATION BANNER */}
      <div className="px-6 -mt-5 relative z-20">
        <div className="bg-[#f0fdf4] border border-green-200/60 rounded-[1rem] py-3 px-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white shadow-sm relative">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[#166534] font-black text-[16px] tracking-tight">
                Activation Successful
              </span>
              <span className="text-[#15803d] text-[11px] font-bold uppercase tracking-wider">
                System Verified ID
              </span>
            </div>
          </div>
          <div className="bg-[#dcfce7] border border-[#86efac] text-[#166534] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
            ACTIVE
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-4 flex-grow">
        {/* 3. ID HOLDER DETAILS CARD - WITH BALANCED COLOR PALETTE */}
        <div className="rounded-[1rem] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col bg-white relative">
          
          {/* Status Active Bar right above Name */}
          <div className="bg-emerald-50 px-4 py-1.5 border-b border-emerald-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase">Account Status</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white shadow-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Status: Active
            </span>
          </div>

          <div className="flex bg-white">
          {/* Left Details Block with perfectly aligned rows */}
          <div className="w-[72%] flex flex-col border-r border-slate-200">
            
            {/* Row 1: ID Holder (Name) */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#60a5fa] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">ID Holder</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center gap-2 overflow-hidden">
                <span className="text-black font-black text-[15px] tracking-tight truncate">{name}</span>
                <span className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-white p-0.5 shadow-sm flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#8b5cf6] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Email ID</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center overflow-hidden">
                <span className="text-black font-black text-[14px] break-all truncate">{email}</span>
              </div>
            </div>

            {/* Row 3: Phone */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#10b981] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Phone</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-black font-black text-[14px] tracking-wide">{phone}</span>
              </div>
            </div>

            {/* Row 4: Student ID */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#f59e0b] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="4" />
                    <line x1="8" y1="2" x2="8" y2="4" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Student ID</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-black font-black text-[14px] tracking-widest">{referralCode}</span>
              </div>
            </div>

            {/* Row 5: Team Code */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#0ea5e9] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Team Code</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-black font-black text-[14px] tracking-wider">{teamCode}</span>
              </div>
            </div>

            {/* Row 6: Team Leader (TL) */}
            <div className="flex min-h-[46px] border-b border-slate-200">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#ec4899] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Team Leader</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-black font-black text-[14px] tracking-tight">{teamLeader || "N/A"}</span>
              </div>
            </div>

            {/* Row 7: Team Trainer (TR) */}
            <div className="flex min-h-[46px]">
              <div className="w-[36%] bg-white px-3.5 py-2.5 flex items-center gap-2 border-r border-slate-200">
                <div className="w-8 h-8 rounded-sm bg-[#6366f1] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current" strokeWidth="2.5">
                    <path d="M12 15l-2 5l4-2l4 2l-2-5" />
                    <circle cx="12" cy="9" r="6" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-wide text-slate-900 whitespace-nowrap">Team Trainer</span>
              </div>
              <div className="w-[64%] bg-white px-4 py-2 flex items-center">
                <span className="text-black font-black text-[14px] tracking-tight">{teamTrainer || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign / ID Activation Successful Seal */}
          <div className="w-[28%] bg-[#0a2353] flex flex-col items-center justify-center p-3 relative overflow-hidden">
            {/* Background Circuit/Tech Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circuit-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M10 10h10v10M30 10v10h-10M10 30h10v-10M30 30v-10h-10" fill="none" stroke="#60a5fa" strokeWidth="1" />
                    <circle cx="10" cy="10" r="1.5" fill="#60a5fa" />
                    <circle cx="30" cy="10" r="1.5" fill="#60a5fa" />
                    <circle cx="10" cy="30" r="1.5" fill="#60a5fa" />
                    <circle cx="30" cy="30" r="1.5" fill="#60a5fa" />
                    <path d="M5 20h30M20 5v30" fill="none" stroke="#60a5fa" strokeWidth="1" />
                    {/* Add more lines to look like the image */}
                    <path d="M 0 5 L 5 10 L 5 15 M 40 5 L 35 10 L 35 15 M 15 40 L 15 35 L 25 35 M 5 25 L 5 35 L 10 40" fill="none" stroke="#60a5fa" strokeWidth="1" />
                    <circle cx="5" cy="15" r="1" fill="#60a5fa" />
                    <circle cx="35" cy="15" r="1" fill="#60a5fa" />
                    <circle cx="15" cy="35" r="1" fill="#60a5fa" />
                    <circle cx="5" cy="25" r="1" fill="#60a5fa" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
              </svg>
            </div>
            
            {/* Glowing Center Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[120px] h-[120px] bg-[#3b82f6] blur-[24px] rounded-full opacity-40 pointer-events-none"></div>

            <div className="relative flex flex-col items-center z-10 w-full mb-3 mt-1">
                {/* ID Activation Success Icon */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* Outer animated rings */}
                    <div className="absolute inset-0 border-2 border-[#60a5fa] rounded-full opacity-30"></div>
                    <div className="absolute inset-1.5 border-[1.5px] border-[#93c5fd] rounded-full opacity-50"></div>
                    <div className="absolute inset-3 border-2 border-[#86efac] rounded-full opacity-90"></div>
                    
                    {/* Inner Solid Green Circle */}
                    <div className="relative w-12 h-12 bg-[#166534] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current" strokeWidth="4">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center text-center z-10 mt-1 pb-2">
                <span className="text-[12px] font-bold text-white tracking-wide leading-tight">
                  ID ACTIVATION
                </span>
                <span className="text-[12px] font-bold text-emerald-400 tracking-wide mt-0.5">
                  SUCCESSFUL
                </span>
            </div>
          </div>
          </div>
        </div>

        {/* 4. FINANCIAL SUMMARY PANEL (Cashback, Payment Method, Amount Paid) */}
        <div className="flex gap-4">
          {/* Card 1: Cashback (Light Blue) */}
          <div className="flex-1 bg-[#eff6ff] rounded-[1rem] p-3 flex flex-col items-center justify-center border border-[#bfdbfe] shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
            <div className="flex items-center gap-2 mb-1.5 z-10 w-full justify-start pl-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2563eb] fill-none stroke-current" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="12" y1="17" x2="12" y2="17" />
                  <path d="M12 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-800/70 text-[8.5px] font-bold tracking-wider uppercase leading-none">
                  CASHBACK RECEIVED
                </span>
                <span className="text-blue-950 text-2xl font-black font-sans mt-0.5 tracking-tight flex items-center leading-none">
                  {cashback} <span className="text-xl ml-0.5 font-bold">৳</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Method (Light Purple) */}
          <div className="flex-1 bg-[#f3e8ff] rounded-[1rem] p-3 flex flex-col items-center justify-center border border-[#e9d5ff] shadow-[0_2px_8px_rgba(168,85,247,0.1)]">
            <span className="text-purple-800/70 text-[8.5px] font-bold tracking-wider uppercase mb-1.5 z-10 text-center">
              PAYMENT METHOD
            </span>
            <div className="flex justify-center items-center h-10 w-full z-10">
              <PaymentMethodLogo method={paymentMethod} className="h-8 object-contain" />
            </div>
          </div>

          {/* Card 3: Amount Paid (Light Green) */}
          <div className="flex-1 bg-[#f0fdf4] rounded-[1rem] p-3 flex items-center justify-between border border-[#bbf7d0] shadow-[0_2px_8px_rgba(34,197,94,0.1)]">
            <div className="flex flex-col z-10">
              <span className="text-green-800/70 text-[8.5px] font-bold tracking-wider uppercase leading-none">
                AMOUNT PAID
              </span>
              <span className="text-green-950 text-2xl font-black font-sans mt-0.5 tracking-tight flex items-center leading-none">
                {amountPaid} <span className="text-xl ml-0.5 font-bold">৳</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center z-10 mr-1 shadow-[0_2px_10px_rgba(34,197,94,0.2)]">
              <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

         {/* 5. THANK YOU BANNER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          {/* Ribbon Award badge on left */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg viewBox="0 0 40 40" className="w-12 h-12 text-[#2e7d32] fill-current">
                <path d="M12,24 L8,40 L20,32 L32,40 L28,24 Z" fill="#1b5e20" />
                <circle cx="20" cy="18" r="14" fill="#4caf50" />
                <circle cx="20" cy="18" r="11" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
                <path d="M15 17l4 4l6-6" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-serif italic font-black text-2xl text-[#1b5e20] leading-none mb-1">
                Thank You!
              </span>
              <p className="text-[13px] text-slate-800 font-bold leading-normal">
                We appreciate your trust in {companyName || "Unity Earning"}.
              </p>
              <p className="text-[13px] text-slate-800 font-bold leading-normal">
                Keep learning, keep earning.
              </p>
            </div>
          </div>

          {/* Stack of books + Graduation Cap Vector Graphic */}
          <div className="pr-4">
             <div className="relative w-20 h-16">
               <svg viewBox="0 0 100 80" className="w-full h-full absolute inset-0">
                  {/* Plant leaves */}
                  <path d="M 10,40 Q 5,20 20,30 Q 15,50 10,40" fill="#a7f3d0" />
                  <path d="M 90,40 Q 95,20 80,30 Q 85,50 90,40" fill="#a7f3d0" />
                  
                  {/* Books */}
                  <path d="M 20,55 L 80,55 L 75,65 L 15,65 Z" fill="#60a5fa" />
                  <path d="M 15,65 L 75,65 L 75,70 L 15,70 Z" fill="#eff6ff" />
                  
                  <path d="M 22,45 L 78,45 L 80,55 L 20,55 Z" fill="#1e40af" />
                  <path d="M 20,55 L 80,55 L 80,58 L 20,58 Z" fill="#dbeafe" />

                  {/* Graduation Cap */}
                  <path d="M 50,15 L 80,25 L 50,35 L 20,25 Z" fill="#1e293b" />
                  <path d="M 35,30 L 35,45 Q 50,55 65,45 L 65,30 Z" fill="#334155" />
                  
                  {/* Tassel */}
                  <path d="M 50,25 L 75,32 L 75,45" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="50" cy="25" r="2.5" fill="#f59e0b" />
                  <path d="M 72,45 L 78,45 L 75,55 Z" fill="#f59e0b" />
               </svg>
             </div>
          </div>
        </div>

        {/* 6. BENGALI NOTIFICATIONS / GUIDANCE BOXES */}
        <div className="flex flex-col gap-2 mt-1">
          {/* Box 1: Successful Activation */}
          <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <p className="text-[13px] text-[#0f172a] font-bold leading-snug">
              {companyName || "Unity Earning"} ই-লার্নিং প্ল্যাটফর্মে আপনার আইডি সফলভাবে সক্রিয় হয়েছে।
            </p>
          </div>

          {/* Box 2: Password Security Warning */}
          <div className="bg-[#fef2f2] border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-8 h-8 rounded-md bg-[#dc2626] flex items-center justify-center text-white shadow-sm flex-shrink-0" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <p className="text-[13px] text-[#991b1b] font-bold leading-snug">
              আপনার অ্যাকাউন্টের পাসওয়ার্ড সুরক্ষিত রাখুন, পাসওয়ার্ড কাউকে শেয়ার করবেন না।
            </p>
          </div>
        </div>
      </div>

      {/* 7. FOOTER INFORMATION GRID (TxID, QR Code, Stay Connected) */}
      <div className="border-t border-slate-200 px-6 py-4 bg-[#0a2353] flex items-center justify-between mt-auto">
        {/* Transaction ID Info */}
        <div className="w-[33%] flex flex-col items-start">
          <span className="text-[8.5px] text-blue-200 font-bold tracking-wider uppercase">
            TRANSACTION ID
          </span>
          <span className="text-[14px] font-mono font-bold text-white mt-0.5 tracking-wide">
            #{transactionId}
          </span>
          {/* Handwritten ink signature */}
          <div className="mt-1 flex flex-col items-start">
            <svg viewBox="0 0 140 40" className="w-28 h-7 text-white opacity-90 -mb-1 transform -rotate-1">
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
            <span className="text-[7.5px] text-blue-200 font-bold tracking-wider uppercase leading-none mt-0.5">
              Authorized Signature
            </span>
          </div>
        </div>

        {/* Dynamic Scan to Visit QR Code */}
        <div className="w-[34%] flex flex-col items-center justify-center text-center">
          <span className="text-[8.5px] text-blue-200 font-bold tracking-wider uppercase mb-1.5">
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
          <span className="text-[8.5px] text-blue-200 font-bold tracking-wider uppercase">
            STAY CONNECTED
          </span>
          <a
            href={`https://${companyWebsite}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-bold text-white hover:underline mt-0.5"
          >
            {companyWebsite}
          </a>
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-white text-[#1877F2] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-white text-[#FF0000] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-white text-[#0088cc] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.91 9c-.14.65-.53.81-1.08.5l-2.91-2.15-1.4 1.35c-.15.15-.28.27-.58.27l.2-2.9 5.28-4.77c.23-.2-.05-.31-.36-.1L10.02 13.1l-2.81-.88c-.61-.19-.62-.61.13-.9l11-4.24c.51-.19.96.12.78.91l-.16.62z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 8. BOTTOM FOOTER STRIP */}
      <div className="bg-[#0f172a] text-slate-300 py-2 px-6 flex justify-between items-center text-[9px] rounded-b-[2rem]">
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
