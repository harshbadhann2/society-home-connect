
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://jlkbouycgzcnzzrbdhsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2JvdXljZ3pjbnp6cmJkaHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODE3NTcsImV4cCI6MjA2MTY1Nzc1N30.0FshiDrXyp6et8jGXXjhvMSfhrv-_5G1J2W_3KKQ_lE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to create a table using SQL if it doesn't exist
const createTableIfNotExists = async (tableName: string, tableDefinition: string) => {
  try {
    const { error } = await supabase
      .rpc('create_table_if_not_exists', { 
        table_name: tableName,
        table_definition: tableDefinition
      });
    
    if (error) {
      console.error(`Error creating ${tableName} table:`, error);
      
      // Direct SQL approach using queries (fallback)
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            ${tableDefinition}
          )
        `
      });
      
      if (sqlError) {
        console.error(`SQL error creating ${tableName} table:`, sqlError);
        
        // Check if table exists as fallback
        const { error: checkError } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
          
        if (checkError) {
          console.info(`Table ${tableName} doesn't exist, trying raw query creation`);
          
          // Last resort: try to create the table with raw queries
          await supabase.rpc('exec_sql', {
            query: `
              CREATE TABLE IF NOT EXISTS ${tableName} (
                ${tableDefinition}
              )
            `
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error in createTableIfNotExists for ${tableName}:`, error);
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create residents table if it doesn't exist
    await createTableIfNotExists('residents', `
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      apartment_number TEXT,
      move_in_date DATE,
      status TEXT DEFAULT 'Active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    `);
    
    // Create complaints table if it doesn't exist
    await createTableIfNotExists('complaints', `
      id SERIAL PRIMARY KEY,
      subject TEXT NOT NULL,
      description TEXT,
      category TEXT,
      status TEXT DEFAULT 'Pending',
      resident_id INTEGER,
      date_filed TIMESTAMPTZ DEFAULT NOW(),
      date_resolved TIMESTAMPTZ,
      assigned_to TEXT
    `);

    // Create staff table if it doesn't exist
    await createTableIfNotExists('staff', `
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT,
      contact TEXT,
      email TEXT,
      joining_date TEXT,
      status TEXT DEFAULT 'Active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    `);

    // Create parking table if it doesn't exist
    await createTableIfNotExists('parking', `
      id SERIAL PRIMARY KEY,
      spot_number TEXT NOT NULL,
      vehicle_type TEXT,
      vehicle_number TEXT,
      resident_id INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Available',
      created_at TIMESTAMPTZ DEFAULT NOW()
    `);

    // Create amenities table if it doesn't exist
    await createTableIfNotExists('amenities', `
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      capacity INTEGER,
      opening_hours TEXT,
      status TEXT DEFAULT 'Available',
      maintenance_day TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    `);

    // Populate tables with mock data if they're empty
    await populateEmptyTables();

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Helper to populate tables with mock data if they're empty
const populateEmptyTables = async () => {
  try {
    // Check if parking table is empty and populate with mock data if needed
    const { data: parkingData, error: parkingError } = await supabase
      .from('parking')
      .select('count')
      .single();
      
    if (!parkingError && parkingData && parkingData.count === 0) {
      console.log('Populating parking table with mock data');
      
      // Import mock data
      const { mockParking } = await import('@/types/database');
      
      // Insert mock data
      for (const spot of mockParking) {
        const { error } = await supabase
          .from('parking')
          .insert({
            spot_number: spot.spot_number,
            vehicle_type: spot.vehicle_type,
            vehicle_number: spot.vehicle_number,
            resident_id: spot.resident_id,
            status: spot.status
          });
          
        if (error) console.error('Error inserting mock parking data:', error);
      }
    }
    
    // Similar checks can be added for other tables as needed
    
  } catch (error) {
    console.error('Error populating empty tables:', error);
  }
};

// Call this function when your app starts
initializeDatabase();
