
// Mock data for development/fallback
export interface Amenity {
  id: number;
  name: string;
  location: string;
  capacity: number;
  opening_hours: string;
  status: string;
  maintenance_day: string;
}

export interface Resident {
  id: number;
  name: string;
  apartment: string;
  status: string;
  contact: string;
  email: string;
}

export interface Staff {
  id: number;
  name: string;
  position: string;
  contact: string;
  email: string;
  joining_date: string;
  status: string;
}

export interface Parking {
  id: number;
  spot_number: string;
  vehicle_type: string;
  vehicle_number: string;
  resident_id: number;
  status: string;
}

export interface Housekeeping {
  id: number;
  area: string;
  task_description: string;
  assigned_staff: number;
  frequency: string;
  status: string;
  last_completed: string;
  next_scheduled: string;
}

export const mockAmenities: Amenity[] = [
  {
    id: 1,
    name: "Swimming Pool",
    location: "Ground Floor, Block A",
    capacity: 30,
    opening_hours: "6:00 AM - 9:00 PM",
    status: "Available",
    maintenance_day: "Monday"
  },
  {
    id: 2,
    name: "Gym",
    location: "First Floor, Club House",
    capacity: 25,
    opening_hours: "5:00 AM - 10:00 PM",
    status: "Available",
    maintenance_day: "Tuesday"
  },
  {
    id: 3,
    name: "Community Hall",
    location: "Ground Floor, Club House",
    capacity: 100,
    opening_hours: "8:00 AM - 10:00 PM",
    status: "Booked",
    maintenance_day: "Wednesday"
  },
  {
    id: 4,
    name: "Tennis Court",
    location: "Near Block C",
    capacity: 4,
    opening_hours: "5:00 AM - 8:00 PM",
    status: "Under Maintenance",
    maintenance_day: "Thursday"
  },
  {
    id: 5,
    name: "Children's Play Area",
    location: "Central Garden",
    capacity: 20,
    opening_hours: "8:00 AM - 7:00 PM",
    status: "Available",
    maintenance_day: "Friday"
  }
];

export const mockResidents: Resident[] = [
  {
    id: 1,
    name: 'John Doe',
    apartment: 'A-101',
    status: 'Owner',
    contact: '555-1234',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    apartment: 'B-202',
    status: 'Tenant',
    contact: '555-5678',
    email: 'jane.smith@example.com',
  },
  {
    id: 3,
    name: 'Robert Johnson',
    apartment: 'C-303',
    status: 'Owner',
    contact: '555-9012',
    email: 'robert.j@example.com',
  },
  {
    id: 4,
    name: 'Emily Wong',
    apartment: 'D-404',
    status: 'Tenant',
    contact: '555-3456',
    email: 'emily.w@example.com',
  },
  {
    id: 5,
    name: 'Michael Brown',
    apartment: 'A-105',
    status: 'Owner',
    contact: '555-7890',
    email: 'michael.b@example.com',
  }
];

export const mockParking: Parking[] = [
  {
    id: 1,
    spot_number: "A-101",
    vehicle_type: "Car",
    vehicle_number: "MH-01-AB-1234",
    resident_id: 1,
    status: "Occupied"
  },
  {
    id: 2,
    spot_number: "A-102",
    vehicle_type: "Bike",
    vehicle_number: "MH-01-CD-5678",
    resident_id: 2,
    status: "Occupied"
  },
  {
    id: 3,
    spot_number: "B-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Available"
  },
  {
    id: 4,
    spot_number: "B-102",
    vehicle_type: "SUV",
    vehicle_number: "MH-01-EF-9012",
    resident_id: 3,
    status: "Occupied"
  },
  {
    id: 5,
    spot_number: "C-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Available"
  },
  {
    id: 6,
    spot_number: "C-102",
    vehicle_type: "Bike",
    vehicle_number: "MH-01-GH-3456",
    resident_id: 4,
    status: "Occupied"
  },
  {
    id: 7,
    spot_number: "V-101",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Reserved for Visitors"
  }
];

// Additional mock data types can be added here
