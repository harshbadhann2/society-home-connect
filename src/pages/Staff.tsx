import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockStaff } from '@/types/database';
import AddStaffDialog from '@/components/dialogs/AddStaffDialog';
import AssignTaskDialog from '@/components/dialogs/AssignTaskDialog';
import { useToast } from '@/hooks/use-toast';

interface StaffProps {}

const Staff: React.FC<StaffProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: staffMembers = [], isLoading, refetch } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*');

        if (error) {
          throw error;
        }

        // Map the fields from Supabase schema to our expected format
        return data.map(staff => ({
          id: staff.staff_id,
          name: staff.name || 'Unknown',
          position: staff.role || 'Unknown',
          contact: staff.contact_number || 'N/A',
          email: `${staff.name?.toLowerCase().replace(/\s+/g, '.')}@nirvaanheights.com` || 'N/A',
          joining_date: staff.joining_date,
          status: 'Active', // Default status since it's not in the schema
        }));
      } catch (error) {
        console.error('Error fetching staff:', error);
        return mockStaff;
      }
    },
  });

  const filteredStaff = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = () => {
    setShowAddDialog(true);
  };

  const handleAssignTask = (staffId: number) => {
    setSelectedStaffId(staffId);
    setShowTaskDialog(true);
  };

  const closeTaskDialog = () => {
    setSelectedStaffId(null);
    setShowTaskDialog(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{staff.position}</Badge>
                    </TableCell>
                    <TableCell>{staff.contact}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{new Date(staff.joining_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleAssignTask(staff.id)}>
                            Assign Task
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Staff</DropdownMenuItem>
                          <DropdownMenuItem>Remove Staff</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddStaffDialog open={showAddDialog} onOpenChange={setShowAddDialog} onStaffAdded={refetch} />
      <AssignTaskDialog
        open={showTaskDialog}
        onOpenChange={closeTaskDialog}
        staffId={selectedStaffId}
        onTaskAssigned={refetch}
      />
    </Layout>
  );
};

export default Staff;
