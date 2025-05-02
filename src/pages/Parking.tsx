
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
import { Parking as ParkingType, mockParking, mockResidents } from '@/types/database';
import { Input } from '@/components/ui/input';
import { ParkingMeter, Car, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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
  const { toast } = useToast();
  
  const { data: parking, isLoading, error } = useQuery({
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

  const getResidentName = (residentId: number) => {
    if (residentId === 0) return 'N/A';
    const resident = mockResidents.find(r => r.id === residentId);
    return resident ? resident.name : 'Unknown';
  };

  const filteredParking = parking?.filter(spot => 
    spot.spot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getResidentName(spot.resident_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpots = parking?.length || 0;
  const occupiedSpots = parking?.filter(spot => spot.status.toLowerCase() === 'occupied').length || 0;
  const availableSpots = parking?.filter(spot => spot.status.toLowerCase() === 'available').length || 0;

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
          <Button>Assign Parking</Button>
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
            ) : error ? (
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParking?.map((spot) => (
                      <TableRow key={spot.id}>
                        <TableCell className="font-medium">{spot.spot_number}</TableCell>
                        <TableCell>{spot.vehicle_type}</TableCell>
                        <TableCell className="hidden md:table-cell">{spot.vehicle_number || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{getResidentName(spot.resident_id)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(spot.status)}>
                            {spot.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredParking?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          No parking spots found matching your search
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
    </Layout>
  );
};

export default Parking;
