
import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, CalendarRange, Search } from 'lucide-react';
import { AssignParkingDialog } from '@/components/dialogs/AssignParkingDialog';

// Define the parking slot interface
interface ParkingSlot {
  parking_id: number;
  slot_number: string;
  vehicle_type: string;
  vehicle_number: string;
  resident_id: number;
  parking_status: string;
  start_time?: string;
}

// Mock data for fallback
const mockParkingSlots = [
  {
    parking_id: 1,
    slot_number: 'P-001',
    vehicle_type: 'Car',
    vehicle_number: 'MH01AB1234',
    resident_id: 1,
    parking_status: 'Occupied',
    start_time: '2025-05-01T10:00:00',
  },
  {
    parking_id: 2,
    slot_number: 'P-002',
    vehicle_type: 'Motorcycle',
    vehicle_number: 'MH02CD5678',
    resident_id: 2,
    parking_status: 'Reserved',
    start_time: '2025-05-02T14:30:00',
  },
  {
    parking_id: 3,
    slot_number: 'V-001',
    vehicle_type: 'Visitor Car',
    vehicle_number: 'MH03EF9012',
    resident_id: 0,
    parking_status: 'Available',
    start_time: '2025-05-03T08:45:00',
  },
];

const Parking: React.FC = () => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSpotId, setSelectedSpotId] = useState<number | undefined>(undefined);

  // Fetch parking data
  const { data: parkingSlots, isLoading, error, refetch } = useQuery({
    queryKey: ['parkingSlots'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('parking').select('*');
        
        if (error) {
          console.error('Error fetching parking data:', error);
          return mockParkingSlots;
        }
        
        return data as ParkingSlot[];
      } catch (err) {
        console.error('Error:', err);
        return mockParkingSlots;
      }
    }
  });

  // Fetch resident data
  const { data: residents } = useQuery({
    queryKey: ['parkingResidents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('resident_id, name, apartment_id');
        
        if (error) {
          console.error('Error fetching resident data:', error);
          return [];
        }
        
        return data;
      } catch (err) {
        console.error('Error:', err);
        return [];
      }
    }
  });

  // Get resident name by ID
  const getResidentName = (id: number) => {
    if (!residents) return 'Unknown';
    
    const resident = residents.find((r: any) => r.resident_id === id);
    return resident ? resident.name : 'Unknown';
  };

  // Filter parking slots based on search query and status filter
  const filteredParkingSlots = parkingSlots?.filter(slot => {
    const matchesSearch = 
      (slot.slot_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (slot.vehicle_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      getResidentName(slot.resident_id).toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = statusFilter === 'all' || (slot.parking_status?.toLowerCase() || '') === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Counters for statistics
  const totalSlots = parkingSlots?.length || 0;
  const occupiedSlots = parkingSlots?.filter(slot => (slot.parking_status?.toLowerCase() || '') === 'occupied').length || 0;
  const reservedSlots = parkingSlots?.filter(slot => (slot.parking_status?.toLowerCase() || '') === 'reserved').length || 0;

  // Handle status change
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Fixed type instantiation issue by adding an explicit annotation
      const updates: { parking_status: string } = { parking_status: newStatus };
      
      const { error } = await supabase
        .from('parking')
        .update(updates)
        .eq('parking_id', id);
        
      if (error) throw error;
      
      refetch();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  
  // Handle assigning parking
  const handleAssignParking = (id: number) => {
    setSelectedSpotId(id);
    setAssignDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Parking Management</h2>
            <p className="text-muted-foreground">
              Manage parking slots and resident assignments
            </p>
          </div>
          <Button onClick={() => handleAssignParking(parkingSlots?.[0]?.parking_id || 1)}>
            <Car className="mr-2 h-4 w-4" /> Assign Parking
          </Button>
        </div>

        {/* Parking statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Slots</CardTitle>
              <CardDescription>All parking slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Car className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalSlots}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupied Slots</CardTitle>
              <CardDescription>Currently in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarRange className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{occupiedSlots}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reserved Slots</CardTitle>
              <CardDescription>Allocated but not in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarRange className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{reservedSlots}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parking listing */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Slots</CardTitle>
            <CardDescription>List of all parking slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-2">
              <Input
                placeholder="Search parking slots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                      <TableHead>Vehicle Number</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParkingSlots?.map((slot) => (
                      <TableRow key={slot.parking_id}>
                        <TableCell className="font-medium">{slot.slot_number}</TableCell>
                        <TableCell>{slot.vehicle_type}</TableCell>
                        <TableCell>{slot.vehicle_number}</TableCell>
                        <TableCell>{getResidentName(slot.resident_id)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{slot.parking_status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {(slot.parking_status?.toLowerCase() || '') === 'available' ? (
                            <Button variant="ghost" size="sm" onClick={() => handleAssignParking(slot.parking_id)}>
                              Assign
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleStatusChange(slot.parking_id, 'Available')}>
                              Mark Available
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

      <AssignParkingDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssign={refetch}
        spotId={selectedSpotId}
      />
    </Layout>
  );
};

export default Parking;
