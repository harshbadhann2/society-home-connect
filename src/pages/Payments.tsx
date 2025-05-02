
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
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock payments data
const mockPayments = [
  {
    id: 1,
    description: 'Maintenance Fee - May 2025',
    resident: 'John Doe',
    apartment: 'A-101',
    amount: 250.00,
    date: '2025-05-02',
    status: 'Paid',
  },
  {
    id: 2,
    description: 'Maintenance Fee - May 2025',
    resident: 'Jane Smith',
    apartment: 'B-202',
    amount: 250.00,
    date: '2025-05-01',
    status: 'Paid',
  },
  {
    id: 3,
    description: 'Maintenance Fee - May 2025',
    resident: 'Robert Johnson',
    apartment: 'C-303',
    amount: 250.00,
    date: '2025-05-03',
    status: 'Pending',
  },
  {
    id: 4,
    description: 'Maintenance Fee - May 2025',
    resident: 'Emily Wong',
    apartment: 'D-404',
    amount: 250.00,
    date: '2025-05-02',
    status: 'Pending',
  },
  {
    id: 5,
    description: 'Community Hall Booking',
    resident: 'John Doe',
    apartment: 'A-101',
    amount: 100.00,
    date: '2025-04-28',
    status: 'Paid',
  },
];

// Mock payment summary
const paymentSummary = {
  totalCollected: 600,
  pendingAmount: 500,
  maintenanceFee: 250,
  collectionRate: 75,
};

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
          <Button>
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
                <DollarSign className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">${paymentSummary.totalCollected}</span>
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
                <span className="text-2xl font-bold">${paymentSummary.pendingAmount}</span>
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
                <DollarSign className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">${paymentSummary.maintenanceFee}</span>
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
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.description}</TableCell>
                      <TableCell>{payment.resident}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.apartment}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Payments;
