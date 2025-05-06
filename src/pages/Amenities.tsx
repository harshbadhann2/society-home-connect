
import React, { useState, useContext } from 'react';
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
import AuthContext from '@/context/AuthContext';

const getStatusColor = (status: string) => {
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

// Mock bookings data for fallback
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
  const { currentUser } = useContext(AuthContext);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState<number | null>(null);

  const { data: amenities, isLoading: isLoadingAmenities, error: amenitiesError, refetch: refetchAmenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('amenity').select('*');
        
        if (error) {
          console.error('Supabase error fetching amenities:', error);
          console.info('Using mock amenities data');
          return mockAmenities;
        }
        
        // Transform the data to match the expected format
        return data.map(item => ({
          id: item.amenity_id,
          name: item.amenity_name || 'Unknown',
          location: item.location || 'Main Building',
          capacity: item.capacity || 10,
          opening_hours: item.operating_hours || '9:00 AM - 9:00 PM',
          status: item.availability_status || 'Available',
          maintenance_day: 'Sunday'
        })) as Amenity[];
      } catch (err) {
        console.error('Error fetching amenities:', err);
        return mockAmenities;
      }
    }
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        
        if (error) {
          console.info('Supabase error for bookings:', error);
          return mockBookings;
        }
        
        return data as Booking[];
      } catch (err) {
        console.error('Error fetching bookings:', err);
        return mockBookings;
      }
    }
  });

  const { data: residents, isLoading: isLoadingResidents } = useQuery({
    queryKey: ['residents_list'],
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
      return resident ? { name: resident.name || 'Unknown', apartment: resident.apartment_id || 'N/A' } : { name: 'Unknown', apartment: 'N/A' };
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

  const formatBookings = () => {
    if (!bookings || bookings.length === 0) return mockBookings;

    return bookings.map(booking => {
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
    });
  };

  const formattedBookings = formatBookings();

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
                <span className="text-2xl font-bold">{formattedBookings?.length || 0}</span>
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
            {isLoadingAmenities ? (
              <div className="py-8 text-center">Loading amenities data...</div>
            ) : amenitiesError ? (
              <div className="py-8 text-center text-red-500">Error loading amenities data</div>
            ) : !amenities || amenities.length === 0 ? (
              <div className="py-8 text-center">No amenities found</div>
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
                    {amenities.map((amenity) => (
                      <TableRow key={amenity.id}>
                        <TableCell className="font-medium">{amenity.name || 'Unknown'}</TableCell>
                        <TableCell className="hidden md:table-cell">{amenity.location || 'N/A'}</TableCell>
                        <TableCell>{amenity.capacity || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{amenity.opening_hours || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(amenity.status || '')}>
                            {amenity.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!amenity.status || amenity.status.toLowerCase() === 'available' ? (
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
            {isLoadingBookings ? (
              <div className="py-8 text-center">Loading bookings data...</div>
            ) : !formattedBookings || formattedBookings.length === 0 ? (
              <div className="py-8 text-center">No bookings found</div>
            ) : (
              <div className="space-y-4">
                {formattedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{booking.facility || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} • {booking.time || 'N/A'}
                      </div>
                      <div className="text-sm">Purpose: {booking.purpose || 'N/A'}</div>
                    </div>
                    <div className="mt-2 md:mt-0 space-y-1 text-right">
                      <div className="text-sm font-medium">{booking.bookedBy || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.apartment || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BookAmenityDialog
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        onAdd={refetchAmenities}
        amenityId={selectedAmenityId || undefined}
      />
    </Layout>
  );
};

export default Amenities;
