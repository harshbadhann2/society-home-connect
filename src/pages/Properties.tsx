
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

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    unit: 'A-101',
    type: 'Apartment',
    size: '1200 sqft',
    bedrooms: 2,
    bathrooms: 2,
    owner: 'John Doe',
    status: 'Occupied',
  },
  {
    id: 2,
    unit: 'B-202',
    type: 'Apartment',
    size: '950 sqft',
    bedrooms: 1,
    bathrooms: 1,
    owner: 'Jane Smith',
    status: 'Occupied',
  },
  {
    id: 3,
    unit: 'C-303',
    type: 'Penthouse',
    size: '1800 sqft',
    bedrooms: 3,
    bathrooms: 2,
    owner: 'Robert Johnson',
    status: 'Occupied',
  },
  {
    id: 4,
    unit: 'D-404',
    type: 'Apartment',
    size: '1100 sqft',
    bedrooms: 2,
    bathrooms: 1,
    owner: 'Michael Brown',
    status: 'Vacant',
  },
  {
    id: 5,
    unit: 'A-105',
    type: 'Apartment',
    size: '1300 sqft',
    bedrooms: 2,
    bathrooms: 2,
    owner: 'Emily Wong',
    status: 'Occupied',
  },
];

const Properties: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">
              Manage property units in the society
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>

        {/* Property Types Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Apartments</CardTitle>
              <CardDescription>Standard living units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">42</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Penthouses</CardTitle>
              <CardDescription>Luxury top floor units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">8</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupancy Rate</CardTitle>
              <CardDescription>Currently occupied</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">90%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Listing */}
        <Card>
          <CardHeader>
            <CardTitle>Property Directory</CardTitle>
            <CardDescription>All property units in the society</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="hidden md:table-cell">Bedrooms</TableHead>
                    <TableHead className="hidden md:table-cell">Bathrooms</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.unit}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.size}</TableCell>
                      <TableCell className="hidden md:table-cell">{property.bedrooms}</TableCell>
                      <TableCell className="hidden md:table-cell">{property.bathrooms}</TableCell>
                      <TableCell>{property.owner}</TableCell>
                      <TableCell>
                        <Badge variant={property.status === 'Occupied' ? 'default' : 'outline'}>
                          {property.status}
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

export default Properties;
