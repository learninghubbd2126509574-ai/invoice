import React from "react";
import { InvoiceData } from "../types";

interface LogoProps {
  className?: string;
}

const BkashOrigamiBird: React.FC<{ className?: string }> = ({ className = "w-6 h-5" }) => (
  <svg viewBox="0 0 62 54" className={`shrink-0 ${className}`} aria-hidden="true">
    {/* Main swept upper-left origami wing */}
    <polygon points="3,3 30,19 20,31" fill="#E2136E" />
    {/* Secondary upper wing fold */}
    <polygon points="27,4 38,21 30,19" fill="#F04E98" />
    {/* Deep crimson central body crease */}
    <polygon points="20,31 30,19 38,21" fill="#B80D57" />
    {/* Bright magenta lower body / chest facet */}
    <polygon points="20,31 38,21 33,38" fill="#E2136E" />
    {/* Head & neck origami fold */}
    <polygon points="38,21 48,21.5 35.6,29" fill="#C40F5C" />
    {/* Slender right-pointing hummingbird beak */}
    <polygon points="48,21.5 60,24.8 44.2,24.2" fill="#E2136E" />
    {/* Swept lower-left tail feather */}
    <polygon points="20,31 33,38 18,51" fill="#C20E5A" />
    {/* Lower tail flare facet */}
    <polygon points="33,38 40,46 28,43" fill="#F04E98" />
  </svg>
);

export const BkashLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1 select-none ${className}`}>
    <span className="text-[15px] font-bold tracking-[-0.02em] text-[#E2136E] leading-none">
      bKash
    </span>
    <BkashOrigamiBird className="w-[22px] h-[19px]" />
  </div>
);

export const NagadLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
    <svg viewBox="0 0 36 36" className="w-5 h-5 shrink-0" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="none" stroke="#F15A22" strokeWidth="3" />
      <path d="M18 7 C22.5 11.5 23.8 17.5 18 27 C12.2 17.5 13.5 11.5 18 7 Z" fill="#F15A22" />
      <path d="M18 11 C20.5 14 21 18 18 23 C15 18 15.5 14 18 11 Z" fill="#FBB03B" />
    </svg>
    <span className="text-[15px] font-black tracking-tight text-[#EA580C] leading-none">Nagad</span>
  </div>
);

export const RocketLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
    <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        d="M5 24 C9 27 18 26 24 19"
        fill="none"
        stroke="#A855F7"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M27 5 C20.5 5.6 15 8.8 11.5 13.2 L6.5 14.4 L10.4 18.2 L13.8 21.6 L17.6 25.5 L18.8 20.5 C23.2 17 26.4 11.5 27 5 Z"
        fill="#8C3494"
      />
      <circle cx="19.2" cy="12.8" r="2.1" fill="#FFFFFF" />
      <path d="M8.5 20.2 L4.5 26.5 L11 22.8 Z" fill="#F59E0B" />
    </svg>
    <span className="text-[14px] font-extrabold not-italic tracking-[0.02em] text-[#8C3494] leading-none">
      ROCKET
    </span>
  </div>
);

export const UpayLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1 select-none ${className}`}>
    <span className="text-[16px] font-black tracking-tight text-[#0054A6] leading-none">
      <span className="text-[#F59E0B]">u</span>pay
    </span>
  </div>
);

export const BankLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 text-[#1D4ED8] fill-none stroke-current shrink-0"
      strokeWidth="2.1"
      aria-hidden="true"
    >
      <path
        d="M3 10h18M5.5 10v8M9.8 10v8M14.2 10v8M18.5 10v8M2.5 18.5h19M12 4l9.5 6H2.5L12 4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-[14px] font-extrabold text-[#1E3A8A] tracking-tight leading-none">
      Bank
    </span>
  </div>
);

export const UpiLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1 select-none ${className}`}>
    <span className="text-[#334155] font-black italic tracking-tighter text-[14px] leading-none">UPI</span>
    <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <polygon points="2,2 8,7 2,12 5,12 11,7 5,2" fill="#F37021" />
      <polygon points="6,2 12,7 6,12 8.5,12 14,7 8.5,2" fill="#097939" />
    </svg>
  </div>
);

export const GooglePayLogo: React.FC<LogoProps> = ({ className = "h-6" }) => (
  <div className={`inline-flex items-center gap-1 select-none ${className}`}>
    <span className="font-extrabold text-[14px] leading-none">
      <span className="text-[#4285F4]">G</span> <span className="text-[#3C4043]">Pay</span>
    </span>
  </div>
);

export const PaymentMethodLogo: React.FC<{
  method: InvoiceData["paymentMethod"];
  className?: string;
}> = ({ method, className }) => {
  switch (method) {
    case "Bkash":
      return <BkashLogo className={className} />;
    case "Nagad":
      return <NagadLogo className={className} />;
    case "Rocket":
      return <RocketLogo className={className} />;
    case "Upay":
      return <UpayLogo className={className} />;
    case "Bank":
      return <BankLogo className={className} />;
    case "Upi":
      return <UpiLogo className={className} />;
    case "Google pay":
      return <GooglePayLogo className={className} />;
    default:
      return <BkashLogo className={className} />;
  }
};

export const getPaymentMethodDisplayName = (method: InvoiceData["paymentMethod"]): string => {
  switch (method) {
    case "Bkash":
      return "bKash";
    case "Nagad":
      return "Nagad";
    case "Rocket":
      return "Rocket";
    case "Upay":
      return "Upay";
    case "Bank":
      return "Bank";
    case "Upi":
      return "UPI";
    case "Google pay":
      return "Google Pay";
    default:
      return "bKash";
  }
};

/**
 * Clean, Unboxed Official-Style Vector Brand Marks for the Formal Invoice Payment Method Card
 */
export const InvoicePaymentMark: React.FC<{
  method: InvoiceData["paymentMethod"];
}> = ({ method }) => {
  switch (method) {
    case "Bkash":
      return (
        <div className="inline-flex items-center gap-1 select-none h-[26px]">
          <span className="text-[19px] font-bold tracking-[-0.025em] leading-none text-[#E2136E]">
            bKash
          </span>
          <BkashOrigamiBird className="w-[27px] h-[23px]" />
        </div>
      );

    case "Rocket":
      return (
        <div className="inline-flex items-center gap-1.5 select-none h-[26px]">
          {/* Unboxed Official-Style DBBL Rocket Emblem + Upright Wordmark */}
          <svg viewBox="0 0 34 32" className="w-[22px] h-[22px] shrink-0" aria-hidden="true">
            <path
              d="M4 25 C10 29 20 27.5 27 19.5"
              fill="none"
              stroke="#B84AC2"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <path
              d="M29 3.5 C21.8 4.2 15.8 7.8 11.8 12.6 L6.2 14 L10.5 18.2 L14.2 21.8 L18.4 26 L19.8 20.4 C24.6 16.4 28.2 10.4 29 3.5 Z"
              fill="#8C3494"
            />
            <circle cx="20.2" cy="12" r="2.2" fill="#FFFFFF" />
            <path d="M8.5 20.5 L4 27.5 L11.2 23.2 Z" fill="#F59E0B" />
          </svg>
          <span className="text-[17px] font-extrabold not-italic tracking-[0.015em] leading-none text-[#8C3494]">
            ROCKET
          </span>
        </div>
      );

    case "Nagad":
      return (
        <div className="inline-flex items-center gap-1.5 select-none h-[26px]">
          {/* Unboxed Official-Style Nagad Circular Flame Emblem */}
          <svg viewBox="0 0 36 36" className="w-[24px] h-[24px] shrink-0" aria-hidden="true">
            <defs>
              <linearGradient id="nagadMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBB03B" />
                <stop offset="55%" stopColor="#F15A22" />
                <stop offset="100%" stopColor="#ED1C24" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#nagadMarkGrad)" strokeWidth="2.8" />
            <path
              d="M18 6.5 C22.8 11 24 17.5 18 27.5 C12 17.5 13.2 11 18 6.5 Z"
              fill="url(#nagadMarkGrad)"
            />
            <circle cx="18" cy="13.2" r="2.1" fill="#FFFFFF" />
          </svg>
          <span className="text-[19.5px] font-black tracking-[-0.02em] leading-none text-[#E64A19]">
            Nagad
          </span>
        </div>
      );

    case "Upay":
      return (
        <div className="inline-flex items-center gap-1.5 select-none h-[26px]">
          {/* Unboxed Official-Style Upay Emblem + Wordmark */}
          <svg viewBox="0 0 30 30" className="w-[22px] h-[22px] shrink-0" aria-hidden="true">
            <circle cx="15" cy="15" r="14" fill="#FFD400" />
            <path
              d="M9.5 9.5 V16 C9.5 19.3 11.8 21.4 15 21.4 C18.2 21.4 20.5 19.3 20.5 16 V9.5 H17.3 V15.8 C17.3 17.4 16.4 18.4 15 18.4 C13.6 18.4 12.7 17.4 12.7 15.8 V9.5 H9.5 Z"
              fill="#0054A6"
            />
            <circle cx="15" cy="7.2" r="1.9" fill="#E11D48" />
          </svg>
          <span className="text-[20px] font-black tracking-[-0.03em] leading-none text-[#0054A6]">
            upay
          </span>
        </div>
      );

    case "Bank":
      return (
        <div className="inline-flex items-center gap-1.5 select-none h-[26px]">
          <svg
            viewBox="0 0 24 24"
            className="w-[20px] h-[20px] text-[#1D4ED8] fill-none stroke-current shrink-0"
            strokeWidth="2.1"
            aria-hidden="true"
          >
            <path
              d="M3 9.5h18M5.5 9.5v7.5M9.8 9.5v7.5M14.2 9.5v7.5M18.5 9.5v7.5M2.5 19.5h19M12 3.5l9.5 6H2.5l9.5-6z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[18px] font-extrabold tracking-[-0.015em] text-[#1E3A8A] leading-none whitespace-nowrap">
            Bank
          </span>
        </div>
      );

    case "Upi":
      return (
        <div className="inline-flex items-center gap-1 select-none h-[26px]">
          <span className="text-[20px] font-black italic tracking-[-0.04em] leading-none text-[#334155]">
            UPI
          </span>
          <svg viewBox="0 0 18 18" className="w-4 h-4 shrink-0" aria-hidden="true">
            <polygon points="2,2 10,9 2,16 5.5,16 13.5,9 5.5,2" fill="#F37021" />
            <polygon points="7.5,2 15.5,9 7.5,16 10.5,16 18,9 10.5,2" fill="#097939" />
          </svg>
        </div>
      );

    case "Google pay":
      return (
        <div className="inline-flex items-center gap-1.5 select-none h-[26px]">
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.57-5.17 3.57-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          <span className="text-[18px] font-bold tracking-tight leading-none text-[#3C4043]">
            Pay
          </span>
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center gap-1 select-none h-[26px]">
          <span className="text-[19px] font-bold tracking-[-0.025em] leading-none text-[#E2136E]">
            bKash
          </span>
          <BkashOrigamiBird className="w-[27px] h-[23px]" />
        </div>
      );
  }
};
