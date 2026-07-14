export interface InvoiceData {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  teamCode: string;
  cashback: string;
  amountPaid: string;
  paymentMethod: "Bkash" | "Nagad" | "Rocket" | "Upay" | "Bank" | "Upi" | "Google pay";
  companyName: string;
  companyWebsite: string;
  transactionId: string;
  date: string;
  logoUrl?: string; // base64 custom company logo
  avatarUrl?: string; // base64 custom profile photo
}
