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
      amenities: {
        Row: {
          id: number;
          name: string;
          location: string;
          capacity: number;
          opening_hours: string;
          status: string;
          maintenance_day: string;
          created_at?: string;
        };
        Insert: {
          name: string;
          location: string;
          capacity: number;
          opening_hours: string;
          status: string;
          maintenance_day: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          location?: string;
          capacity?: number;
          opening_hours?: string;
          status?: string;
          maintenance_day?: string;
          created_at?: string;
        };
      };
      parking: {
        Row: {
          id: number;
          spot_number: string;
          vehicle_type: string;
          vehicle_number: string;
          resident_id: number;
          status: string;
          created_at?: string;
        };
        Insert: {
          spot_number: string;
          vehicle_type: string;
          vehicle_number: string;
          resident_id: number;
          status: string;
          created_at?: string;
        };
        Update: {
          spot_number?: string;
          vehicle_type?: string;
          vehicle_number?: string;
          resident_id?: number;
          status?: string;
          created_at?: string;
        };
      };
      delivery_records: {
        Row: {
          id: number;
          package_id: string;
          resident_id: number;
          delivery_date: string;
          delivery_time: string;
          courier_name: string;
          status: string;
          created_at?: string;
        };
        Insert: {
          package_id: string;
          resident_id: number;
          delivery_date: string;
          delivery_time: string;
          courier_name: string;
          status: string;
          created_at?: string;
        };
        Update: {
          package_id?: string;
          resident_id?: number;
          delivery_date?: string;
          delivery_time?: string;
          courier_name?: string;
          status?: string;
          created_at?: string;
        };
      };
      staff: {
        Row: {
          id: number;
          name: string;
          position: string;
          contact: string;
          email: string;
          joining_date: string;
          status: string;
          created_at?: string;
        };
        Insert: {
          name: string;
          position: string;
          contact: string;
          email: string;
          joining_date: string;
          status: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          position?: string;
          contact?: string;
          email?: string;
          joining_date?: string;
          status?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: number;
          email: string;
          password: string;
          role: string;
          created_at?: string;
        };
        Insert: {
          email: string;
          password: string;
          role: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          password?: string;
          role?: string;
          created_at?: string;
        };
      };
      housekeeping: {
        Row: {
          id: number;
          area: string;
          task_description: string;
          assigned_staff: number;
          frequency: string;
          status: string;
          last_completed: string;
          next_scheduled: string;
          created_at?: string;
        };
        Insert: {
          area: string;
          task_description: string;
          assigned_staff: number;
          frequency: string;
          status: string;
          last_completed: string;
          next_scheduled: string;
          created_at?: string;
        };
        Update: {
          area?: string;
          task_description?: string;
          assigned_staff?: number;
          frequency?: string;
          status?: string;
          last_completed?: string;
          next_scheduled?: string;
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
export type Amenity = Database['public']['Tables']['amenities']['Row'];
export type Parking = Database['public']['Tables']['parking']['Row'];
export type DeliveryRecord = Database['public']['Tables']['delivery_records']['Row'];
export type Staff = Database['public']['Tables']['staff']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Housekeeping = Database['public']['Tables']['housekeeping']['Row'];

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

// Mock data for amenities
export const mockAmenities: Amenity[] = [
  {
    id: 1,
    name: 'Swimming Pool',
    location: 'Ground Floor',
    capacity: 25,
    opening_hours: '6:00 AM - 10:00 PM',
    status: 'Available',
    maintenance_day: 'Monday',
  },
  {
    id: 2,
    name: 'Gym',
    location: 'Block B, 1st Floor',
    capacity: 15,
    opening_hours: '5:00 AM - 11:00 PM',
    status: 'Available',
    maintenance_day: 'Wednesday',
  },
  {
    id: 3,
    name: 'Community Hall',
    location: 'Block A, Ground Floor',
    capacity: 100,
    opening_hours: '9:00 AM - 9:00 PM',
    status: 'Booked',
    maintenance_day: 'Friday',
  },
  {
    id: 4,
    name: 'Tennis Court',
    location: 'Behind Block C',
    capacity: 4,
    opening_hours: '6:00 AM - 8:00 PM',
    status: 'Available',
    maintenance_day: 'Thursday',
  },
  {
    id: 5,
    name: 'Children\'s Playground',
    location: 'Central Garden',
    capacity: 20,
    opening_hours: '7:00 AM - 7:00 PM',
    status: 'Under Maintenance',
    maintenance_day: 'Tuesday',
  },
];

// Mock data for parking
export const mockParking: Parking[] = [
  {
    id: 1,
    spot_number: 'A-101',
    vehicle_type: 'Car',
    vehicle_number: 'MH-01-AB-1234',
    resident_id: 1,
    status: 'Occupied',
  },
  {
    id: 2,
    spot_number: 'B-205',
    vehicle_type: 'Motorcycle',
    vehicle_number: 'MH-01-CD-5678',
    resident_id: 2,
    status: 'Occupied',
  },
  {
    id: 3,
    spot_number: 'V-103',
    vehicle_type: 'Car',
    vehicle_number: 'MH-01-EF-9012',
    resident_id: 3,
    status: 'Occupied',
  },
  {
    id: 4,
    spot_number: 'A-104',
    vehicle_type: 'Car',
    vehicle_number: '',
    resident_id: 0,
    status: 'Available',
  },
  {
    id: 5,
    spot_number: 'V-105',
    vehicle_type: 'Car',
    vehicle_number: '',
    resident_id: 0,
    status: 'Reserved for Visitors',
  },
];

// Mock data for delivery records
export const mockDeliveryRecords: DeliveryRecord[] = [
  {
    id: 1,
    package_id: 'PKG-001',
    resident_id: 1,
    delivery_date: '2025-05-01',
    delivery_time: '10:30 AM',
    courier_name: 'Express Delivery',
    status: 'Delivered',
  },
  {
    id: 2,
    package_id: 'PKG-002',
    resident_id: 2,
    delivery_date: '2025-05-01',
    delivery_time: '02:45 PM',
    courier_name: 'Fast Courier',
    status: 'Delivered',
  },
  {
    id: 3,
    package_id: 'PKG-003',
    resident_id: 3,
    delivery_date: '2025-05-02',
    delivery_time: '09:15 AM',
    courier_name: 'Express Delivery',
    status: 'In Transit',
  },
  {
    id: 4,
    package_id: 'PKG-004',
    resident_id: 1,
    delivery_date: '2025-05-03',
    delivery_time: '11:00 AM',
    courier_name: 'City Couriers',
    status: 'Scheduled',
  },
];

// Mock data for staff
export const mockStaff: Staff[] = [
  {
    id: 1,
    name: 'Robert Williams',
    position: 'Security Supervisor',
    contact: '555-1111',
    email: 'robert.w@example.com',
    joining_date: '2022-03-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    position: 'Maintenance Manager',
    contact: '555-2222',
    email: 'sarah.j@example.com',
    joining_date: '2021-06-10',
    status: 'Active',
  },
  {
    id: 3,
    name: 'David Miller',
    position: 'Gardener',
    contact: '555-3333',
    email: 'david.m@example.com',
    joining_date: '2023-01-05',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Lisa Chen',
    position: 'Housekeeping Supervisor',
    contact: '555-4444',
    email: 'lisa.c@example.com',
    joining_date: '2022-09-20',
    status: 'Active',
  },
];

// Mock data for users
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff',
  },
  {
    id: 3,
    email: 'resident@example.com',
    password: 'resident123',
    role: 'resident',
  },
];

// Mock data for housekeeping
export const mockHousekeeping: Housekeeping[] = [
  {
    id: 1,
    area: 'Main Lobby',
    task_description: 'Floor cleaning and polishing',
    assigned_staff: 3,
    frequency: 'Daily',
    status: 'Completed',
    last_completed: '2025-05-01',
    next_scheduled: '2025-05-02',
  },
  {
    id: 2,
    area: 'Swimming Pool',
    task_description: 'Water treatment and cleaning',
    assigned_staff: 2,
    frequency: 'Weekly',
    status: 'Scheduled',
    last_completed: '2025-04-25',
    next_scheduled: '2025-05-02',
  },
  {
    id: 3,
    area: 'Garden',
    task_description: 'Lawn mowing and plant trimming',
    assigned_staff: 3,
    frequency: 'Weekly',
    status: 'In Progress',
    last_completed: '2025-04-25',
    next_scheduled: '2025-05-02',
  },
  {
    id: 4,
    area: 'Gym',
    task_description: 'Equipment cleaning and sanitization',
    assigned_staff: 4,
    frequency: 'Daily',
    status: 'Completed',
    last_completed: '2025-05-01',
    next_scheduled: '2025-05-02',
  },
  {
    id: 5,
    area: 'Parking Lot',
    task_description: 'Sweeping and garbage collection',
    assigned_staff: 2,
    frequency: 'Bi-weekly',
    status: 'Overdue',
    last_completed: '2025-04-15',
    next_scheduled: '2025-04-29',
  },
];
