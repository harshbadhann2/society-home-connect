
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
import { Plus, Building, User, Home, Calendar } from 'lucide-react';
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

// Mock data for apartments
const mockApartments = [
  {
    id: 1,
    unit: 'A-101',
    type: '2 BHK',
    size: '1200 sqft',
    bedrooms: 2,
    bathrooms: 2,
    wing: 'A',
    owner: 'John Doe',
    status: 'Occupied',
  },
  {
    id: 2,
    unit: 'B-202',
    type: '1 BHK',
    size: '950 sqft',
    bedrooms: 1,
    bathrooms: 1,
    wing: 'B',
    owner: 'Jane Smith',
    status: 'Occupied',
  },
  {
    id: 3,
    unit: 'C-303',
    type: '3 BHK',
    size: '1800 sqft',
    bedrooms: 3,
    bathrooms: 2,
    wing: 'C',
    owner: 'Robert Johnson',
    status: 'Occupied',
  },
  {
    id: 4,
    unit: 'D-404',
    type: '2 BHK',
    size: '1100 sqft',
    bedrooms: 2,
    bathrooms: 1,
    wing: 'D',
    owner: 'Michael Brown',
    status: 'Vacant',
  },
  {
    id: 5,
    unit: 'A-105',
    type: '2 BHK',
    size: '1300 sqft',
    bedrooms: 2,
    bathrooms: 2,
    wing: 'A',
    owner: 'Emily Wong',
    status: 'Occupied',
  },
];

const Properties: React.FC = () => {
  const { data: apartments, isLoading, error } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('apartments').select('*');
        
        if (error) {
          console.info('Supabase error:', error);
          console.info('Using mock apartments data');
          return mockApartments;
        }
        
        return data || mockApartments;
      } catch (err) {
        console.error('Error fetching apartments:', err);
        return mockApartments;
      }
    }
  });

  const oneBhk = apartments?.filter(apt => apt.type === '1 BHK').length || 0;
  const twoBhk = apartments?.filter(apt => apt.type === '2 BHK').length || 0;
  const threeBhk = apartments?.filter(apt => apt.type === '3 BHK').length || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Apartments</h2>
            <p className="text-muted-foreground">
              Manage apartment units in Nirvaan Heights
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Apartment
          </Button>
        </div>

        {/* Apartment Types Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">1 BHK</CardTitle>
              <CardDescription>One bedroom units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{oneBhk}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">2 BHK</CardTitle>
              <CardDescription>Two bedroom units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{twoBhk}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">3 BHK</CardTitle>
              <CardDescription>Three bedroom units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{threeBhk}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apartment Listing */}
        <Card>
          <CardHeader>
            <CardTitle>Apartment Directory</CardTitle>
            <CardDescription>All apartment units in Nirvaan Heights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              {isLoading ? (
                <div className="p-8 text-center">Loading apartment data...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">Error loading apartment data</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="hidden md:table-cell">Bedrooms</TableHead>
                      <TableHead className="hidden md:table-cell">Bathrooms</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apartments?.map((apartment) => (
                      <TableRow key={apartment.id}>
                        <TableCell className="font-medium">{apartment.unit}</TableCell>
                        <TableCell>{apartment.type}</TableCell>
                        <TableCell>{apartment.wing}</TableCell>
                        <TableCell>{apartment.size}</TableCell>
                        <TableCell className="hidden md:table-cell">{apartment.bedrooms}</TableCell>
                        <TableCell className="hidden md:table-cell">{apartment.bathrooms}</TableCell>
                        <TableCell>{apartment.owner}</TableCell>
                        <TableCell>
                          <Badge variant={apartment.status === 'Occupied' ? 'default' : 'outline'}>
                            {apartment.status}
                          </Badge>
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

export default Properties;
