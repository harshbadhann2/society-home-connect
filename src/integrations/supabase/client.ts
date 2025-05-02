
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://jlkbouycgzcnzzrbdhsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2JvdXljZ3pjbnp6cmJkaHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODE3NTcsImV4cCI6MjA2MTY1Nzc1N30.0FshiDrXyp6et8jGXXjhvMSfhrv-_5G1J2W_3KKQ_lE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
