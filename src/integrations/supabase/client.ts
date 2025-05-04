
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://jlkbouycgzcnzzrbdhsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2JvdXljZ3pjbnp6cmJkaHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODE3NTcsImV4cCI6MjA2MTY1Nzc1N30.0FshiDrXyp6et8jGXXjhvMSfhrv-_5G1J2W_3KKQ_lE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Import mock data
import { mockParking } from '@/types/database';

// Initialize database tables - simpler approach without using stored procedures
export const initializeDatabase = async () => {
  console.log('Initializing database tables...');
  
  try {
    // Check if 'parking' table exists by trying to query it
    const { data: existingParking, error: parkingError } = await supabase
      .from('parking')
      .select('count')
      .limit(1);
      
    console.log('Parking check result:', existingParking, parkingError);
    
    // If there's an error, the table likely doesn't exist or has wrong schema
    // Let's use mock data as a fallback instead of trying to create tables
    if (parkingError) {
      console.log('Using mock data for parking since table appears to be missing or inaccessible');
    } else if (existingParking && existingParking.length === 0) {
      // Table exists but is empty - let's populate it
      console.log('Populating empty parking table with mock data');
      
      for (const spot of mockParking) {
        const { error } = await supabase
          .from('parking')
          .insert({
            spot_number: spot.spot_number,
            vehicle_type: spot.vehicle_type || '',
            vehicle_number: spot.vehicle_number || '',
            resident_id: spot.resident_id || 0,
            status: spot.status || 'Available'
          });
          
        if (error) console.error('Error inserting mock parking data:', error);
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Call initialization when the app starts
initializeDatabase();
