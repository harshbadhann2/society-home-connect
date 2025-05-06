
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
import { Input } from '@/components/ui/input';
import { Package, Clock, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddDeliveryDialog } from '@/components/dialogs/AddDeliveryDialog';

interface Delivery {
  id: number;
  package_info: string;
  resident_id: number;
  received_date: string;
  status: string;
  courier_name: string;
  delivered_date?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'received':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const DeliveryRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: deliveries, isLoading, error, refetch } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('delivery_records').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return mockDeliveries;
        }
        
        return data.map(item => ({
          id: item.delivery_id,
          package_info: item.courier_company_name || 'Unknown Package',
          resident_id: item.resident_id || 0,
          received_date: item.delivery_date || new Date().toISOString(),
          status: item.delivery_status || 'Pending',
          courier_name: item.courier_company_name || 'Unknown Courier',
          delivered_date: null
        })) as Delivery[];
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        return mockDeliveries;
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

  const getResidentNameAndApartment = (residentId: number) => {
    if (residents && residents.length > 0) {
      const resident = residents.find((r: any) => r.resident_id === residentId);
      return resident ? `${resident.name} (${resident.apartment_id})` : 'Unknown';
    }
    return 'Unknown';
  };

  const filteredDeliveries = deliveries?.filter(delivery => 
    delivery.package_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.courier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getResidentNameAndApartment(delivery.resident_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingDeliveries = deliveries?.filter(delivery => 
    delivery.status.toLowerCase() === 'received' || delivery.status.toLowerCase() === 'pending'
  ).length || 0;
  
  const totalDeliveries = deliveries?.length || 0;

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('delivery_records')
        .update({ 
          delivery_status: status,
          ...(status === 'Delivered' ? { delivery_date: new Date().toISOString() } : {})
        })
        .eq('delivery_id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Delivery status changed to ${status}`
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Delivery Records</h2>
            <p className="text-muted-foreground">
              Track package deliveries for residents
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Package className="mr-2 h-4 w-4" /> Add Delivery
          </Button>
        </div>

        {/* Delivery statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Deliveries</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalDeliveries}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Deliveries</CardTitle>
              <CardDescription>Awaiting collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{pendingDeliveries}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Popular Couriers</CardTitle>
              <CardDescription>Most frequent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries listing */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Records</CardTitle>
            <CardDescription>All package deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="py-8 text-center">Loading delivery data...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading delivery data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Info</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead className="hidden md:table-cell">Courier</TableHead>
                      <TableHead className="hidden md:table-cell">Received Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries && filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.package_info}</TableCell>
                          <TableCell>{getResidentNameAndApartment(delivery.resident_id)}</TableCell>
                          <TableCell className="hidden md:table-cell">{delivery.courier_name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(delivery.received_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(delivery.status)}>
                              {delivery.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {delivery.status.toLowerCase() === 'received' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.id, 'Delivered')}
                              >
                                Mark Delivered
                              </Button>
                            )}
                            {delivery.status.toLowerCase() === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.id, 'Received')}
                              >
                                Mark Received
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          {searchTerm ? 'No deliveries found matching your search' : 'No deliveries recorded'}
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

      <AddDeliveryDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAdd={refetch}
      />
    </Layout>
  );
};

// Mock data for fallback
const mockDeliveries = [
  {
    id: 1,
    package_info: 'Amazon Package',
    resident_id: 1,
    received_date: '2025-05-01T10:30:00',
    status: 'Delivered',
    courier_name: 'Amazon Logistics',
    delivered_date: '2025-05-01T15:45:00'
  },
  {
    id: 2,
    package_info: 'Food Delivery',
    resident_id: 3,
    received_date: '2025-05-02T12:15:00',
    status: 'Received',
    courier_name: 'Swiggy'
  },
  {
    id: 3,
    package_info: 'Electronics Package',
    resident_id: 2,
    received_date: '2025-05-03T09:45:00',
    status: 'Received',
    courier_name: 'Flipkart'
  }
];

export default DeliveryRecords;
