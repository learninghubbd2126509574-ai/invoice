import React from "react";
import { InvoiceData } from "../types";
import { InvoicePaymentMark, getPaymentMethodDisplayName } from "./BrandLogos";
import { QRCodeSVG } from "qrcode.react";

interface InvoicePreviewProps {
  data: InvoiceData;
  verificationUrl?: string;
  isSharedPage?: boolean;
}

/**
 * Top Brand Emblem for Unity Earning
 */
const UnityEarningEmblem: React.FC<{ className?: string }> = ({
  className = "w-16 h-16",
}) => (
  <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="ueNavyRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#164B8A" />
        <stop offset="100%" stopColor="#0B2548" />
      </linearGradient>
      <linearGradient id="ueLeafLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2ECC71" />
        <stop offset="100%" stopColor="#1E8449" />
      </linearGradient>
      <linearGradient id="ueLeafRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#68D391" />
        <stop offset="100%" stopColor="#27AE60" />
      </linearGradient>
    </defs>

    <circle cx="48" cy="48" r="45" fill="#F4F9FD" />
    <path
      d="M 68 10 A 43 43 0 1 0 88 63 A 39 39 0 1 1 68 10 Z"
      fill="url(#ueNavyRing)"
    />
    <path
      d="M 68 10 A 43 43 0 0 1 88 63 A 40 40 0 0 0 65 13 Z"
      fill="#7FB3D5"
      opacity="0.65"
    />
    <path
      d="M 46.5 78 C 25 72 19 51 24 33 C 34 38 43 51 46.5 78 Z"
      fill="url(#ueLeafLeft)"
    />
    <path
      d="M 49.5 78 C 71 72 77 51 72 33 C 62 38 53 51 49.5 78 Z"
      fill="url(#ueLeafRight)"
    />
    <circle cx="48" cy="27" r="6.8" fill="#13457D" />
    <path
      d="M 30 35 C 39 42 57 42 66 35 C 59 46 53 56 48 75 C 43 56 37 46 30 35 Z"
      fill="#0F3460"
    />
  </svg>
);

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  data,
  verificationUrl = "",
}) => {
  const {
    name = "Md Sakib Hassan",
    email = "mdsakibassan826@gmail.com",
    phone = "01952390826",
    referralCode = "5373259",
    teamCode = "336251",
    teamLeader = "",
    teamTrainer = "",
    cashback = "300",
    amountPaid = "499",
    paymentMethod = "Bkash",
    companyName = "Unity Earning",
    companyWebsite = "www.unityearning.com",
    transactionId = "TR-608C9-654",
    date = "October 31, 2026",
    logoUrl,
  } = data;

  const shareLink =
    verificationUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/?id=${data.id || "demo"}`
      : `https://${companyWebsite}`);

  const trimmedCompany = (companyName || "Unity Earning").trim();
  const companyParts = trimmedCompany.split(/\s+/);
  const primaryBrandWord = companyParts[0] || "UNITY";
  const secondaryBrandWords = companyParts.slice(1).join(" ");

  const cleanLeaderName =
    !teamLeader || teamLeader === "N/A"
      ? null
      : teamLeader.trim().replace(/^tl\s+/i, "");

  const cleanTrainerName =
    !teamTrainer || teamTrainer === "N/A"
      ? null
      : teamTrainer.trim().replace(/^tr\s+/i, "");

  const cleanTxId = (transactionId || "TR-608C9-654").replace(/^#+/, "");
  const cleanWebsite = (companyWebsite || "www.unityearning.com").replace(/^https?:\/\//, "");
  const paymentDisplayName = getPaymentMethodDisplayName(paymentMethod);

  return (
    <div
      id="invoice-capture-area"
      className="w-[680px] bg-white text-[#0E2954] flex flex-col font-sans select-none mx-auto relative overflow-hidden"
    >
      {/* =========================================================
          1. TOP HEADER: BRAND LOCKUP + VERIFIED & SECURE SEAL
         ========================================================= */}
      <div className="px-9 pt-7 pb-4 flex items-center justify-between relative z-20">
        {/* Left: Emblem + Brand Typography */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0">
            {logoUrl ? (
              <div className="w-[66px] h-[66px] rounded-full bg-white border border-slate-200/90 p-0.5 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={logoUrl}
                  alt={trimmedCompany}
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <UnityEarningEmblem className="w-[66px] h-[66px] -mr-0.5" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-[29px] font-extrabold tracking-[-0.02em] leading-none uppercase whitespace-nowrap">
              <span className="text-[#0E2954]">{primaryBrandWord}</span>
              {secondaryBrandWords && (
                <>
                  {" "}
                  <span className="text-[#1565D8]">{secondaryBrandWords}</span>
                </>
              )}
            </h1>
            <span className="text-[12px] font-bold text-[#0E2954] tracking-[0.23em] uppercase mt-1.5 leading-none">
              E-LEARNING PLATFORM
            </span>
            <div className="flex items-center gap-2.5 mt-2 text-[12px] font-semibold text-[#1967D2] tracking-[0.06em] leading-none">
              <span>Learn</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" aria-hidden="true" />
              <span>Grow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" aria-hidden="true" />
              <span>Earn</span>
            </div>
          </div>
        </div>

        {/* Right: Vertical Hairline + Verified & Secure Badge */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="h-14 w-[1px] bg-[#CBD5E1]" aria-hidden="true" />
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 36 40" className="w-8 h-9 shrink-0" aria-hidden="true">
              <path
                d="M18 2 L33 8 V19 C33 28.5 26.5 35.8 18 38.5 C9.5 35.8 3 28.5 3 19 V8 L18 2 Z"
                fill="#0F3460"
              />
              <circle cx="18" cy="20" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
              <path
                d="M14.5 20.2 L17 22.7 L22 17.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-[13px] font-extrabold text-[#0E2954] leading-tight">
                Verified &amp; Secure
              </span>
              <span className="text-[11px] font-medium text-[#486581] leading-tight mt-0.5">
                Your Trust, Our Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Rule */}
      <div className="mx-9 border-b border-[#DCE5F0]" />

      {/* =========================================================
          2. DOCUMENT TITLE & INVOICE DATE / SECURE ID
         ========================================================= */}
      <div className="px-9 py-4 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-[27px] font-extrabold text-[#0E2954] tracking-[-0.015em] leading-none uppercase">
            INVOICE / RECEIPT
          </h2>
          <p className="text-[13px] font-medium text-[#486581] mt-1.5 leading-snug">
            Purchase Confirmation &amp; Payment Details
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 28 28"
              className="w-7 h-7 text-[#0E2954] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3.5" y="5" width="21" height="19.5" rx="3" />
              <line x1="9" y1="2.5" x2="9" y2="7" strokeLinecap="round" />
              <line x1="19" y1="2.5" x2="19" y2="7" strokeLinecap="round" />
              <line x1="3.5" y1="10.5" x2="24.5" y2="10.5" />
              <circle cx="9.5" cy="15" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="14" cy="15" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="18.5" cy="15" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="9.5" cy="19.5" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="14" cy="19.5" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="18.5" cy="19.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-[#526D82] leading-none">
                Invoice Date
              </span>
              <span className="text-[14.5px] font-extrabold text-[#0E2954] tabular-nums leading-none mt-1">
                {date}
              </span>
            </div>
          </div>

          <div className="bg-[#EAF2FD] border border-[#CFE1FA] rounded-lg px-3.5 py-1.5 flex items-center gap-2">
            <span className="text-[11.5px] font-bold text-[#1565D8] leading-none">
              Secure ID:
            </span>
            <span className="text-[12.5px] font-extrabold text-[#0E2954] font-mono tabular-nums tracking-tight leading-none">
              EL-{referralCode || "5373259"}-{teamCode || "336251"}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Rule */}
      <div className="mx-9 border-b border-[#DCE5F0]" />

      {/* =========================================================
          3. ACTIVATION SUCCESSFUL STATUS BANNER
         ========================================================= */}
      <div className="px-9 pt-3.5">
        <div className="bg-gradient-to-r from-[#ECFBF2] via-[#F3FDF7] to-[#ECFBF2] border border-[#9CE0BA] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-[0_2px_6px_rgba(22,163,74,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#22A559] flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-current"
                strokeWidth="3"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-extrabold text-[#146C38] leading-tight">
                Activation Successful
              </span>
              <span className="text-[12px] font-semibold text-[#2D6A4F] leading-tight mt-0.5">
                System Verified ID
              </span>
            </div>
          </div>

          <div className="bg-[#E3F7EC] border border-[#7AD9A3] rounded-full px-4 py-1.5 flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#188642]" aria-hidden="true" />
            <span className="text-[11.5px] font-extrabold text-[#146C38] tracking-[0.08em] uppercase leading-none">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. MAIN 2-COLUMN BODY: HIGHLIGHTED ACCOUNT DETAILS + SEAL BOX
         ========================================================= */}
      <div className="px-9 pt-3.5 grid grid-cols-12 gap-4 items-stretch">
        {/* LEFT (8 cols): ACCOUNT DETAILS FORMAL HIGHLIGHTED TABLE */}
        <div className="col-span-8 rounded-xl border border-[#BFD0E4] bg-white overflow-hidden flex flex-col shadow-[0_3px_12px_rgba(14,41,84,0.05)]">
          {/* Executive Corporate Navy Header */}
          <div className="bg-gradient-to-r from-[#0B2548] via-[#133A6E] to-[#1B4F91] px-4 py-2.5 flex items-center justify-between border-b border-[#0B2548]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-white/15 border border-white/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current shrink-0" aria-hidden="true">
                  <circle cx="12" cy="7.5" r="4" />
                  <path d="M4.5 20.2c0-3.8 3.3-6.7 7.5-6.7s7.5 2.9 7.5 6.7H4.5z" />
                </svg>
              </div>
              <span className="text-[12.5px] font-extrabold text-white tracking-[0.08em] uppercase leading-none">
                ACCOUNT DETAILS
              </span>
            </div>
            <span className="text-[9.5px] font-bold text-sky-200 tracking-[0.12em] uppercase">
              Verified Profile
            </span>
          </div>

          {/* 7 Highlighted & Structured Data Rows */}
          <div className="divide-y divide-[#DCE6F2] flex-1 flex flex-col">
            {/* Row 1: ID Holder (Primary Highlighted Row) */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F1F6FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E1EDFD] border border-[#C6DCFA] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <circle cx="12" cy="7.5" r="3.8" />
                    <path d="M5 19.8c0-3.5 3.1-6.2 7-6.2s7 2.7 7 6.2H5z" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  ID Holder
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-[#F8FBFF] flex items-center justify-between gap-2 min-w-0">
                <span className="text-[14.5px] font-extrabold text-[#0B2548] truncate">
                  {name}
                </span>
                <span
                  className="w-4 h-4 rounded-full bg-[#1565D8] text-white flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-none stroke-current" strokeWidth="2.8">
                    <polyline points="13 4.5 6.5 11 3 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 2: Email ID */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F5F8FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E6EFFC] border border-[#CFE0F8] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11zm2.2-.3 6.8 5.1 6.8-5.1H5.2zm13.8 2-6.4 4.8a1 1 0 0 1-1.2 0L5 8.2v9.3c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.2z" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Email ID
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-white flex items-center min-w-0">
                <span className="text-[13px] font-bold text-[#0E2954] truncate">
                  {email}
                </span>
              </div>
            </div>

            {/* Row 3: Phone */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F1F6FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E1EDFD] border border-[#C6DCFA] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Phone
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-[#FAFBFD] flex items-center min-w-0">
                <span className="text-[13.5px] font-extrabold text-[#0B2548] tabular-nums tracking-tight truncate">
                  {phone}
                </span>
              </div>
            </div>

            {/* Row 4: Student ID (Clean Unboxed Typography) */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F5F8FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E6EFFC] border border-[#CFE0F8] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5L12 3zm-6 9.3v3.5C6 18.1 8.7 20 12 20s6-1.9 6-4.2v-3.5l-6 3-6-3z" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Student ID
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-white flex items-center min-w-0">
                <span className="text-[14px] font-extrabold text-[#0B2548] tabular-nums tracking-[0.02em] truncate">
                  {referralCode}
                </span>
              </div>
            </div>

            {/* Row 5: Team Code (Clean Unboxed Typography) */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F1F6FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E1EDFD] border border-[#C6DCFA] flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-[#123E75] fill-none stroke-current"
                    strokeWidth="2.4"
                    aria-hidden="true"
                  >
                    <polyline points="8 7 3 12 8 17" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="16 7 21 12 16 17" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="13.5" y1="5" x2="10.5" y2="19" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Team Code
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-[#FAFBFD] flex items-center min-w-0">
                <span className="text-[14px] font-extrabold text-[#0B2548] tabular-nums tracking-[0.02em] truncate">
                  {teamCode}
                </span>
              </div>
            </div>

            {/* Row 6: Team Leader (Refined Separated TL Emblem + Name) */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F5F8FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E6EFFC] border border-[#CFE0F8] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.4" />
                    <path d="M2.5 19.2c0-3.1 2.9-5.5 6.5-5.5s6.5 2.4 6.5 5.5H2.5z" />
                    <circle cx="17" cy="9" r="2.6" />
                    <path d="M15.3 14.3c3 .3 5.2 2.2 5.2 4.9h-3.6c-.1-1.9-.7-3.6-1.6-4.9z" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Team Leader
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-white flex items-center gap-2 min-w-0">
                {cleanLeaderName ? (
                  <>
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#0F3460] to-[#1D4ED8] text-white text-[10px] font-extrabold tracking-[0.08em] px-2 py-[3px] rounded-full leading-none shadow-2xs shrink-0">
                      TL
                    </span>
                    <span className="h-3.5 w-[1px] bg-[#CBD5E1] shrink-0" aria-hidden="true" />
                    <span className="text-[13.5px] font-extrabold text-[#0B2548] truncate">
                      {cleanLeaderName}
                    </span>
                  </>
                ) : (
                  <span className="text-[13.5px] font-bold text-slate-400">N/A</span>
                )}
              </div>
            </div>

            {/* Row 7: Team Trainer (Refined Separated TR Emblem + Name) */}
            <div className="grid grid-cols-12 items-center min-h-[40px] flex-1">
              <div className="col-span-5 h-full px-3 py-2 bg-[#F1F6FC] border-r border-[#DCE6F2] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E1EDFD] border border-[#C6DCFA] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#123E75] fill-current" aria-hidden="true">
                    <circle cx="10" cy="9" r="3.4" />
                    <path d="M3.5 20c0-3.1 2.9-5.5 6.5-5.5s6.5 2.4 6.5 5.5H3.5z" />
                    <polygon points="18,3 19.1,5.3 21.6,5.6 19.8,7.4 20.2,9.9 18,8.7 15.8,9.9 16.2,7.4 14.4,5.6 16.9,5.3" />
                  </svg>
                </div>
                <span className="text-[12.5px] font-bold text-[#1E3A5F] whitespace-nowrap">
                  Team Trainer
                </span>
              </div>
              <div className="col-span-7 h-full px-3.5 py-2 bg-[#FAFBFD] flex items-center gap-2 min-w-0">
                {cleanTrainerName ? (
                  <>
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#136534] to-[#1E8E3E] text-white text-[10px] font-extrabold tracking-[0.08em] px-2 py-[3px] rounded-full leading-none shadow-2xs shrink-0">
                      TR
                    </span>
                    <span className="h-3.5 w-[1px] bg-[#CBD5E1] shrink-0" aria-hidden="true" />
                    <span className="text-[13.5px] font-extrabold text-[#0B2548] truncate">
                      {cleanTrainerName}
                    </span>
                  </>
                ) : (
                  <span className="text-[13.5px] font-bold text-slate-400">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (4 cols): HIGHLIGHTED OFFICIAL VERIFICATION SEAL BOX */}
        <div className="col-span-4 rounded-xl border border-[#B8D3EE] bg-gradient-to-b from-[#F0F7FF] via-[#FFFFFF] to-[#ECF9F2] flex flex-col justify-between items-center text-center relative overflow-hidden shadow-[0_3px_12px_rgba(14,41,84,0.05)]">
          {/* Top Dual-Tone Executive Accent Strip */}
          <div className="w-full h-1.5 bg-gradient-to-r from-[#103260] via-[#1565D8] to-[#22A559]" />

          <div className="px-4 py-4 flex flex-col items-center justify-center flex-1 w-full">
            <span className="text-[9.5px] font-extrabold text-[#1565D8] tracking-[0.15em] uppercase mb-3">
              Official Status
            </span>

            {/* Dual-Ring Verification Medallion */}
            <div className="w-[82px] h-[82px] rounded-full bg-gradient-to-b from-[#E5F0FF] to-[#E3F8EC] border border-[#B6D4F7] flex items-center justify-center mb-3.5 shadow-xs">
              <div className="w-[64px] h-[64px] rounded-full bg-white border border-[#BCE5CA] flex items-center justify-center shadow-2xs">
                <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none" aria-hidden="true">
                  <rect
                    x="8"
                    y="6"
                    width="20"
                    height="27"
                    rx="3"
                    stroke="#1565D8"
                    strokeWidth="2.2"
                    fill="#F8FBFF"
                  />
                  <line x1="13" y1="13" x2="22" y2="13" stroke="#1565D8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="13" y1="18" x2="19" y2="18" stroke="#1565D8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="13" y1="23" x2="17" y2="23" stroke="#1565D8" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="27" cy="24" r="7" fill="#FFFFFF" />
                  <path
                    d="M22.5 24.2 L25.8 27.5 L33 19.5"
                    stroke="#188642"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <span className="text-[13.5px] font-extrabold text-[#0B2548] tracking-[0.06em] uppercase leading-tight">
              ID ACTIVATION
            </span>
            <span className="text-[20px] font-black text-[#188642] tracking-[0.03em] uppercase leading-tight mt-0.5">
              SUCCESSFUL
            </span>

            <div className="w-12 h-[3px] rounded-full bg-gradient-to-r from-[#1565D8] to-[#22A559] my-3" aria-hidden="true" />

            <p className="text-[11.5px] font-semibold text-[#334E68] leading-[1.45]">
              Your account is now
              <br />
              active and ready to use.
            </p>
          </div>

          {/* Highlighted Bottom Reference Strip inside Side Box */}
          <div className="w-full bg-[#EAF4FF]/80 border-t border-[#D0E3F7] py-2 px-3 flex items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold text-[#486581] uppercase tracking-wider">
              ID Ref:
            </span>
            <span className="text-[11px] font-extrabold font-mono text-[#0B2548] tabular-nums">
              #{referralCode || "5373259"}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. THREE RAISED, EXECUTIVE FINANCIAL SUMMARY CARDS
         ========================================================= */}
      <div className="px-9 pt-3.5 grid grid-cols-3 gap-3.5">
        {/* Card 1: Cashback Received (Emerald Green Accent) */}
        <div className="overflow-hidden rounded-xl border border-[#C6D6E8] border-t-2 border-t-[#16A34A] bg-gradient-to-b from-white to-[#F8FAFD] px-3.5 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(14,41,84,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#15803D] text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(22,163,74,0.22)]">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.3"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-15.4-6.4L3 8" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="3 3 3 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12a9 9 0 0 0 15.4 6.4L21 16" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 16 21 16 21 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[9.5px] font-extrabold text-[#476282] tracking-[0.06em] uppercase leading-none">
              CASHBACK RECEIVED
            </span>
            <div className="flex items-center justify-between gap-1.5 mt-1.5">
              <div className="flex items-baseline">
                <span className="text-[22px] font-black text-[#0B2548] tabular-nums tracking-tight leading-none">
                  {cashback}
                </span>
                <span className="text-[16px] font-extrabold text-[#0B2548] ml-0.5 leading-none">
                  ৳
                </span>
              </div>
              <span className="bg-[#E6F8ED] border border-[#9CE0BA] text-[#146C38] text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase shrink-0">
                BONUS
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Payment Method (Vibrant Royal Blue Accent) */}
        <div className="overflow-hidden rounded-xl border border-[#C6D6E8] border-t-2 border-t-[#2563EB] bg-gradient-to-b from-white to-[#F8FAFD] px-3.5 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(14,41,84,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(37,99,235,0.22)]">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.1"
              aria-hidden="true"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
              <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" />
              <line x1="6.5" y1="14.5" x2="10.5" y2="14.5" strokeLinecap="round" />
              <circle cx="17" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-[9.5px] font-extrabold text-[#476282] tracking-[0.06em] uppercase leading-none">
              PAYMENT METHOD
            </span>
            <div className="mt-1 flex items-center max-w-full">
              <InvoicePaymentMark method={paymentMethod} />
            </div>
            <span className="mt-1 text-[9px] font-bold text-[#1E40AF] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full leading-none whitespace-nowrap">
              Paid via {paymentDisplayName}
            </span>
          </div>
        </div>

        {/* Card 3: Amount Paid (Executive Onyx-Black Accent) */}
        <div className="overflow-hidden rounded-xl border border-[#C6D6E8] border-t-2 border-t-[#181B20] bg-gradient-to-b from-white to-[#F8FAFD] px-3.5 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(14,41,84,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D3139] to-[#111317] text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(17,19,23,0.24)]">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.5" y="6" width="19" height="12" rx="2.2" />
              <circle cx="12" cy="12" r="2.7" />
              <path d="M6 9.5h.01M18 14.5h.01" strokeWidth="2.6" />
            </svg>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[9.5px] font-extrabold text-[#476282] tracking-[0.06em] uppercase leading-none">
              AMOUNT PAID
            </span>
            <div className="flex items-center justify-between gap-1.5 mt-1.5">
              <div className="flex items-baseline">
                <span className="text-[22px] font-black text-[#0B2548] tabular-nums tracking-tight leading-none">
                  {amountPaid}
                </span>
                <span className="text-[16px] font-extrabold text-[#0B2548] ml-0.5 leading-none">
                  ৳
                </span>
              </div>
              <span className="bg-[#E6F8ED] border border-[#9CE0BA] text-[#146C38] text-[9.5px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                <svg
                  viewBox="0 0 16 16"
                  className="w-2.5 h-2.5 fill-none stroke-current"
                  strokeWidth="2.8"
                  aria-hidden="true"
                >
                  <polyline points="13.5 4 6 11.5 2.5 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          6. THANK YOU BANNER (PURE ACADEMIC CAP & BOOKS, NO LEAVES)
         ========================================================= */}
      <div className="px-9 pt-3.5">
        <div className="rounded-xl border border-[#CFE0F5] bg-gradient-to-r from-[#EEF5FE] via-[#F4F8FF] to-[#EAF2FD] px-5 py-3 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center min-w-0">
            <div className="w-11 h-11 rounded-full bg-white border border-[#C6DBF5] flex items-center justify-center text-[#1565D8] shrink-0 shadow-2xs">
              <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 fill-none stroke-current"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 13l5-5 5.5 2 3.5-2.5 6 2 6-2.5v9l-4.5 3.5-5.5 4.5a2.5 2.5 0 0 1-3.4-.2L8 17l-5-4z" />
                <path d="M13.5 10l-3.2 3.2a1.8 1.8 0 0 0 2.5 2.5l3.7-3.2" />
                <path d="M17.5 19.5l2.5 2" />
                <path d="M14.5 21.8l2 1.6" />
              </svg>
            </div>

            <div className="h-10 w-[1px] bg-[#C5D6EB] mx-4 shrink-0" aria-hidden="true" />

            <div className="flex flex-col min-w-0">
              <span className="text-[20px] font-extrabold italic text-[#0E2954] leading-tight">
                Thank You!
              </span>
              <p className="text-[12px] font-semibold text-[#1E3A5F] leading-snug mt-0.5">
                We appreciate your trust in {trimmedCompany}.
              </p>
              <p className="text-[12px] font-medium text-[#334E68] leading-snug">
                Keep learning, keep earning.
              </p>
            </div>
          </div>

          {/* Right Vector Illustration: Pure Academic Hardcover Books + Mortarboard Cap + Rolled Diploma (No Leaves) */}
          <div className="shrink-0 pl-3">
            <svg viewBox="0 0 132 72" className="w-[122px] h-[64px]" aria-hidden="true">
              <ellipse cx="66" cy="67" rx="54" ry="3" fill="#CBDDF2" opacity="0.7" />

              {/* Bottom Hardcover Book (Royal Blue) */}
              <path d="M20 56 H104 A5 5 0 0 1 109 61 A5 5 0 0 1 104 66 H20 Z" fill="#2563EB" />
              <rect x="24" y="58" width="78" height="6" rx="2.5" fill="#FFFFFF" />
              <line x1="28" y1="61" x2="99" y2="61" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="18" y="56" width="8" height="10" rx="2" fill="#1D4ED8" />

              {/* Top Hardcover Book (Deep Corporate Navy) */}
              <path d="M28 45 H98 A5 5 0 0 1 103 50 A5 5 0 0 1 98 55 H28 Z" fill="#163E73" />
              <rect x="32" y="47" width="64" height="6" rx="2.5" fill="#F8FAFC" />
              <line x1="36" y1="50" x2="93" y2="50" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="26" y="45" width="7" height="10" rx="2" fill="#0E2954" />

              {/* Formal Graduation Mortarboard Cap */}
              <polygon points="63,10 103,22 63,34 23,22" fill="#0E2954" />
              <polygon points="63,10 103,22 63,24 23,22" fill="#1B4980" />
              <path d="M43 27 V38 C43 43 83 43 83 38 V27 L63 34 L43 27 Z" fill="#163E73" />

              {/* Gold Academic Tassel */}
              <circle cx="63" cy="22" r="2.4" fill="#F59E0B" />
              <path d="M63 22 L93 26 V39" fill="none" stroke="#D97706" strokeWidth="1.8" />
              <polygon points="90.5,39 95.5,39 96.5,45 89.5,45" fill="#F59E0B" />
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================
          7. TWO FORMAL TRUST & SECURITY NOTICE BARS
         ========================================================= */}
      <div className="px-9 pt-3 flex flex-col gap-2">
        <div className="rounded-lg border border-[#C9DDF8] bg-[#F2F7FE] px-3.5 py-2 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#1565D8] text-white flex items-center justify-center shrink-0">
            <span className="text-[11px] font-serif italic font-bold leading-none">i</span>
          </div>
          <p className="text-[12px] font-medium text-[#1E3A5F] leading-snug">
            {trimmedCompany} is a trusted online e-learning platform.
          </p>
        </div>

        <div className="rounded-lg border border-[#BCE5CA] bg-[#EFFAF3] px-3.5 py-2 flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path
              d="M12 2 L21 5.5 V12 C21 17.5 17.2 21.5 12 23 C6.8 21.5 3 17.5 3 12 V5.5 L12 2 Z"
              fill="#1E8E3E"
            />
            <path
              d="M9 12.2 L11.1 14.3 L15.5 9.8"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[12px] font-medium text-[#14532D] leading-snug">
            Your security and satisfaction are our top priority.
          </p>
        </div>
      </div>

      {/* Horizontal Rule */}
      <div className="mx-9 mt-3.5 border-t border-[#DCE5F0]" />

      {/* =========================================================
          8. THREE-COLUMN FOOTER METADATA (TxID + Admin Signature | QR | Stay Connected)
         ========================================================= */}
      <div className="px-9 py-3.5 grid grid-cols-3 items-center">
        <div className="pr-4 border-r border-[#DCE5F0] h-full flex flex-col justify-between items-start">
          <div>
            <span className="text-[10.5px] font-semibold text-[#526D82] block leading-none">
              Transaction ID
            </span>
            <span className="text-[15px] font-extrabold text-[#0E2954] font-mono tabular-nums tracking-tight mt-1 block leading-none">
              #{cleanTxId}
            </span>
          </div>

          {/* Left-Aligned Authentic Executive Signature ('J' + cursive autograph) */}
          <div className="mt-2 flex flex-col items-start">
            <svg
              viewBox="0 0 164 54"
              className="w-[118px] h-[39px] -ml-2 -mb-0.5 select-none overflow-visible"
              fill="none"
              aria-label="Jihadul Islam Signature"
            >
              <defs>
                <linearGradient id="adminSigInk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0A2E6E" />
                  <stop offset="60%" stopColor="#124596" />
                  <stop offset="100%" stopColor="#0D367A" />
                </linearGradient>
              </defs>

              <g transform="rotate(-2.2 76 27)">
                {/* Clear Handwritten Capital 'J' flowing into fast executive cursive signature */}
                <path
                  d="M 11 16.5 C 16.5 10.5, 24.5 6.5, 30 7.5 C 31.5 8, 29.2 14.5, 26.2 23.5 C 23.2 32.5, 20.2 41, 17.5 46.5 C 15 51, 9.5 50.5, 9 45 C 8.5 39.5, 14.5 33.5, 26 28.5 C 29.5 27, 32 23, 33.5 21.5 C 34 25, 34.5 28, 36.2 27.8 C 38.8 22, 43 10.5, 45.2 9.8 C 46.5 9.8, 44 20.5, 42.8 28 C 45.2 23.5, 48.5 22.8, 49.8 27.5 C 52 24, 54.8 23.2, 56.5 27.2 C 59 22.8, 63.2 14.8, 65.2 13.2 C 64.2 20.5, 63.5 27.2, 66.8 27.2 C 70 27.2, 73 24.2, 76.2 26.5 C 79.5 28.2, 83.5 25.2, 87.5 22.5"
                  stroke="url(#adminSigInk)"
                  strokeWidth="2.05"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Subtle i-dot */}
                <circle cx="34.2" cy="15.2" r="1.15" fill="#0E3B82" />

                {/* Second rapid surname stroke + tapering signature tail */}
                <path
                  d="M 85.5 27.5 C 88.8 19, 93.2 10.8, 95.8 10.2 C 96.8 10.2, 93.8 21, 92.5 27.8 C 95.2 23.8, 98.5 22.8, 100.2 26.8 C 102.8 23.2, 106.2 16.8, 108.2 15.8 C 107.2 21.8, 107.5 26.8, 111 26.2 C 114.8 25.6, 118.5 24.2, 123.5 24.8 C 129.5 25.4, 139 23.2, 153 19.8"
                  stroke="url(#adminSigInk)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Confident fountain-pen paraph / underline swoosh */}
                <path
                  d="M 27 41.5 C 58 36.2, 104 32.8, 148 31.2 C 126 34.8, 97 38.2, 73 40.8"
                  stroke="#144A9C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.86"
                />
              </g>
            </svg>

            <div className="w-[106px] border-t border-[#475569]/70 pt-1">
              <span className="text-[11.5px] font-extrabold text-[#0E2954] tracking-[0.03em] leading-none block pl-7">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 border-r border-[#DCE5F0] h-full flex flex-col items-center justify-center text-center">
          <span className="text-[10.5px] font-semibold text-[#334E68] mb-1.5 leading-none">
            Scan to Visit
          </span>
          <div className="p-1.5 bg-white border-[1.5px] border-[#0E2954] rounded-md shadow-2xs">
            <QRCodeSVG value={shareLink} size={52} fgColor="#0E2954" bgColor="#FFFFFF" level="M" />
          </div>
          <span className="text-[10.5px] font-semibold text-[#1E3A5F] mt-1.5 leading-none">
            {cleanWebsite}
          </span>
        </div>

        <div className="pl-4 h-full flex flex-col items-end justify-center text-right">
          <span className="text-[11px] font-semibold text-[#334E68] mb-2 leading-none">
            Stay Connected
          </span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73z" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#229ED9] text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M18.3 5.7 4.2 11.1c-.9.4-.9.9-.2 1.1l3.6 1.1 8.3-5.2c.4-.2.8-.1.5.2l-6.8 6.1-.2 3.7c.4 0 .6-.2.8-.4l1.9-1.8 3.9 2.9c.7.4 1.2.2 1.4-.7l2.4-11.4c.3-1-.4-1.4-1.5-1z" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
              </svg>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#1E3A5F] mt-2 leading-none">
            {cleanWebsite}
          </span>
        </div>
      </div>

      {/* =========================================================
          9. BOTTOM UNIFORM CORPORATE NAVY FOOTER BAR (NO LEAVES)
         ========================================================= */}
      <div className="bg-[#0E2954] text-white px-9 py-3.5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2.5">
          {/* Formal Academic Shield Emblem (Zero Leaves) */}
          <div className="w-6 h-6 rounded-full bg-white/12 border border-white/25 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-[#38BDF8] fill-current"
              aria-hidden="true"
            >
              <path d="M12 3 2 8l10 5 8-4v5.5h2V8L12 3zm-5 8.8v3.2c0 1.9 2.2 3.5 5 3.5s5-1.6 5-3.5v-3.2l-5 2.5-5-2.5z" />
            </svg>
          </div>
          <span className="text-[11.5px] font-extrabold tracking-[0.07em] uppercase text-white">
            {trimmedCompany.toUpperCase()} E-LEARNING PLATFORM
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[11.5px] font-medium text-slate-200">
          <span>Learn</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" aria-hidden="true" />
          <span>Grow</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" aria-hidden="true" />
          <span>Earn</span>
        </div>
      </div>
    </div>
  );
};
