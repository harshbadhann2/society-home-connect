// Mock data for development/fallback
export interface Amenity {
  amenity_id: number;
  amenity_name: string;
  availability_status: string;
  booking_fees?: number;
  booking_required?: boolean;
  operating_hours: string;
  staff_id?: number;
  location?: string;
  capacity?: number;
  maintenance_day?: string;
  // For compatibility with existing code
  id?: number;
  name?: string;
  status?: string;
  opening_hours?: string;
}

export interface Resident {
  resident_id: number;
  name: string;
  apartment_id: number;
  status: string;
  contact_number: string;
  email: string;
  joining_date?: string;
  // For compatibility with existing code
  contact?: string;
  apartment?: string | number;
  id?: number; // Adding id for compatibility
}

export interface Staff {
  staff_id: number;
  name: string;
  position?: string;
  role?: string; // Added for compatibility with database schema
  contact_number: string;
  email?: string;
  joining_date: string;
  status?: string;
  salary?: number; // Added to match database
  // For compatibility with existing code
  contact?: string;
  id?: number;
}

export interface Parking {
  parking_id: number;
  slot_number: string;
  vehicle_type: string;
  vehicle_number: string;
  resident_id: number;
  parking_status: string;
  apartment_id?: number;
  start_time?: string;
  end_time?: string;
  parking_type?: string;
  // For compatibility with existing code
  id?: number;
  spot_number?: string; // Alias for slot_number
  status?: string; // Alias for parking_status
}

export interface Housekeeping {
  housekeeping_id: number;
  service_type: string;
  staff_id: number;
  resident_id: number;
  cleaning_date: string;
  cleaning_status: string;
  area?: string;
  task_description?: string;
  frequency?: string;
  last_completed?: string;
  next_scheduled?: string;
  // For compatibility with existing code
  assigned_staff?: number;
  status?: string;
  id?: number;
}

export interface Notice {
  notice_id: number;
  title: string;
  message: string;
  posted_by: string;
  posted_date: string;
  priority?: string;
  // For compatibility with existing code
  id?: number;
  date?: string; // Alias for posted_date
  category?: string; // Not in database but used in component
  content?: string; // Alias for message
}

export interface Complaint {
  complaint_id: number;
  subject: string;
  complaint_text: string;
  resident_id: number;
  complaint_status: string;
  date_raised: string;
  // For compatibility with existing code
  id?: number;
  description?: string;
  category?: string;
  status?: string;
  date_filed?: string;
  date_resolved?: string;
  assigned_to?: string;
}

export interface Payment {
  transaction_id: number;
  resident_id: number;
  amount: number;
  transaction_date: string;
  payment_method: string;
  banking_status: string;
  purpose: string;
  // For compatibility with existing code
  id?: number;
  description?: string;
  status?: string;
  date?: string;
  apartment?: string;
  currency?: string;
}

export interface Booking {
  booking_id: number;
  amenity_id: number;
  resident_id: number;
  booking_date: string;
  time_slot: string;
  purpose: string;
  status: string;
  // For compatibility with existing code
  id?: number;
  date?: string;
  time?: string;
}

export interface User {
  user_id: number;
  username: string;
  email?: string;
  password_hash: string;
  phone?: string;
  role: string;
  created_at?: string;
  // For compatibility with existing code
  password?: string; // For login components
}

// Define a simplified apartment interface to match the database schema
export interface Apartment {
  apartment_id: number;
  apartment_number: string;
  apartment_status?: string;
  block?: string;
  floor_number?: number;
  owner_name?: string;
  owner_contact?: string;
  wing_id?: number;
  // For compatibility
  id?: number;
  unit?: string; // Alias for apartment_number
  type?: string; // Used in UI but not in database
  size?: string; // Used in UI but not in database
  bedrooms?: number; 
  bathrooms?: number;
  wing?: string;
  owner?: string; // Alias for owner_name
  status?: string; // Alias for apartment_status
}

export interface Wing {
  wing_id: number;
  wing_name: string;
  total_floors?: number;
  total_apartments?: number;
  // For compatibility
  id?: number;
  name?: string; // Alias for wing_name
  floors?: number; // Alias for total_floors
  apartments?: number; // Alias for total_apartments
  maintenance_day?: string;
  status?: string;
}

export interface Delivery {
  delivery_id: number;
  courier_company_name: string;
  delivery_date: string;
  resident_id: number;
  received_by?: string;
  delivery_status: string;
  delivery_address?: string;
  // For compatibility
  id?: number; 
  package_info?: string; // Alias for courier_company_name
  received_date?: string; // Alias for delivery_date
  status?: string; // Alias for delivery_status
  courier_name?: string; // Alias for courier_company_name
  delivered_date?: string;
}

// Mock data - Keep existing mock data declarations
export const mockAmenities: Amenity[] = [
  {
    amenity_id: 1,
    amenity_name: "Swimming Pool",
    availability_status: "Available",
    operating_hours: "6:00 AM - 9:00 PM",
    staff_id: 1,
    location: "Ground Floor, Block A",
    capacity: 30,
    maintenance_day: "Monday",
    // Compatibility fields
    id: 1,
    name: "Swimming Pool",
    status: "Available",
    opening_hours: "6:00 AM - 9:00 PM"
  },
  {
    amenity_id: 2,
    amenity_name: "Gym",
    availability_status: "Available",
    operating_hours: "5:00 AM - 10:00 PM",
    staff_id: 2,
    location: "First Floor, Club House",
    capacity: 25,
    maintenance_day: "Tuesday",
    // Compatibility fields
    id: 2,
    name: "Gym",
    status: "Available",
    opening_hours: "5:00 AM - 10:00 PM"
  },
  {
    amenity_id: 3,
    amenity_name: "Community Hall",
    availability_status: "Booked",
    operating_hours: "8:00 AM - 10:00 PM",
    staff_id: 3,
    location: "Ground Floor, Club House",
    capacity: 100,
    maintenance_day: "Wednesday",
    // Compatibility fields
    id: 3,
    name: "Community Hall",
    status: "Booked",
    opening_hours: "8:00 AM - 10:00 PM"
  },
  {
    amenity_id: 4,
    amenity_name: "Tennis Court",
    availability_status: "Under Maintenance",
    operating_hours: "5:00 AM - 8:00 PM",
    staff_id: 4,
    location: "Near Block C",
    capacity: 4,
    maintenance_day: "Thursday",
    // Compatibility fields
    id: 4,
    name: "Tennis Court",
    status: "Under Maintenance",
    opening_hours: "5:00 AM - 8:00 PM"
  },
  {
    amenity_id: 5,
    amenity_name: "Children's Play Area",
    availability_status: "Available",
    operating_hours: "8:00 AM - 7:00 PM",
    staff_id: 5,
    location: "Central Garden",
    capacity: 20,
    maintenance_day: "Friday",
    // Compatibility fields
    id: 5,
    name: "Children's Play Area",
    status: "Available",
    opening_hours: "8:00 AM - 7:00 PM"
  }
];

export const mockResidents: Resident[] = [
  {
    resident_id: 1,
    name: 'John Doe',
    apartment_id: 101,
    status: 'Owner',
    contact_number: '555-1234',
    email: 'john.doe@example.com',
    // Compatibility fields
    contact: '555-1234',
    apartment: 101
  },
  {
    resident_id: 2,
    name: 'Jane Smith',
    apartment_id: 202,
    status: 'Tenant',
    contact_number: '555-5678',
    email: 'jane.smith@example.com',
    // Compatibility fields
    contact: '555-5678',
    apartment: 202
  },
  {
    resident_id: 3,
    name: 'Robert Johnson',
    apartment_id: 303,
    status: 'Owner',
    contact_number: '555-9012',
    email: 'robert.j@example.com',
    // Compatibility fields
    contact: '555-9012',
    apartment: 303
  },
  {
    resident_id: 4,
    name: 'Emily Wong',
    apartment_id: 404,
    status: 'Tenant',
    contact_number: '555-3456',
    email: 'emily.w@example.com',
    // Compatibility fields
    contact: '555-3456',
    apartment: 404
  },
  {
    resident_id: 5,
    name: 'Michael Brown',
    apartment_id: 105,
    status: 'Owner',
    contact_number: '555-7890',
    email: 'michael.b@example.com',
    // Compatibility fields
    contact: '555-7890',
    apartment: 105
  }
];

export const mockStaff: Staff[] = [
  {
    staff_id: 1,
    name: 'Rajesh Kumar',
    position: 'Security',
    contact_number: '555-2468',
    email: 'rajesh.k@example.com',
    joining_date: '2024-01-15',
    status: 'Active',
    // Compatibility fields
    id: 1,
    contact: '555-2468'
  },
  {
    staff_id: 2,
    name: 'Priya Sharma',
    position: 'Cleaner',
    contact_number: '555-1357',
    email: 'priya.s@example.com',
    joining_date: '2024-02-10',
    status: 'Active',
    // Compatibility fields
    id: 2,
    contact: '555-1357'
  },
  {
    staff_id: 3,
    name: 'Suresh Patel',
    position: 'Gardener',
    contact_number: '555-8642',
    email: 'suresh.p@example.com',
    joining_date: '2024-03-05',
    status: 'On Leave',
    // Compatibility fields
    id: 3,
    contact: '555-8642'
  },
  {
    staff_id: 4,
    name: 'Anita Desai',
    position: 'Maintenance',
    contact_number: '555-9753',
    email: 'anita.d@example.com',
    joining_date: '2023-11-20',
    status: 'Active',
    // Compatibility fields
    id: 4,
    contact: '555-9753'
  }
];

export const mockParking: Parking[] = [
  {
    parking_id: 1,
    slot_number: "A-101",
    vehicle_type: "Car",
    vehicle_number: "MH-01-AB-1234",
    resident_id: 1,
    parking_status: "Occupied"
  },
  {
    parking_id: 2,
    slot_number: "A-102",
    vehicle_type: "Bike",
    vehicle_number: "MH-01-CD-5678",
    resident_id: 2,
    parking_status: "Occupied"
  },
  {
    parking_id: 3,
    slot_number: "B-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    parking_status: "Available"
  },
  {
    parking_id: 4,
    slot_number: "B-102",
    vehicle_type: "SUV",
    vehicle_number: "MH-01-EF-9012",
    resident_id: 3,
    parking_status: "Occupied"
  },
  {
    parking_id: 5,
    slot_number: "C-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    parking_status: "Available"
  },
  {
    parking_id: 6,
    slot_number: "C-102",
    vehicle_type: "Bike",
    vehicle_number: "MH-01-GH-3456",
    resident_id: 4,
    parking_status: "Occupied"
  },
  {
    parking_id: 7,
    slot_number: "V-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    parking_status: "Reserved for Visitors"
  }
];

export const mockUsers: User[] = [
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password_hash: 'hashed_password_here',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    user_id: 2,
    username: 'manager',
    email: 'manager@example.com',
    password_hash: 'hashed_password_here',
    role: 'manager',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    user_id: 3,
    username: 'staff',
    email: 'staff@example.com',
    password_hash: 'hashed_password_here',
    role: 'staff',
    created_at: '2024-01-03T00:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    booking_id: 1,
    amenity_id: 1,
    resident_id: 1,
    booking_date: '2025-05-10',
    time_slot: '6:00 PM - 9:00 PM',
    purpose: 'Birthday Party',
    status: 'Confirmed',
    // Compatibility fields
    id: 1,
    date: '2025-05-10',
    time: '6:00 PM - 9:00 PM'
  },
  {
    booking_id: 2,
    amenity_id: 4,
    resident_id: 3,
    booking_date: '2025-05-05',
    time_slot: '7:00 AM - 9:00 AM',
    purpose: 'Practice Session',
    status: 'Confirmed',
    // Compatibility fields
    id: 2,
    date: '2025-05-05',
    time: '7:00 AM - 9:00 AM'
  },
  {
    booking_id: 3,
    amenity_id: 3,
    resident_id: 5,
    booking_date: '2025-05-15',
    time_slot: '5:00 PM - 8:00 PM',
    purpose: 'Annual General Meeting',
    status: 'Confirmed',
    // Compatibility fields
    id: 3,
    date: '2025-05-15',
    time: '5:00 PM - 8:00 PM'
  }
];

export const mockComplaints = [
  {
    complaint_id: 1,
    resident_id: 1,
    subject: 'Water Leakage in Bathroom',
    complaint_text: 'There is water leaking from the ceiling of my bathroom.',
    complaint_status: 'In Progress',
    date_raised: '2025-04-28',
    // Compatibility fields
    id: 1,
    description: 'There is water leaking from the ceiling of my bathroom.',
    category: 'Plumbing',
    status: 'In Progress',
    date_filed: '2025-04-28',
    assigned_to: 'Maintenance Team'
  },
  {
    complaint_id: 2,
    resident_id: 3,
    subject: 'Noise Complaint',
    complaint_text: 'Excessive noise from apartment B-203 late at night.',
    complaint_status: 'Pending',
    date_raised: '2025-05-01',
    // Compatibility fields
    id: 2,
    description: 'Excessive noise from apartment B-203 late at night.',
    category: 'Noise',
    status: 'Pending',
    date_filed: '2025-05-01'
  },
  {
    complaint_id: 3,
    resident_id: 2,
    subject: 'Common Area Light Not Working',
    complaint_text: 'The light in the stairwell of Block C has been out for two days.',
    complaint_status: 'Resolved',
    date_raised: '2025-04-25',
    // Compatibility fields
    id: 3,
    description: 'The light in the stairwell of Block C has been out for two days.',
    category: 'Electrical',
    status: 'Resolved',
    date_filed: '2025-04-25',
    date_resolved: '2025-04-27',
    assigned_to: 'Electrician'
  },
  {
    complaint_id: 4,
    resident_id: 1,
    subject: 'Garbage Not Collected',
    complaint_text: 'The garbage from Block A has not been collected for two days.',
    complaint_status: 'Pending',
    date_raised: '2025-05-02',
    // Compatibility fields
    id: 4,
    description: 'The garbage from Block A has not been collected for two days.',
    category: 'Cleanliness',
    status: 'Pending',
    date_filed: '2025-05-02'
  }
];

// Add the missing mockHousekeeping data
export const mockHousekeeping: Housekeeping[] = [
  {
    housekeeping_id: 1,
    service_type: "Regular Cleaning",
    staff_id: 2, 
    resident_id: 1,
    cleaning_date: "2025-05-05",
    cleaning_status: "Completed",
    area: "Apartment",
    task_description: "Weekly apartment cleaning",
    frequency: "Weekly",
    last_completed: "2025-04-28",
    next_scheduled: "2025-05-12",
    assigned_staff: 2,
    id: 1
  },
  {
    housekeeping_id: 2,
    service_type: "Deep Cleaning",
    staff_id: 2,
    resident_id: 3,
    cleaning_date: "2025-05-10",
    cleaning_status: "Scheduled",
    area: "Common Area",
    task_description: "Monthly deep cleaning of lobby and corridors",
    frequency: "Monthly",
    last_completed: "2025-04-10",
    next_scheduled: "2025-05-10",
    assigned_staff: 2,
    id: 2
  },
  {
    housekeeping_id: 3,
    service_type: "Window Cleaning",
    staff_id: 4,
    resident_id: 0, // No specific resident (common area)
    cleaning_date: "2025-05-07",
    cleaning_status: "In Progress", 
    area: "Building Exterior",
    task_description: "External window cleaning for all apartments",
    frequency: "Quarterly",
    last_completed: "2025-02-07",
    next_scheduled: "2025-08-07",
    assigned_staff: 4,
    id: 3
  },
  {
    housekeeping_id: 4,
    service_type: "Carpet Cleaning",
    staff_id: 2,
    resident_id: 2,
    cleaning_date: "2025-05-15",
    cleaning_status: "Scheduled",
    area: "Apartment",
    task_description: "Deep carpet cleaning for apartment 202",
    frequency: "Quarterly",
    last_completed: "2025-02-15",
    next_scheduled: "2025-08-15",
    assigned_staff: 2,
    id: 4
  },
  {
    housekeeping_id: 5,
    service_type: "Regular Cleaning",
    staff_id: 3,
    resident_id: 4,
    cleaning_date: "2025-05-06",
    cleaning_status: "Overdue",
    area: "Apartment",
    task_description: "Weekly apartment cleaning",
    frequency: "Weekly",
    last_completed: "2025-04-22",
    next_scheduled: "2025-04-29",
    assigned_staff: 3,
    id: 5
  }
];

// Mock apartments data
export const mockApartments: Apartment[] = [
  {
    apartment_id: 1,
    apartment_number: 'A-101',
    type: '2 BHK',
    size: '1200 sqft',
    bedrooms: 2,
    bathrooms: 2,
    wing: 'A',
    owner_name: 'John Doe',
    apartment_status: 'Occupied',
    // For compatibility
    id: 1,
    unit: 'A-101',
    owner: 'John Doe',
    status: 'Occupied'
  },
  {
    apartment_id: 2,
    apartment_number: 'B-202',
    type: '1 BHK',
    size: '950 sqft',
    bedrooms: 1,
    bathrooms: 1,
    wing: 'B',
    owner_name: 'Jane Smith',
    apartment_status: 'Occupied',
    // For compatibility
    id: 2,
    unit: 'B-202',
    owner: 'Jane Smith',
    status: 'Occupied'
  },
  {
    apartment_id: 3,
    apartment_number: 'C-303',
    type: '3 BHK',
    size: '1800 sqft',
    bedrooms: 3,
    bathrooms: 2,
    wing: 'C',
    owner_name: 'Robert Johnson',
    apartment_status: 'Occupied',
    // For compatibility
    id: 3,
    unit: 'C-303',
    owner: 'Robert Johnson',
    status: 'Occupied'
  },
  {
    apartment_id: 4,
    apartment_number: 'D-404',
    type: '2 BHK',
    size: '1100 sqft',
    bedrooms: 2,
    bathrooms: 1,
    wing: 'D',
    owner_name: 'Michael Brown',
    apartment_status: 'Vacant',
    // For compatibility
    id: 4,
    unit: 'D-404',
    owner: 'Michael Brown',
    status: 'Vacant'
  },
  {
    apartment_id: 5,
    apartment_number: 'A-105',
    type: '2 BHK',
    size: '1300 sqft',
    bedrooms: 2,
    bathrooms: 2,
    wing: 'A',
    owner_name: 'Emily Wong',
    apartment_status: 'Occupied',
    // For compatibility
    id: 5,
    unit: 'A-105',
    owner: 'Emily Wong',
    status: 'Occupied'
  },
];

// Add mock delivery data
export const mockDeliveries: Delivery[] = [
  {
    delivery_id: 1,
    package_info: 'Amazon Package',
    resident_id: 1,
    received_date: '2025-05-01T10:30:00',
    status: 'Delivered',
    courier_name: 'Amazon Logistics',
    delivered_date: '2025-05-01T15:45:00',
    courier_company_name: 'Amazon Logistics',
    delivery_date: '2025-05-01T10:30:00',
    delivery_status: 'Delivered'
  },
  {
    delivery_id: 2,
    package_info: 'Food Delivery',
    resident_id: 3,
    received_date: '2025-05-02T12:15:00',
    status: 'Received',
    courier_name: 'Swiggy',
    courier_company_name: 'Swiggy',
    delivery_date: '2025-05-02T12:15:00',
    delivery_status: 'Received'
  },
  {
    delivery_id: 3,
    package_info: 'Electronics Package',
    resident_id: 2,
    received_date: '2025-05-03T09:45:00',
    status: 'Received',
    courier_name: 'Flipkart',
    courier_company_name: 'Flipkart',
    delivery_date: '2025-05-03T09:45:00',
    delivery_status: 'Received'
  }
];

// Add mock wings data
export const mockWings: Wing[] = [
  {
    wing_id: 1,
    wing_name: 'Wing A',
    total_floors: 10,
    total_apartments: 40,
    maintenance_day: 'Monday',
    status: 'Active',
    id: 1,
    name: 'Wing A',
    floors: 10,
    apartments: 40
  },
  {
    wing_id: 2,
    wing_name: 'Wing B',
    total_floors: 10,
    total_apartments: 40,
    maintenance_day: 'Tuesday',
    status: 'Active',
    id: 2,
    name: 'Wing B',
    floors: 10,
    apartments: 40
  },
  {
    wing_id: 3,
    wing_name: 'Wing C',
    total_floors: 8,
    total_apartments: 32,
    maintenance_day: 'Wednesday',
    status: 'Under Maintenance',
    id: 3,
    name: 'Wing C',
    floors: 8,
    apartments: 32
  },
  {
    wing_id: 4,
    wing_name: 'Wing D',
    total_floors: 12,
    total_apartments: 48,
    maintenance_day: 'Thursday',
    status: 'Active',
    id: 4,
    name: 'Wing D',
    floors: 12,
    apartments: 48
  }
];
