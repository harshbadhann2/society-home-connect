
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
import { MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileComplaintDialog } from '@/components/dialogs/FileComplaintDialog';

// Common type for complaint structure
interface Complaint {
  id: number;
  resident_id: number;
  subject: string;
  description: string;
  category: string;
  status: string;
  date_filed: string;
  date_resolved?: string;
  assigned_to?: string;
}

// Mock complaints data
const mockComplaints = [
  {
    id: 1,
    resident_id: 1,
    subject: 'Water Leakage in Bathroom',
    description: 'There is water leaking from the ceiling of my bathroom.',
    category: 'Plumbing',
    status: 'In Progress',
    date_filed: '2025-04-28',
    assigned_to: 'Maintenance Team',
  },
  {
    id: 2,
    resident_id: 3,
    subject: 'Noise Complaint',
    description: 'Excessive noise from apartment B-203 late at night.',
    category: 'Noise',
    status: 'Pending',
    date_filed: '2025-05-01',
  },
  {
    id: 3,
    resident_id: 2,
    subject: 'Common Area Light Not Working',
    description: 'The light in the stairwell of Block C has been out for two days.',
    category: 'Electrical',
    status: 'Resolved',
    date_filed: '2025-04-25',
    date_resolved: '2025-04-27',
    assigned_to: 'Electrician',
  },
  {
    id: 4,
    resident_id: 1,
    subject: 'Garbage Not Collected',
    description: 'The garbage from Block A has not been collected for two days.',
    category: 'Cleanliness',
    status: 'Pending',
    date_filed: '2025-05-02',
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Complaints: React.FC = () => {
  const [fileComplaintDialogOpen, setFileComplaintDialogOpen] = useState(false);

  const { data: complaints, isLoading, error, refetch } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      try {
        // Fix: Change from "complaints" to "complaint" to match database schema
        const { data, error } = await supabase.from('complaint').select('*').order('date_raised', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          return mockComplaints;
        }
        
        // Transform the data to match our Complaint interface
        const transformedData = data ? data.map(item => ({
          id: item.complaint_id,
          resident_id: item.resident_id || 0,
          subject: item.subject || '',
          description: item.complaint_text || '',
          category: 'General', // Default since it's not in the DB schema
          status: item.complaint_status || 'Pending',
          date_filed: item.date_raised || new Date().toISOString().split('T')[0],
          assigned_to: ''
        })) : [];
        
        return transformedData as Complaint[];
      } catch (err) {
        console.error('Error fetching complaints:', err);
        return mockComplaints;
      }
    }
  });

  const { data: residents } = useQuery({
    queryKey: ['complaintsResidents'],
    queryFn: async () => {
      try {
        // Fix: Change from "residents" to "resident" to match database schema
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
    if (residents && residents.length > 0) {
      const resident = residents.find((r: any) => r.resident_id === residentId);
      return resident ? resident.name : 'Unknown';
    }
    
    // Fallback
    return `Resident ${residentId}`;
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Fix type instantiation issue with explicit type annotation
      const updates: { complaint_status: string } = {
        complaint_status: newStatus,
      };
      
      const { error } = await supabase
        .from('complaint')
        .update(updates)
        .eq('complaint_id', id);
        
      if (error) throw error;
      
      refetch();
    } catch (err) {
      console.error('Error updating complaint status:', err);
    }
  };

  const pendingCount = complaints?.filter(c => c.status.toLowerCase() === 'pending').length || 0;
  const inProgressCount = complaints?.filter(c => c.status.toLowerCase() === 'in progress').length || 0;
  const resolvedCount = complaints?.filter(c => c.status.toLowerCase() === 'resolved').length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>
            <p className="text-muted-foreground">
              Manage resident complaints and maintenance requests
            </p>
          </div>
          <Button onClick={() => setFileComplaintDialogOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" /> File Complaint
          </Button>
        </div>

        {/* Complaints statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>New complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{pendingCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Under resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{inProgressCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resolved</CardTitle>
              <CardDescription>Completed this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{resolvedCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints listing */}
        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>Recent and historical resident complaints</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading complaints...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading complaints</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Resident</TableHead>
                      <TableHead className="hidden md:table-cell">Date Filed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints?.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.subject}</TableCell>
                        <TableCell className="hidden md:table-cell">{complaint.category}</TableCell>
                        <TableCell className="hidden md:table-cell">{getResidentName(complaint.resident_id)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(complaint.date_filed).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {complaint.status.toLowerCase() === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(complaint.id, 'In Progress')}
                            >
                              Start Progress
                            </Button>
                          )}
                          {complaint.status.toLowerCase() === 'in progress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(complaint.id, 'Resolved')}
                            >
                              Mark Resolved
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

      <FileComplaintDialog
        open={fileComplaintDialogOpen}
        onOpenChange={setFileComplaintDialogOpen}
        onAdd={refetch}
      />
    </Layout>
  );
};

export default Complaints;
