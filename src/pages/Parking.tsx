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
import { Parking as ParkingType, mockParking } from '@/types/database';
import { Input } from '@/components/ui/input';
import { ParkingMeter, Car, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AssignParkingDialog } from '@/components/dialogs/AssignParkingDialog';

const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase() || '') {
    case 'occupied':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'reserved for visitors':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Parking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Fetch parking data
  const { data: parkingData, isLoading: parkingLoading, error: parkingError, refetch: refetchParking } = useQuery({
    queryKey: ['parking'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('parking').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          toast({
            title: "Database Error",
            description: "Could not fetch parking data from database. Using mock data instead.",
            variant: "destructive"
          });
          return mockParking;
        }
        
        if (data && data.length > 0) {
          return data as ParkingType[];
        } else {
          console.info('No parking data found in database, using mock data');
          return mockParking;
        }
      } catch (err) {
        console.error('Error fetching parking:', err);
        toast({
          title: "Error",
          description: "An error occurred while fetching parking data. Using mock data.",
          variant: "destructive"
        });
        return mockParking;
      }
    }
  });

  // State to track parking data (from DB or mock)
  const [parkingSpots, setParkingSpots] = useState<ParkingType[]>([]);

  // Update local state whenever parkingData changes
  React.useEffect(() => {
    if (parkingData) {
      setParkingSpots(parkingData);
    }
  }, [parkingData]);

  // Fetch residents data for names
  const { data: residents, isLoading: residentsLoading } = useQuery({
    queryKey: ['resident-names'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('resident_id, name');
        
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

  const getResidentName = (residentId: number) => {
    if (residentId === 0) return 'N/A';
    
    // Use residents from database if available
    if (residents && residents.length > 0) {
      const resident = residents.find((r) => r.resident_id === residentId);
      return resident ? resident.name : 'Unknown';
    }
    
    // Fallback to mock residents if database fetch failed
    const mockResident = mockResidents.find(r => r.id === residentId);
    return mockResident ? mockResident.name : 'Unknown';
  };

  // Filtered parking spots based on search term
  const filteredParking = parkingSpots.filter(spot => {
    const spotNumber = spot.spot_number?.toLowerCase() || '';
    const vehicleNumber = spot.vehicle_number?.toLowerCase() || '';
    const residentName = getResidentName(spot.resident_id)?.toLowerCase() || '';
    const status = spot.status?.toLowerCase() || '';
    const searchTermLower = searchTerm?.toLowerCase() || '';
    
    return spotNumber.includes(searchTermLower) ||
          vehicleNumber.includes(searchTermLower) ||
          residentName.includes(searchTermLower) ||
          status.includes(searchTermLower);
  });

  const handleAssignParking = (spotId: number) => {
    setSelectedSpotId(spotId);
    setAssignDialogOpen(true);
  };

  // Updated release parking function to handle both DB and mock data
  const handleReleaseParking = async (spotId: number) => {
    try {
      // Try to update in database first
      const { error } = await supabase
        .from('parking')
        .update({
          resident_id: 0,
          vehicle_type: '',
          vehicle_number: '',
          status: 'Available'
        })
        .eq('id', spotId);

      // If there's an error with the database update
      if (error) {
        console.error('Error releasing parking in DB:', error);
        
        // Fallback to updating mock data in local state
        setParkingSpots(prevSpots => 
          prevSpots.map(spot => 
            spot.id === spotId 
              ? { ...spot, resident_id: 0, vehicle_type: '', vehicle_number: '', status: 'Available' }
              : spot
          )
        );
        
        toast({
          title: "Parking Released",
          description: "The parking spot has been successfully released (using local data)."
        });
        return;
      }

      toast({
        title: "Parking Released",
        description: "The parking spot has been successfully released."
      });
      
      // Refresh data
      refetchParking();
    } catch (err) {
      console.error('Error releasing parking:', err);
      
      // Fallback to updating mock data in local state
      setParkingSpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === spotId 
            ? { ...spot, resident_id: 0, vehicle_type: '', vehicle_number: '', status: 'Available' }
            : spot
        )
      );
      
      toast({
        title: "Parking Released",
        description: "The parking spot has been successfully released (using local data)."
      });
    }
  };

  const totalSpots = parkingSpots.length || 0;
  const occupiedSpots = parkingSpots.filter(spot => (spot.status?.toLowerCase() || '') === 'occupied').length || 0;
  const availableSpots = parkingSpots.filter(spot => (spot.status?.toLowerCase() || '') === 'available').length || 0;

  const isLoading = parkingLoading || residentsLoading;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Parking Management</h2>
            <p className="text-muted-foreground">
              View and manage Nirvaan Heights parking spots
            </p>
          </div>
          <Button 
            onClick={() => {
              const availableSpot = parkingSpots.find(spot => (spot.status?.toLowerCase() || '') === 'available');
              if (availableSpot) {
                handleAssignParking(availableSpot.id);
              } else {
                toast({
                  title: "No available spots",
                  description: "There are currently no available parking spots to assign.",
                  variant: "destructive"
                });
              }
            }}
          >
            Assign Parking
          </Button>
        </div>

        {/* Parking statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Parking Spots</CardTitle>
              <CardDescription>Society wide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ParkingMeter className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalSpots}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupied Spots</CardTitle>
              <CardDescription>Currently in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Car className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{occupiedSpots}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Spots</CardTitle>
              <CardDescription>Ready for assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{availableSpots}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parking listing */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Directory</CardTitle>
            <CardDescription>All Nirvaan Heights parking spots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search parking spots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="py-8 text-center">Loading parking data...</div>
            ) : parkingError ? (
              <div className="py-8 text-center text-red-500">Error loading parking data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spot Number</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead className="hidden md:table-cell">Vehicle Number</TableHead>
                      <TableHead className="hidden md:table-cell">Resident</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParking && filteredParking.length > 0 ? (
                      filteredParking.map((spot) => (
                        <TableRow key={spot.id}>
                          <TableCell className="font-medium">{spot.spot_number || 'N/A'}</TableCell>
                          <TableCell>{spot.vehicle_type || 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">{spot.vehicle_number || 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">{getResidentName(spot.resident_id)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(spot.status)}>
                              {spot.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {(spot.status?.toLowerCase() || '') === 'available' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAssignParking(spot.id)}
                              >
                                Assign
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReleaseParking(spot.id)}
                              >
                                Release
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          {searchTerm ? 'No parking spots found matching your search' : 'No parking spots available'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Parking Assignment Dialog */}
      <AssignParkingDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssign={() => {
          refetchParking();
        }}
        spotId={selectedSpotId || undefined}
      />
    </Layout>
  );
};

// Needed for fallback
const mockResidents = [
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

export default Parking;
