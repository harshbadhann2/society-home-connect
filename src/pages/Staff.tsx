
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
import { Staff as StaffType, mockStaff } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Calendar } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'on leave':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'terminated':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('staff').select('*');
        
        if (error) {
          console.info('Supabase error:', error);
          console.info('Using mock staff data');
          return mockStaff;
        }
        
        return data as StaffType[];
      } catch (err) {
        console.error('Error fetching staff:', err);
        return mockStaff;
      }
    }
  });

  const filteredStaff = staff?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStaff = staff?.length || 0;
  const activeStaff = staff?.filter(member => member.status.toLowerCase() === 'active').length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Staff Directory</h2>
            <p className="text-muted-foreground">
              Manage society staff members
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>

        {/* Staff statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Staff</CardTitle>
              <CardDescription>All positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{totalStaff}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Staff</CardTitle>
              <CardDescription>Currently working</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{activeStaff}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Departments</CardTitle>
              <CardDescription>Different staff roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">4</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff listing */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>All society employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="py-8 text-center">Loading staff data...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading staff data</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="hidden md:table-cell">Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Joining Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell className="hidden md:table-cell">{member.contact}</TableCell>
                        <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{member.joining_date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
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
    </Layout>
  );
};

export default Staff;
