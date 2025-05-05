
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://jlkbouycgzcnzzrbdhsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2JvdXljZ3pjbnp6cmJkaHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODE3NTcsImV4cCI6MjA2MTY1Nzc1N30.0FshiDrXyp6et8jGXXjhvMSfhrv-_5G1J2W_3KKQ_lE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Import mock data
import { mockParking, mockResidents, mockStaff } from '@/types/database';

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
    
    // Check if 'residents' table exists
    const { data: existingResidents, error: residentsError } = await supabase
      .from('residents')
      .select('count')
      .limit(1);
      
    console.log('Residents check result:', existingResidents, residentsError);
    
    // Check if 'staff' table exists
    const { data: existingStaff, error: staffError } = await supabase
      .from('staff')
      .select('count')
      .limit(1);
      
    console.log('Staff check result:', existingStaff, staffError);
    
    // Check if 'users' table exists for authentication
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    console.log('Users check result:', existingUsers, usersError);
    
    // If there's an error with the parking table, use mock data
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
    
    // If there's an error with the residents table, use mock data
    if (residentsError) {
      console.log('Using mock data for residents since table appears to be missing or inaccessible');
    } else if (existingResidents && existingResidents.length === 0) {
      // Table exists but is empty - let's populate it
      console.log('Populating empty residents table with mock data');
      
      for (const resident of mockResidents) {
        const { error } = await supabase
          .from('residents')
          .insert({
            name: resident.name,
            email: resident.email,
            contact: resident.contact,
            apartment: resident.apartment,
            status: resident.status
          });
          
        if (error) console.error('Error inserting mock resident data:', error);
      }
    }
    
    // If there's an error with the staff table, use mock data
    if (staffError) {
      console.log('Using mock data for staff since table appears to be missing or inaccessible');
    } else if (existingStaff && existingStaff.length === 0) {
      // Table exists but is empty - let's populate it
      console.log('Populating empty staff table with mock data');
      
      for (const staff of mockStaff) {
        const { error } = await supabase
          .from('staff')
          .insert({
            name: staff.name,
            email: staff.email,
            contact: staff.contact,
            position: staff.position, // Using position instead of role
            status: staff.status
          });
          
        if (error) console.error('Error inserting mock staff data:', error);
      }
    }
    
    // If there's an error with the users table, use mock data
    if (usersError) {
      console.log('Using mock data for users since table appears to be missing or inaccessible');
    }
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Call initialization when the app starts
initializeDatabase();
