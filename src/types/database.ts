
// Custom database types that extend the auto-generated Supabase types
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

// Extend the existing Database type with your tables
export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
      residents: {
        Row: {
          id: number;
          name: string;
          apartment: string;
          status: string;
          contact: string;
          email: string;
          created_at?: string;
        };
        Insert: {
          name: string;
          apartment: string;
          status: string;
          contact: string;
          email: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          apartment?: string;
          status?: string;
          contact?: string;
          email?: string;
          created_at?: string;
        };
      };
      // Add other tables as needed
    };
    Views: GeneratedDatabase['public']['Views'];
    Functions: GeneratedDatabase['public']['Functions'];
    Enums: GeneratedDatabase['public']['Enums'];
    CompositeTypes: GeneratedDatabase['public']['CompositeTypes'];
  };
}

// Helper type to access the residents table row type
export type Resident = Database['public']['Tables']['residents']['Row'];

// Mock data for residents to use when the database table doesn't exist yet
export const mockResidents: Resident[] = [
  {
    id: 1,
    name: 'John Doe',
    apartment: 'A-101',
    status: 'Owner',
    contact: '555-1234',
    email: 'john.doe@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    apartment: 'B-202',
    status: 'Tenant',
    contact: '555-5678',
    email: 'jane.smith@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Robert Johnson',
    apartment: 'C-303',
    status: 'Owner',
    contact: '555-9012',
    email: 'robert.j@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Emily Wong',
    apartment: 'D-404',
    status: 'Tenant',
    contact: '555-3456',
    email: 'emily.w@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Michael Brown',
    apartment: 'A-105',
    status: 'Owner',
    contact: '555-7890',
    email: 'michael.b@example.com',
    created_at: new Date().toISOString(),
  }
];
