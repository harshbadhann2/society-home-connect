import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Car, Search, ParkingSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Parking, mockParking, Resident, mockResidents } from '@/types/database';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'occupied':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'reserved':
    case 'reserved for visitors':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ParkingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedParkingId, setSelectedParkingId] = useState<number | null>(null);
  const [selectedResident, setSelectedResident] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch parking data
  const { data: parkingData = [], isLoading: isLoadingParking, error: parkingError, refetch: refetchParking } = useQuery({
    queryKey: ['parking'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('parking').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return mockParking;
        }
        
        return data as Parking[];
      } catch (err) {
        console.error('Error fetching parking data:', err);
        return mockParking;
      }
    }
  });

  // Fetch residents data
  const { data: residents = [], isLoading: isLoadingResidents } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return mockResidents;
        }
        
        return data as Resident[];
      } catch (err) {
        console.error('Error fetching residents:', err);
        return mockResidents;
      }
    }
  });

  const getResidentName = (residentId: number) => {
    if (!residentId) return '-';
    const resident = residents.find(r => r.resident_id === residentId);
    return resident ? resident.name : 'Unknown';
  };

  const filteredParking = parkingData.filter(spot => 
    spot.slot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (spot.vehicle_number && spot.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (spot.vehicle_type && spot.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getResidentName(spot.resident_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (spot.parking_status && spot.parking_status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableSpots = parkingData.filter(spot => spot.parking_status === 'Available').length;
  const occupiedSpots = parkingData.filter(spot => spot.parking_status === 'Occupied').length;
  const reservedSpots = parkingData.filter(spot => 
    spot.parking_status === 'Reserved' || spot.parking_status === 'Reserved for Visitors'
  ).length;

  const handleAssign = (parkingId: number) => {
    setSelectedParkingId(parkingId);
    setSelectedResident('');
    setVehicleType('');
    setVehicleNumber('');
    setAssignDialogOpen(true);
  };

  const handleRelease = async (parkingId: number) => {
    try {
      // Update parking details in database
      const { error } = await supabase
        .from('parking')
        .update({
          vehicle_type: '',
          vehicle_number: '',
          resident_id: null,
          parking_status: 'Available'
        })
        .eq('parking_id', parkingId);
        
      if (error) throw error;
      
      toast({
        title: "Parking Released",
        description: "The parking spot is now available"
      });
      
      refetchParking();
    } catch (err) {
      console.error('Error releasing parking:', err);
      toast({
        title: "Error",
        description: "Failed to release parking spot",
        variant: "destructive"
      });
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedParkingId || !selectedResident || !vehicleType || !vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const residentId = parseInt(selectedResident);
      
      // Update parking details in database
      const { error } = await supabase
        .from('parking')
        .update({
          vehicle_type: vehicleType,
          vehicle_number: vehicleNumber,
          resident_id: residentId,
          parking_status: 'Occupied'
        })
        .eq('parking_id', selectedParkingId);
        
      if (error) throw error;
      
      toast({
        title: "Parking Assigned",
        description: "The parking spot has been successfully assigned"
      });
      
      setAssignDialogOpen(false);
      refetchParking();
    } catch (err) {
      console.error('Error assigning parking:', err);
      toast({
        title: "Error",
        description: "Failed to assign parking spot",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Parking Management</h2>
            <p className="text-muted-foreground">
              Manage resident parking spots and vehicle information
            </p>
          </div>
        </div>

        {/* Parking statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Spots</CardTitle>
              <CardDescription>Ready for assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ParkingSquare className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{availableSpots}</span>
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
                <Car className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{occupiedSpots}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reserved Spots</CardTitle>
              <CardDescription>Special allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{reservedSpots}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parking listing */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Directory</CardTitle>
            <CardDescription>All parking spots in the society</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parking spots..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoadingParking ? (
              <div className="py-8 text-center">Loading parking data...</div>
            ) : parkingError ? (
              <div className="py-8 text-center text-red-500">Error loading parking data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spot Number</TableHead>
                      <TableHead className="hidden md:table-cell">Vehicle Type</TableHead>
                      <TableHead>Vehicle Number</TableHead>
                      <TableHead className="hidden md:table-cell">Resident</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParking.map((spot) => (
                      <TableRow key={spot.parking_id}>
                        <TableCell>{spot.slot_number}</TableCell>
                        <TableCell className="hidden md:table-cell">{spot.vehicle_type || '-'}</TableCell>
                        <TableCell>{spot.vehicle_number || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{getResidentName(spot.resident_id)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={getStatusColor(spot.parking_status || '')}
                          >
                            {spot.parking_status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {spot.parking_status === 'Available' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAssign(spot.parking_id)}
                            >
                              Assign
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRelease(spot.parking_id)}
                              className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                              Release
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
      </div>

      {/* Assign Parking Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Parking Spot</DialogTitle>
            <DialogDescription>
              Assign this parking spot to a resident and their vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resident" className="text-right">
                Resident
              </Label>
              <Select value={selectedResident} onValueChange={setSelectedResident}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a resident" />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((resident) => (
                    <SelectItem key={resident.resident_id} value={resident.resident_id.toString()}>
                      {resident.name} ({resident.apartment_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicleType" className="text-right">
                Vehicle Type
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicleNumber" className="text-right">
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Parking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ParkingPage;
