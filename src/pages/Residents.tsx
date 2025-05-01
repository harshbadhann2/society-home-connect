
import React from 'react';
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
import { Search, Plus, Phone, Mail } from 'lucide-react';

// Mock data - would come from the database in a real application
const residents = [
  {
    id: 1,
    name: 'John Smith',
    apartment: 'A-101',
    status: 'Owner',
    contact: '+91 98765 43210',
    email: 'john.smith@example.com',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    apartment: 'B-202',
    status: 'Tenant',
    contact: '+91 87654 32109',
    email: 'priya.sharma@example.com',
  },
  {
    id: 3,
    name: 'Rahul Patel',
    apartment: 'A-303',
    status: 'Owner',
    contact: '+91 76543 21098',
    email: 'rahul.patel@example.com',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    apartment: 'C-104',
    status: 'Tenant',
    contact: '+91 65432 10987',
    email: 'sarah.johnson@example.com',
  },
  {
    id: 5,
    name: 'Amit Kumar',
    apartment: 'B-205',
    status: 'Owner',
    contact: '+91 54321 09876',
    email: 'amit.kumar@example.com',
  },
];

const Residents: React.FC = () => {
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
              />
              <Button variant="outline" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
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
                  {residents.map((resident) => (
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

export default Residents;
