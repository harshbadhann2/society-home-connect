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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryRecord as DeliveryRecordType, mockDeliveryRecords, mockResidents } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Truck, Package, Calendar, PackageCheck } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase() || '') {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in transit':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const DeliveryRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecordType[]>([]);
  const [residents, setResidents] = useState(mockResidents);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch delivery records
        const { data: recordsData, error: recordsError } = await supabase
          .from('delivery_records')
          .select('*');
          
        if (recordsError) {
          console.info('Supabase delivery records error:', recordsError);
          console.info('Using mock delivery records data');
          setDeliveryRecords(mockDeliveryRecords);
          toast({
            title: "Database Connection Issue",
            description: "Using sample data for delivery records.",
            variant: "default",
          });
        } else {
          setDeliveryRecords(recordsData || mockDeliveryRecords);
          toast({
            title: "Data Loaded Successfully",
            description: "Displaying real delivery data from database.",
            variant: "default",
          });
        }
        
        // Fetch residents
        const { data: residentsData, error: residentsError } = await supabase
          .from('residents')
          .select('*');
          
        if (residentsError) {
          console.info('Supabase residents error:', residentsError);
          console.info('Using mock residents data');
          setResidents(mockResidents);
        } else {
          setResidents(residentsData || mockResidents);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "Could not fetch delivery records. Using mock data instead.",
        });
        setDeliveryRecords(mockDeliveryRecords);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const getResidentName = (residentId: number) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? resident.name : 'Unknown';
  };

  const getResidentApartment = (residentId: number) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? resident.apartment : 'Unknown';
  };

  const filteredRecords = deliveryRecords?.filter(record => {
    const packageId = record.package_id?.toLowerCase() || '';
    const residentName = getResidentName(record.resident_id)?.toLowerCase() || '';
    const courierName = record.courier_name?.toLowerCase() || '';
    const status = record.status?.toLowerCase() || '';
    const searchTermLower = searchTerm?.toLowerCase() || '';
    
    return packageId.includes(searchTermLower) || 
           residentName.includes(searchTermLower) || 
           courierName.includes(searchTermLower) || 
           status.includes(searchTermLower);
  });

  const totalDeliveries = deliveryRecords?.length || 0;
  const deliveredCount = deliveryRecords?.filter(record => (record.status?.toLowerCase() || '') === 'delivered').length || 0;
  const pendingCount = deliveryRecords?.filter(record => (record.status?.toLowerCase() || '') !== 'delivered').length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Delivery Records</h2>
            <p className="text-muted-foreground">
              Track package and courier deliveries for Nirvaan Heights
            </p>
          </div>
          <Button>
            <PackageCheck className="mr-2 h-4 w-4" /> Add Delivery
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
                <Truck className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalDeliveries}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Delivered</CardTitle>
              <CardDescription>Successfully completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{deliveredCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>In transit or scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{pendingCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery records listing */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Records</CardTitle>
            <CardDescription>All package deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search delivery records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {loading ? (
              <div className="py-8 text-center">Loading delivery records...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package ID</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead className="hidden md:table-cell">Apartment</TableHead>
                      <TableHead className="hidden md:table-cell">Delivery Date</TableHead>
                      <TableHead className="hidden md:table-cell">Delivery Time</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords && filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.package_id || 'Unknown'}</TableCell>
                          <TableCell>{getResidentName(record.resident_id)}</TableCell>
                          <TableCell className="hidden md:table-cell">{getResidentApartment(record.resident_id)}</TableCell>
                          <TableCell className="hidden md:table-cell">{record.delivery_date || 'Not specified'}</TableCell>
                          <TableCell className="hidden md:table-cell">{record.delivery_time || 'Not specified'}</TableCell>
                          <TableCell>{record.courier_name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(record.status || '')}>
                              {record.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          {searchTerm ? 'No delivery records matching your search' : 'No delivery records found'}
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

export default DeliveryRecords;
