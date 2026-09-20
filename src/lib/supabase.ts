import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yxtnoaaqefgkflrkzcfy.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dG5vYWFxZWZna2Zscmt6Y2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTczNjYsImV4cCI6MjEwNTQ5MzM2Nn0.Cy2CKI2izgiWFHxhBB4_5eBJWmowokBiat5lnbsfV2M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
