
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockHousekeeping, mockStaff } from '@/types/database';
import { Housekeeping, Staff } from '@/types/database';
import { ClipboardCheck, ClipboardList, Clock } from 'lucide-react';

const HousekeepingPage: React.FC = () => {
  const [housekeepingTasks, setHousekeepingTasks] = useState<Housekeeping[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchHousekeepingTasks = async () => {
      try {
        // Try to fetch from Supabase
        const { data: housekeepingData, error: housekeepingError } = await supabase
          .from('housekeeping')
          .select('*');

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*');

        if (housekeepingError) {
          console.info('Supabase housekeeping error:', housekeepingError);
          console.info('Falling back to mock housekeeping data');
          setHousekeepingTasks(mockHousekeeping);
        } else {
          setHousekeepingTasks(housekeepingData || mockHousekeeping);
        }

        if (staffError) {
          console.info('Supabase staff error:', staffError);
          console.info('Falling back to mock staff data');
          setStaffList(mockStaff);
        } else {
          setStaffList(staffData || mockStaff);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setHousekeepingTasks(mockHousekeeping);
        setStaffList(mockStaff);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "Could not fetch housekeeping data. Using mock data instead.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHousekeepingTasks();
  }, [toast]);

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const getStaffName = (staffId: number) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.name : 'Unassigned';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase() || '') {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = housekeepingTasks.filter(task => {
    const area = task.area?.toLowerCase() || '';
    const description = task.task_description?.toLowerCase() || '';
    const searchLower = searchTerm?.toLowerCase() || '';
    const status = task.status?.toLowerCase() || '';
    const filterLower = filterStatus?.toLowerCase() || 'all';
    
    const matchesSearch = area.includes(searchLower) || description.includes(searchLower);
    const matchesFilter = filterLower === 'all' || status === filterLower;
    
    return matchesSearch && matchesFilter;
  });

  const completedTasks = housekeepingTasks.filter(task => (task.status?.toLowerCase() || '') === 'completed').length;
  const inProgressTasks = housekeepingTasks.filter(task => (task.status?.toLowerCase() || '') === 'in progress').length;
  const overdueTasks = housekeepingTasks.filter(task => (task.status?.toLowerCase() || '') === 'overdue').length;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Housekeeping Tasks</h1>
            <p className="text-muted-foreground">Manage and track housekeeping tasks for Nirvaan Heights</p>
          </div>
          <Button className="mt-4 md:mt-0">
            Add New Task
          </Button>
        </div>

        {/* Task Statistics */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Tasks</CardTitle>
              <CardDescription>Tasks finished</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardCheck className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{completedTasks}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Currently being handled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardList className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{inProgressTasks}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overdue</CardTitle>
              <CardDescription>Needs attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{overdueTasks}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Tasks</CardTitle>
            <CardDescription>
              Search and filter housekeeping tasks based on various criteria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by area or task description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[200px]">
                <Label htmlFor="status-filter">Status Filter</Label>
                <Select value={filterStatus} onValueChange={handleFilterChange}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center p-8">
            <p>Loading housekeeping tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No housekeeping tasks found.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Task Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Completed</TableHead>
                    <TableHead>Next Scheduled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.area || 'Unknown Area'}</TableCell>
                      <TableCell>{task.task_description || 'No description'}</TableCell>
                      <TableCell>{getStaffName(task.assigned_staff)}</TableCell>
                      <TableCell>{task.frequency || 'Not specified'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(task.status || '')}>
                          {task.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.last_completed || 'Never'}</TableCell>
                      <TableCell>{task.next_scheduled || 'Not scheduled'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default HousekeepingPage;
