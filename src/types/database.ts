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
}

export interface Staff {
  staff_id: number;
  name: string;
  position: string;
  contact_number: string;
  email?: string;
  joining_date: string;
  status?: string;
  role?: string;
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
