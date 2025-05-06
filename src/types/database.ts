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
}

export interface Resident {
  resident_id: number;
  name: string;
  apartment_id: number;
  status: string;
  contact_number: string;
  email: string;
  joining_date?: string;
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
}

export interface Notice {
  notice_id: number;
  title: string;
  message: string;
  posted_by: string;
  posted_date: string;
  priority?: string;
}

export interface Complaint {
  complaint_id: number;
  subject: string;
  complaint_text: string;
  resident_id: number;
  complaint_status: string;
  date_raised: string;
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
    maintenance_day: "Monday"
  },
  {
    amenity_id: 2,
    amenity_name: "Gym",
    availability_status: "Available",
    operating_hours: "5:00 AM - 10:00 PM",
    staff_id: 2,
    location: "First Floor, Club House",
    capacity: 25,
    maintenance_day: "Tuesday"
  },
  {
    amenity_id: 3,
    amenity_name: "Community Hall",
    availability_status: "Booked",
    operating_hours: "8:00 AM - 10:00 PM",
    staff_id: 3,
    location: "Ground Floor, Club House",
    capacity: 100,
    maintenance_day: "Wednesday"
  },
  {
    amenity_id: 4,
    amenity_name: "Tennis Court",
    availability_status: "Under Maintenance",
    operating_hours: "5:00 AM - 8:00 PM",
    staff_id: 4,
    location: "Near Block C",
    capacity: 4,
    maintenance_day: "Thursday"
  },
  {
    amenity_id: 5,
    amenity_name: "Children's Play Area",
    availability_status: "Available",
    operating_hours: "8:00 AM - 7:00 PM",
    staff_id: 5,
    location: "Central Garden",
    capacity: 20,
    maintenance_day: "Friday"
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
  },
  {
    resident_id: 2,
    name: 'Jane Smith',
    apartment_id: 202,
    status: 'Tenant',
    contact_number: '555-5678',
    email: 'jane.smith@example.com',
  },
  {
    resident_id: 3,
    name: 'Robert Johnson',
    apartment_id: 303,
    status: 'Owner',
    contact_number: '555-9012',
    email: 'robert.j@example.com',
  },
  {
    resident_id: 4,
    name: 'Emily Wong',
    apartment_id: 404,
    status: 'Tenant',
    contact_number: '555-3456',
    email: 'emily.w@example.com',
  },
  {
    resident_id: 5,
    name: 'Michael Brown',
    apartment_id: 105,
    status: 'Owner',
    contact_number: '555-7890',
    email: 'michael.b@example.com',
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
