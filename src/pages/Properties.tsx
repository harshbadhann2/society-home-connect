
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
import { Plus, Home, Building2, User } from 'lucide-react';
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
import { Apartment, mockApartments as importedMockApartments } from '@/types/database';

// Local mock apartments for this component if needed
const localMockApartments = [
  {
    id: 1,
    apartment_id: 1,
    apartment_number: 'A-101',
    type: '2 BHK',
    size: '1200 sqft',
    bedrooms: 2,
    bathrooms: 2,
    wing: 'A',
    owner_name: 'John Doe',
    owner_contact: '555-1234',
    apartment_status: 'Occupied',
    status: 'Occupied'
  },
  // ... other mock apartments
];

// Use imported mock data or local mock data
const mockApartments = importedMockApartments || localMockApartments;

const Properties: React.FC = () => {
  const { data: apartments, isLoading, error } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      try {
        // Change from 'apartment' to match the actual table name in Supabase
        const { data, error } = await supabase.from('apartment').select('*');
        
        if (error) {
          console.error('Error fetching apartments:', error);
          return mockApartments;
        }
        
        // Map database fields to match our Apartment interface
        return data.map(apt => ({
          apartment_id: apt.apartment_id,
          id: apt.apartment_id,
          apartment_number: apt.apartment_number,
          unit: apt.apartment_number,
          owner_name: apt.owner_name,
          owner: apt.owner_name,
          owner_contact: apt.owner_contact,
          apartment_status: apt.apartment_status,
          status: apt.apartment_status,
          block: apt.block,
          wing: apt.block,
          wing_id: apt.wing_id,
          floor_number: apt.floor_number,
          // Add default fields that might be expected but aren't in the database
          type: '2 BHK', // Default type
          size: 'N/A', // Default size
          bedrooms: 2, // Default bedrooms
          bathrooms: 1, // Default bathrooms
        })) as Apartment[];
      } catch (err) {
        console.error('Error in apartments query:', err);
        return mockApartments;
      }
    }
  });

  // Count different apartment types
  const countByType = {
    '1 BHK': apartments?.filter(apt => (apt.type || '2 BHK') === '1 BHK').length || 0,
    '2 BHK': apartments?.filter(apt => (apt.type || '2 BHK') === '2 BHK').length || 0,
    '3 BHK': apartments?.filter(apt => (apt.type || '2 BHK') === '3 BHK').length || 0,
    'Other': apartments?.filter(apt => !['1 BHK', '2 BHK', '3 BHK'].includes(apt.type || '2 BHK')).length || 0,
  };

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
                <span className="text-2xl font-bold">{countByType['1 BHK']}</span>
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
                <Building2 className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{countByType['2 BHK']}</span>
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
                <span className="text-2xl font-bold">{countByType['3 BHK']}</span>
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
