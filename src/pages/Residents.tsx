
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Plus, Phone, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Resident } from '@/types/database';
import { toast } from '@/components/ui/use-toast';

const Residents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch residents data from Supabase
  const { data: residents, isLoading, error } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      // Use the typed client to query the residents table
      const { data, error } = await supabase
        .from('residents')
        .select('*');
      
      if (error) throw error;
      return data as Resident[];
    },
  });

  // Handle search functionality
  const filteredResidents = residents?.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show error toast if fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching residents",
        description: error.message || "Could not load resident data",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Residents</h2>
            <p className="text-muted-foreground">
              Manage residents and their information
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Resident
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Residents Directory</CardTitle>
            <CardDescription>
              View and manage all society residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center w-full max-w-sm mb-6">
              <Input
                placeholder="Search residents..."
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading residents...</span>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-destructive">
                <p>Could not load residents data</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents && filteredResidents.length > 0 ? (
                      filteredResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium">{resident.name}</TableCell>
                          <TableCell>{resident.apartment}</TableCell>
                          <TableCell>{resident.status}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              <span className="hidden md:inline">{resident.contact}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              <span>{resident.email}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {searchTerm ? 'No residents match your search' : 'No residents found'}
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

export default Residents;
