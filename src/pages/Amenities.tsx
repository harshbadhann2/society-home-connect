
import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Amenity, mockAmenities } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { BookAmenityDialog } from '@/components/dialogs/BookAmenityDialog';

const getStatusColor = (status: string | null | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
  
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

interface Booking {
  id: number;
  amenity_id: number;
  resident_id: number;
  date: string;
  time_slot: string;
  purpose: string;
}

const Amenities: React.FC = () => {
  const { toast } = useToast();
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState<number | null>(null);

  const { data: amenities, isLoading, error, refetch } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      try {
        // Updated from "amenities" to "amenity" to match the correct table name
        const { data, error } = await supabase.from('amenity').select('*');
        
        if (error) {
          console.info('Supabase error:', error);
          console.info('Using mock amenities data');
          return mockAmenities;
        }
        
        // Map the returned data to match our expected format
        return data.map((item: any) => ({
          id: item.amenity_id,
          name: item.amenity_name,
          location: 'Main Building', // Default location if not provided
          capacity: 20, // Default capacity if not provided
          opening_hours: item.operating_hours || '9 AM - 9 PM',
          status: item.availability_status || 'Available'
        })) as Amenity[];
      } catch (err) {
        console.error('Error fetching amenities:', err);
        return mockAmenities;
      }
    }
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        // Using delivery_records as a temporary placeholder since there's no bookings table
        const { data, error } = await supabase.from('delivery_records').select('*');
        
        if (error) {
          console.info('Supabase error:', error);
          return mockBookings;
        }
        
        // For now, return mock bookings since we don't have a proper bookings table
        return mockBookings;
      } catch (err) {
        console.error('Error fetching bookings:', err);
        return mockBookings;
      }
    }
  });

  const { data: residents } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('resident_id, name, apartment_id');
        
        if (error) {
          console.error('Supabase error fetching residents:', error);
          return [];
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching residents:', err);
        return [];
      }
    }
  });

  const getResidentInfo = (residentId: number) => {
    if (residents && residents.length > 0) {
      const resident = residents.find((r: any) => r.resident_id === residentId);
      return resident ? { name: resident.name, apartment: resident.apartment_id } : { name: 'Unknown', apartment: 'N/A' };
    }
    return { name: 'Unknown', apartment: 'N/A' };
  };

  const getAmenityName = (amenityId: number) => {
    if (amenities && amenities.length > 0) {
      const amenity = amenities.find(a => a.id === amenityId);
      return amenity ? amenity.name : 'Unknown';
    }
    return 'Unknown';
  };

  const formatBookings = bookings?.map(booking => {
    const residentInfo = getResidentInfo(booking.resident_id);
    return {
      id: booking.id,
      facility: getAmenityName(booking.amenity_id),
      bookedBy: residentInfo.name,
      apartment: residentInfo.apartment,
      date: booking.date,
      time: booking.time_slot,
      purpose: booking.purpose,
    };
  }) || [];

  const handleBookAmenity = (amenityId?: number) => {
    setSelectedAmenityId(amenityId || null);
    setBookDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Amenities</h2>
            <p className="text-muted-foreground">
              View and book society amenities
            </p>
          </div>
          <Button onClick={() => handleBookAmenity()}>
            <Plus className="mr-2 h-4 w-4" /> Book Amenity
          </Button>
        </div>

        {/* Facility statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Amenities</CardTitle>
              <CardDescription>Available for resident use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{amenities?.length || 0}</span>
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
                <span className="text-2xl font-bold">{formatBookings.length}</span>
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

        {/* Amenities listing */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities Directory</CardTitle>
            <CardDescription>All available society amenities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading amenities data...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading amenities data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead className="hidden md:table-cell">Opening Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amenities?.map((amenity) => (
                      <TableRow key={amenity.id}>
                        <TableCell className="font-medium">{amenity.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{amenity.location}</TableCell>
                        <TableCell>{amenity.capacity}</TableCell>
                        <TableCell className="hidden md:table-cell">{amenity.opening_hours}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(amenity.status)}>
                            {amenity.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {amenity.status && amenity.status.toLowerCase() === 'available' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleBookAmenity(amenity.id)}
                            >
                              Book Now
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={!amenity.status || amenity.status.toLowerCase() !== 'booked'}
                            >
                              {amenity.status && amenity.status.toLowerCase() === 'booked' ? 'View Details' : 'Unavailable'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
              {formatBookings.map((booking) => (
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

      <BookAmenityDialog
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        onAdd={refetch}
        amenityId={selectedAmenityId || undefined}
      />
    </Layout>
  );
};

export default Amenities;
