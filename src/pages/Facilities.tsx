
import React from 'react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Calendar, Users, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock facilities data
const mockFacilities = [
  {
    id: 1,
    name: 'Swimming Pool',
    location: 'Ground Floor',
    capacity: 25,
    openingHours: '6:00 AM - 10:00 PM',
    status: 'Available',
    maintenanceDay: 'Monday',
  },
  {
    id: 2,
    name: 'Gym',
    location: 'Block B, 1st Floor',
    capacity: 15,
    openingHours: '5:00 AM - 11:00 PM',
    status: 'Available',
    maintenanceDay: 'Wednesday',
  },
  {
    id: 3,
    name: 'Community Hall',
    location: 'Block A, Ground Floor',
    capacity: 100,
    openingHours: '9:00 AM - 9:00 PM',
    status: 'Booked',
    maintenanceDay: 'Friday',
  },
  {
    id: 4,
    name: 'Tennis Court',
    location: 'Behind Block C',
    capacity: 4,
    openingHours: '6:00 AM - 8:00 PM',
    status: 'Available',
    maintenanceDay: 'Thursday',
  },
  {
    id: 5,
    name: 'Children\'s Playground',
    location: 'Central Garden',
    capacity: 20,
    openingHours: '7:00 AM - 7:00 PM',
    status: 'Under Maintenance',
    maintenanceDay: 'Tuesday',
  },
];

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    facility: 'Community Hall',
    bookedBy: 'John Doe',
    apartment: 'A-101',
    date: '2025-05-10',
    time: '6:00 PM - 9:00 PM',
    purpose: 'Birthday Party',
  },
  {
    id: 2,
    facility: 'Tennis Court',
    bookedBy: 'Robert Johnson',
    apartment: 'C-303',
    date: '2025-05-05',
    time: '7:00 AM - 9:00 AM',
    purpose: 'Practice Session',
  },
  {
    id: 3,
    facility: 'Community Hall',
    bookedBy: 'Society Committee',
    apartment: 'N/A',
    date: '2025-05-15',
    time: '5:00 PM - 8:00 PM',
    purpose: 'Annual General Meeting',
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'booked':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'under maintenance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Facilities: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Facilities</h2>
            <p className="text-muted-foreground">
              View and book society facilities
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Book Facility
          </Button>
        </div>

        {/* Facility statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Facilities</CardTitle>
              <CardDescription>Available for resident use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">5</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Bookings</CardTitle>
              <CardDescription>Active reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">3</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Usage</CardTitle>
              <CardDescription>Hours per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">4.5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities listing */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities Directory</CardTitle>
            <CardDescription>All available society amenities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="hidden md:table-cell">Opening Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Maintenance Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{facility.location}</TableCell>
                      <TableCell>{facility.capacity}</TableCell>
                      <TableCell className="hidden md:table-cell">{facility.openingHours}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(facility.status)}>
                          {facility.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{facility.maintenanceDay}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Current bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Current Bookings</CardTitle>
            <CardDescription>Upcoming facility reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{booking.facility}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString()} • {booking.time}
                    </div>
                    <div className="text-sm">Purpose: {booking.purpose}</div>
                  </div>
                  <div className="mt-2 md:mt-0 space-y-1 text-right">
                    <div className="text-sm font-medium">{booking.bookedBy}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.apartment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Facilities;
