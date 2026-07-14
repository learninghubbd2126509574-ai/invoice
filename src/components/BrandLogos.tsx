import React from "react";

interface LogoProps {
  className?: string;
}

export const BkashLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-[#E2125D] px-4 py-1.5 rounded-xl shadow-sm border border-[#F43F5E]/20 ${className}`}>
    <span className="text-white font-sans font-black tracking-tight text-sm md:text-base select-none">bKash</span>
  </div>
);

export const NagadLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-[#F15A22] px-4 py-1.5 rounded-xl shadow-sm border border-[#F97316]/20 ${className}`}>
    <span className="text-white font-sans font-black italic tracking-tighter text-sm md:text-base select-none">nagad</span>
  </div>
);

export const RocketLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-[#82298C] px-4 py-1.5 rounded-xl shadow-sm border border-[#A21CAF]/20 ${className}`}>
    <span className="text-white font-sans font-black tracking-widest text-xs md:text-sm select-none">ROCKET</span>
  </div>
);

export const UpayLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-[#00529B] px-4 py-1.5 rounded-xl shadow-sm border border-blue-500/20 ${className}`}>
    <span className="text-[#FFC72C] font-sans font-black tracking-tight text-sm md:text-base select-none">u</span>
    <span className="text-white font-sans font-bold tracking-tight text-sm md:text-base select-none">pay</span>
  </div>
);

export const BankLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-[#111827] px-4 py-1.5 rounded-xl shadow-sm border border-slate-700/50 ${className}`}>
    <span className="text-white font-sans font-black text-xs tracking-wider select-none">BANK TRSF</span>
  </div>
);

export const UpiLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-white border border-slate-200 px-4 py-1.5 rounded-xl shadow-sm ${className}`}>
    <span className="text-[#097939] font-sans font-black tracking-tighter text-sm select-none">U</span>
    <span className="text-[#00529B] font-sans font-black italic tracking-tight text-sm select-none">P</span>
    <span className="text-[#F26522] font-sans font-black tracking-tighter text-sm select-none">I</span>
  </div>
);

export const GooglePayLogo: React.FC<LogoProps> = ({ className = "h-8" }) => (
  <div className={`inline-flex items-center justify-center bg-slate-900 px-4 py-1.5 rounded-xl shadow-sm border border-slate-800 ${className}`}>
    <span className="text-white font-sans font-black text-xs md:text-sm select-none">G Pay</span>
  </div>
);

export const PaymentMethodLogo: React.FC<{
  method: "Bkash" | "Nagad" | "Rocket" | "Upay" | "Bank" | "Upi" | "Google pay";
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
