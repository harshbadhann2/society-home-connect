
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

// Additional mock data types can be added here
