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

// Define interfaces for users
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Resident {
  id: number;
  name: string;
  email: string;
  contact: string;
  apartment: string;
  status: string;
  resident_id?: number;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  contact: string;
  role: string;
  status: string;
}

// Define interface for parking
export interface Parking {
  id: number;
  spot_number: string;
  vehicle_type: string;
  vehicle_number: string;
  resident_id: number;
  status: string;
}

// Define interface for housekeeping
export interface Housekeeping {
  id: number;
  resident_id: number;
  service_type: string;
  cleaning_date: string;
  cleaning_status: string;
  staff_id: number;
  area?: string;
  task_description?: string;
  frequency?: string;
  status?: string;
  last_completed?: string;
  next_scheduled?: string;
  assigned_staff: number;
}

// Mock users for development/fallback
export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin1",
    email: "admin@nirvaanheights.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    username: "staff1",
    email: "sunil.kumar@example.com",
    password: "staff123",
    role: "staff"
  },
  {
    id: 3,
    username: "resident1",
    email: "rajesh.sharma@example.com",
    password: "resident123",
    role: "resident"
  },
  {
    id: 4,
    username: "pooja",
    email: "pooja.yadav@example.com",
    password: "staff123",
    role: "staff"
  },
  {
    id: 5,
    username: "amit",
    email: "amit.singh@example.com",
    password: "resident123",
    role: "resident"
  }
];

// Mock residents data
export const mockResidents: Resident[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    contact: "+91 98765 43210",
    apartment: "A101",
    status: "Active",
    resident_id: 101
  },
  {
    id: 2,
    name: "Amit Singh",
    email: "amit.singh@example.com",
    contact: "+91 87654 32109",
    apartment: "B202",
    status: "Active",
    resident_id: 102
  },
  {
    id: 3,
    name: "Ravi Mehta",
    email: "ravi.mehta@example.com",
    contact: "+91 76543 21098",
    apartment: "C303",
    status: "Active",
    resident_id: 103
  },
  {
    id: 4,
    name: "Neha Verma",
    email: "neha.verma@example.com",
    contact: "+91 65432 10987",
    apartment: "D404",
    status: "Active",
    resident_id: 104
  }
];

// Mock staff data
export const mockStaff: Staff[] = [
  {
    id: 1,
    name: "Sunil Kumar",
    email: "sunil.kumar@example.com",
    contact: "+91 54321 09876",
    role: "Cleaner",
    status: "Active"
  },
  {
    id: 2,
    name: "Pooja Yadav",
    email: "pooja.yadav@example.com",
    contact: "+91 43210 98765",
    role: "Security",
    status: "Active"
  },
  {
    id: 3,
    name: "Rajeev Kumar",
    email: "rajeev.kumar@example.com",
    contact: "+91 32109 87654",
    role: "Gardener",
    status: "Active"
  }
];

// Mock parking data
export const mockParking: Parking[] = [
  {
    id: 1,
    spot_number: "A-01",
    vehicle_type: "Car",
    vehicle_number: "MH01AB1234",
    resident_id: 1,
    status: "Occupied"
  },
  {
    id: 2,
    spot_number: "A-02",
    vehicle_type: "Bike",
    vehicle_number: "MH01CD5678",
    resident_id: 2,
    status: "Occupied"
  },
  {
    id: 3,
    spot_number: "A-03",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Available"
  },
  {
    id: 4,
    spot_number: "B-01",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Available"
  },
  {
    id: 5,
    spot_number: "V-01",
    vehicle_type: "",
    vehicle_number: "",
    resident_id: 0,
    status: "Reserved for Visitors"
  }
];

// Mock housekeeping data
export const mockHousekeeping: Housekeeping[] = [
  {
    id: 1,
    resident_id: 1,
    service_type: "Regular Cleaning",
    cleaning_date: "2025-05-01",
    cleaning_status: "Completed",
    staff_id: 1,
    area: "Block A Common Areas",
    task_description: "Regular floor cleaning and dusting",
    frequency: "Daily",
    status: "Completed",
    last_completed: "2025-05-01",
    next_scheduled: "2025-05-02",
    assigned_staff: 1
  },
  {
    id: 2,
    resident_id: 2,
    service_type: "Deep Cleaning",
    cleaning_date: "2025-05-03",
    cleaning_status: "Scheduled",
    staff_id: 1,
    area: "Swimming Pool",
    task_description: "Pool cleaning and chemical treatment",
    frequency: "Weekly",
    status: "Scheduled",
    last_completed: "2025-04-25",
    next_scheduled: "2025-05-03",
    assigned_staff: 1
  },
  {
    id: 3,
    resident_id: 0,
    service_type: "Gardening",
    cleaning_date: "2025-05-02",
    cleaning_status: "In Progress",
    staff_id: 3,
    area: "Central Garden",
    task_description: "Lawn mowing and plant maintenance",
    frequency: "Weekly",
    status: "In Progress",
    last_completed: "2025-04-25",
    next_scheduled: "2025-05-02",
    assigned_staff: 3
  },
  {
    id: 4,
    resident_id: 3,
    service_type: "Apartment Cleaning",
    cleaning_date: "2025-05-04",
    cleaning_status: "Scheduled",
    staff_id: 1,
    area: "C303",
    task_description: "Regular apartment cleaning",
    frequency: "Weekly",
    status: "Scheduled",
    last_completed: "2025-04-27",
    next_scheduled: "2025-05-04",
    assigned_staff: 1
  },
  {
    id: 5,
    resident_id: 0,
    service_type: "Equipment Maintenance",
    cleaning_date: "2025-05-01",
    cleaning_status: "Overdue",
    staff_id: 2,
    area: "Gym",
    task_description: "Equipment inspection and maintenance",
    frequency: "Monthly",
    status: "Overdue",
    last_completed: "2025-04-01",
    next_scheduled: "2025-05-01",
    assigned_staff: 2
  }
];

// Additional mock data types can be added here
