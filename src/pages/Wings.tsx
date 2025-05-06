
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
import { Plus, Building, Users, Home } from 'lucide-react';
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
import { mockWings, Wing } from '@/types/database';

const Wings: React.FC = () => {
  const { data: wings, isLoading, error } = useQuery({
    queryKey: ['wings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('wing').select('*');
        
        if (error) {
          console.info('Supabase error:', error);
          console.info('Using mock wings data');
          return mockWings;
        }
        
        // Map database schema to our interface
        return data.map(wing => ({
          wing_id: wing.wing_id,
          id: wing.wing_id,
          wing_name: wing.wing_name,
          name: wing.wing_name,
          total_floors: wing.total_floors || 0,
          floors: wing.total_floors || 0,
          total_apartments: wing.total_apartments || 0,
          apartments: wing.total_apartments || 0,
          maintenance_day: 'Monday', // Default value as it might not be in database
          status: 'Active' // Default value as it might not be in database
        })) as Wing[];
      } catch (err) {
        console.error('Error fetching wings:', err);
        return mockWings;
      }
    }
  });

  const totalApartments = wings?.reduce((total, wing) => total + (wing.apartments || wing.total_apartments || 0), 0) || 0;
  const totalFloors = wings?.reduce((max, wing) => Math.max(max, wing.floors || wing.total_floors || 0), 0) || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Wings</h2>
            <p className="text-muted-foreground">
              Manage building wings in Nirvaan Heights
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Wing
          </Button>
        </div>

        {/* Wings Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Wings</CardTitle>
              <CardDescription>Building blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{wings?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Apartments</CardTitle>
              <CardDescription>Across all wings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalApartments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Maximum Floors</CardTitle>
              <CardDescription>Highest wing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalFloors}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wings Listing */}
        <Card>
          <CardHeader>
            <CardTitle>Wings Directory</CardTitle>
            <CardDescription>All building wings in Nirvaan Heights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              {isLoading ? (
                <div className="p-8 text-center">Loading wings data...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">Error loading wings data</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Floors</TableHead>
                      <TableHead>Apartments</TableHead>
                      <TableHead>Maintenance Day</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wings?.map((wing) => (
                      <TableRow key={wing.id || wing.wing_id}>
                        <TableCell className="font-medium">{wing.name || wing.wing_name}</TableCell>
                        <TableCell>{wing.floors || wing.total_floors}</TableCell>
                        <TableCell>{wing.apartments || wing.total_apartments}</TableCell>
                        <TableCell>{wing.maintenance_day || 'Monday'}</TableCell>
                        <TableCell>
                          <Badge variant={wing.status === 'Active' ? 'default' : 'secondary'}>
                            {wing.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Wings;
