
import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Home, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PropertiesProps {}

interface Property {
  id: number;
  type: string;
  block: string;
  floor: number;
  number: string;
  status: string;
  owner?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'occupied':
      return 'bg-green-500';
    case 'available':
      return 'bg-blue-500';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'reserved':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const Properties: React.FC<PropertiesProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('apartment')
          .select('*');

        if (error) {
          throw error;
        }

        // Map the data to the Property interface
        return data.map((item: any) => ({
          id: item.apartment_id,
          type: 'Apartment',  // Default to apartment since we don't have a type field
          block: item.block || '',
          floor: item.floor_number || 0,
          number: item.apartment_number || '',
          status: item.apartment_status || 'Unknown',
          owner: item.owner_name || 'Not assigned'
        })) as Property[];
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
  });

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.owner && property.owner.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && property.type.toLowerCase() === currentTab;
  });

  const handleAddProperty = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Property management features will be available in the next update.",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading properties data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <Button onClick={handleAddProperty}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by block, number, or owner..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs
            defaultValue="all"
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="apartment">
                <Home className="h-4 w-4 mr-2" />
                Apartments
              </TabsTrigger>
              <TabsTrigger value="commercial">
                <Building className="h-4 w-4 mr-2" />
                Commercial
              </TabsTrigger>
              <TabsTrigger value="parking">Parking</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.block}</TableCell>
                      <TableCell>{property.number}</TableCell>
                      <TableCell>{property.floor}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.owner || 'Not assigned'}</TableCell>
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

export default Properties;
