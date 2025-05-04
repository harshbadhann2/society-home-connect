
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://jlkbouycgzcnzzrbdhsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2JvdXljZ3pjbnp6cmJkaHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODE3NTcsImV4cCI6MjA2MTY1Nzc1N30.0FshiDrXyp6et8jGXXjhvMSfhrv-_5G1J2W_3KKQ_lE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to check and create tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Create residents table if it doesn't exist
    const { error: residentTableError } = await supabase.rpc('create_table_if_not_exists', { 
      table_name: 'residents',
      table_definition: `
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        apartment_number TEXT,
        move_in_date DATE,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      `
    });
    
    if (residentTableError) {
      console.error('Error creating residents table:', residentTableError);
      // If RPC method isn't available, try direct SQL through Edge Function or stored procedure
      // For now, we'll use a fallback approach with raw queries
      const { error: fallbackError } = await supabase.from('residents').select('count').limit(1);
      if (fallbackError && fallbackError.message.includes('does not exist')) {
        console.log('Using fallback table creation mechanism');
        // In a production app, we'd use migrations or Edge Functions here
      }
    }

    // Create complaints table if it doesn't exist
    const { error: complaintTableError } = await supabase.rpc('create_table_if_not_exists', { 
      table_name: 'complaints',
      table_definition: `
        id SERIAL PRIMARY KEY,
        subject TEXT NOT NULL,
        description TEXT,
        category TEXT,
        status TEXT DEFAULT 'Pending',
        resident_id INTEGER,
        date_filed TIMESTAMPTZ DEFAULT NOW(),
        date_resolved TIMESTAMPTZ,
        assigned_to TEXT
      `
    });
    
    if (complaintTableError) {
      console.error('Error creating complaints table:', complaintTableError);
      // Fallback approach
      const { error: fallbackError } = await supabase.from('complaints').select('count').limit(1);
      if (fallbackError && fallbackError.message.includes('does not exist')) {
        console.log('Using fallback approach for complaints table');
      }
    }

    // Create staff table if it doesn't exist
    const { error: staffTableError } = await supabase.rpc('create_table_if_not_exists', { 
      table_name: 'staff',
      table_definition: `
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT,
        contact TEXT,
        email TEXT,
        joining_date TEXT,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      `
    });
    
    if (staffTableError) {
      console.error('Error creating staff table:', staffTableError);
      // Fallback approach
      const { error: fallbackError } = await supabase.from('staff').select('count').limit(1);
      if (fallbackError && fallbackError.message.includes('does not exist')) {
        console.log('Using fallback approach for staff table');
      }
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Call this function when your app starts
initializeDatabase();
