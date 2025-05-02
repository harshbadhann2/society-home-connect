
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
