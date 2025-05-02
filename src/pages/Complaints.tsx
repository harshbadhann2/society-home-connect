
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
import { Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock complaints data
const mockComplaints = [
  {
    id: 1,
    title: 'Water Leakage in Bathroom',
    category: 'Plumbing',
    submittedBy: 'John Doe',
    apartment: 'A-101',
    status: 'Resolved',
    date: '2025-04-25',
  },
  {
    id: 2,
    title: 'Broken Street Light',
    category: 'Electrical',
    submittedBy: 'Jane Smith',
    apartment: 'B-202',
    status: 'In Progress',
    date: '2025-05-01',
  },
  {
    id: 3,
    title: 'Noisy Neighbors',
    category: 'Disturbance',
    submittedBy: 'Robert Johnson',
    apartment: 'C-303',
    status: 'Pending',
    date: '2025-05-02',
  },
  {
    id: 4,
    title: 'Garbage Not Collected',
    category: 'Sanitation',
    submittedBy: 'Emily Wong',
    apartment: 'D-404',
    status: 'Resolved',
    date: '2025-04-29',
  },
  {
    id: 5,
    title: 'Elevator Malfunction',
    category: 'Maintenance',
    submittedBy: 'Michael Brown',
    apartment: 'A-105',
    status: 'In Progress',
    date: '2025-04-30',
  },
];

// Mock data for complaint summary
const complaintsSummary = {
  total: 14,
  resolved: 8,
  inProgress: 4,
  pending: 2,
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Complaints: React.FC = () => {
  const resolvedPercentage = (complaintsSummary.resolved / complaintsSummary.total) * 100;
  const inProgressPercentage = (complaintsSummary.inProgress / complaintsSummary.total) * 100;
  const pendingPercentage = (complaintsSummary.pending / complaintsSummary.total) * 100;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>
            <p className="text-muted-foreground">
              Track and manage resident complaints
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> File Complaint
          </Button>
        </div>

        {/* Complaint status summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resolved</CardTitle>
              <CardDescription>Successfully addressed issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{complaintsSummary.resolved}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Currently being addressed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{complaintsSummary.inProgress}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Awaiting action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{complaintsSummary.pending}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaint status statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Status</CardTitle>
            <CardDescription>Current status of resident complaints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Resolved</div>
                <div className="text-sm text-muted-foreground">{complaintsSummary.resolved} ({resolvedPercentage.toFixed(0)}%)</div>
              </div>
              <Progress value={resolvedPercentage} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">In Progress</div>
                <div className="text-sm text-muted-foreground">{complaintsSummary.inProgress} ({inProgressPercentage.toFixed(0)}%)</div>
              </div>
              <Progress value={inProgressPercentage} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Pending</div>
                <div className="text-sm text-muted-foreground">{complaintsSummary.pending} ({pendingPercentage.toFixed(0)}%)</div>
              </div>
              <Progress value={pendingPercentage} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Complaints listing */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Latest issues reported by residents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted By</TableHead>
                    <TableHead>Apartment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{complaint.submittedBy}</TableCell>
                      <TableCell>{complaint.apartment}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(complaint.date).toLocaleDateString()}
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

export default Complaints;
