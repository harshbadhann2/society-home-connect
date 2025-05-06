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
import { Plus, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
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
import { RecordPaymentDialog } from '@/components/dialogs/RecordPaymentDialog';
import { Payment, mockPayments, mockPaymentResidents } from '@/types/database';

// If mockPaymentResidents doesn't exist in database.ts, add it here
const localMockPaymentResidents = [
  { id: 1, resident_id: 1, name: "John Doe", apartment: "A-101" },
  { id: 2, resident_id: 2, name: "Jane Smith", apartment: "B-202" },
  { id: 3, resident_id: 3, name: "Robert Johnson", apartment: "C-303" },
  { id: 4, resident_id: 4, name: "Michael Brown", apartment: "D-404" },
  { id: 5, resident_id: 5, name: "Emily Wong", apartment: "A-105" }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Payments: React.FC = () => {
  const [recordPaymentDialogOpen, setRecordPaymentDialogOpen] = useState(false);

  const { data: payments, isLoading, error, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      try {
        // Try to get payments from the banking table in database 
        // since we don't have a payments table
        const { data, error } = await supabase.from('banking').select('*').order('transaction_date', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          return mockPayments || [];
        }
        
        // Map banking data to our Payment interface
        return data.map(item => ({
          transaction_id: item.transaction_id,
          id: item.transaction_id,
          resident_id: item.resident_id || 0,
          amount: item.amount || 0,
          transaction_date: item.transaction_date || '',
          date: item.transaction_date || '',
          payment_method: item.payment_method || '',
          banking_status: item.banking_status || '',
          status: item.banking_status || '',
          purpose: item.purpose || '',
          description: item.purpose || 'Payment',
          currency: 'INR' // Default currency
        })) as Payment[];
      } catch (err) {
        console.error('Error fetching payments:', err);
        return mockPayments || [];
      }
    }
  });

  const { data: residents } = useQuery({
    queryKey: ['payment-residents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('resident_id, name, apartment_id');
        
        if (error) {
          console.error('Supabase error fetching residents:', error);
          return localMockPaymentResidents;
        }
        
        return data.map(r => ({
          resident_id: r.resident_id,
          id: r.resident_id,
          name: r.name,
          apartment: r.apartment_id?.toString() || 'N/A'
        }));
      } catch (err) {
        console.error('Error fetching residents:', err);
        return localMockPaymentResidents;
      }
    }
  });

  const getResidentName = (residentId: number) => {
    if (!residents) return 'Unknown';
    const resident = residents.find(r => r.resident_id === residentId || r.id === residentId);
    return resident?.name || 'Unknown';
  };

  const getResidentApartment = (residentId: number) => {
    if (!residents) return 'N/A';
    const resident = residents.find(r => r.resident_id === residentId || r.id === residentId);
    return resident?.apartment || 'N/A';
  };

  // Calculate payment statistics
  const paidPayments = payments?.filter(p => (p.status || p.banking_status || '').toLowerCase() === 'paid') || [];
  const totalCollected = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingPayments = payments?.filter(p => (p.status || p.banking_status || '').toLowerCase() === 'pending') || [];
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const maintenanceFee = 250; // Assumption based on mock data
  
  const totalApartments = residents?.length || 0;
  const paidApartments = new Set(paidPayments.map(p => p.resident_id)).size;
  const collectionRate = totalApartments > 0 ? Math.round((paidApartments / totalApartments) * 100) : 0;

  // Payment summary
  const paymentSummary = {
    totalCollected,
    pendingAmount,
    maintenanceFee,
    collectionRate,
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">
              Track society fee payments and finances
            </p>
          </div>
          <Button onClick={() => setRecordPaymentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Record Payment
          </Button>
        </div>

        {/* Payment statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Collected</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <IndianRupee className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">₹{paymentSummary.totalCollected}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Outstanding dues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">₹{paymentSummary.pendingAmount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Fee</CardTitle>
              <CardDescription>Per apartment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <IndianRupee className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">₹{paymentSummary.maintenanceFee}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Collection Rate</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{paymentSummary.collectionRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Last 30 days of payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading payment data...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading payment data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead className="hidden md:table-cell">Apartment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment) => (
                      <TableRow key={payment.id || payment.transaction_id}>
                        <TableCell className="font-medium">{payment.description || payment.purpose}</TableCell>
                        <TableCell>{getResidentName(payment.resident_id)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {payment.apartment || getResidentApartment(payment.resident_id)}
                        </TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(payment.date || payment.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(payment.status || payment.banking_status)}>
                            {payment.status || payment.banking_status}
                          </Badge>
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

      <RecordPaymentDialog 
        open={recordPaymentDialogOpen}
        onOpenChange={setRecordPaymentDialogOpen}
        onAdd={refetch}
      />
    </Layout>
  );
};

export default Payments;
