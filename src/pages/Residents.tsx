import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal, Phone, Mail } from 'lucide-react';
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
import { mockResidents } from '@/types/database';
import AddResidentDialog from '@/components/dialogs/AddResidentDialog';

interface ResidentsProps {}

const Residents: React.FC<ResidentsProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: residents = [], isLoading, refetch } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('resident')
          .select('*');

        if (error) {
          console.error('Supabase error:', error);
          console.log('Falling back to mock residents data');
          return mockResidents; // Fallback to mock data
        }
        
        // Map database fields to our expected format
        return data.map(item => ({
          id: item.resident_id,
          name: item.name || 'Unknown',
          apartment: `A${item.apartment_id || 'Unknown'}`, // Prefix with 'A' to make it consistent with mock data
          status: item.status || 'Unknown',
          contact: item.contact_number || 'N/A',
          email: item.email || 'N/A',
          created_at: item.joining_date
        }));
        
      } catch (error) {
        console.error('Error fetching residents:', error);
        return mockResidents; // Fallback to mock data
      }
    },
  });

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.apartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddResident = () => {
    setShowAddDialog(true);
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
    refetch(); // Refresh data after closing the dialog
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <AddResidentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onDialogClose={closeAddDialog} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Residents</h1>
          <Button onClick={handleAddResident}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search residents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resident List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Apartment</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>{resident.name}</TableCell>
                      <TableCell>{resident.apartment}</TableCell>
                      <TableCell>
                        <a href={`tel:${resident.contact}`} className="hover:underline">
                          {resident.contact}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${resident.email}`} className="hover:underline">
                          {resident.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(resident.status)}>
                          {resident.status}
                        </Badge>
                      </TableCell>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Resident</DropdownMenuItem>
                            <DropdownMenuItem>View Payments</DropdownMenuItem>
                            <DropdownMenuItem>Generate Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Residents;
