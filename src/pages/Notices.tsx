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
import { Plus, FileText, AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateNoticeDialog } from '@/components/dialogs/CreateNoticeDialog';

interface Notice {
  id: number;
  title: string;
  date: string;
  category: string;
  priority: string;
  content: string;
}

// Mock notices data
const mockNotices = [
  {
    id: 1,
    title: 'Annual General Meeting',
    date: '2025-05-15',
    category: 'Meeting',
    priority: 'high',
    content: 'The Annual General Meeting will be held in the community hall at 6:00 PM. All residents are requested to attend.',
  },
  {
    id: 2,
    title: 'Water Supply Interruption',
    date: '2025-05-10',
    category: 'Maintenance',
    priority: 'medium',
    content: 'Water supply will be interrupted from 10:00 AM to 2:00 PM for maintenance work.',
  },
  {
    id: 3,
    title: 'New Security Measures',
    date: '2025-05-08',
    category: 'Security',
    priority: 'high',
    content: 'New security protocols will be implemented starting next week. Please check your email for details.',
  },
  {
    id: 4,
    title: 'Community Garden Initiative',
    date: '2025-05-05',
    category: 'Community',
    priority: 'low',
    content: 'Join us this Saturday for the launch of our community garden project.',
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const Notices: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: notices, isLoading, error, refetch } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('notice_board').select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return mockNotices;
        }
        
        return data.map(item => ({
          notice_id: item.notice_id,
          title: item.title || '',
          message: item.message || '',
          posted_by: item.posted_by || '',
          posted_date: item.posted_date || '',
          priority: item.priority || 'Normal',
          // Compatibility fields
          id: item.notice_id,
        })) as Notice[];
      } catch (err) {
        console.error('Error fetching notices:', err);
        return mockNotices;
      }
    }
  });

  const highPriorityCount = notices?.filter(notice => notice.priority === 'high').length || 0;
  const maintenanceCount = notices?.filter(notice => notice.category === 'Maintenance').length || 0;
  const upcomingCount = notices?.length || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
            <p className="text-muted-foreground">
              View and manage society notices and announcements
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Notice
          </Button>
        </div>

        {/* Notice categories */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Important Notices</CardTitle>
              <CardDescription>High priority announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{highPriorityCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Maintenance Updates</CardTitle>
              <CardDescription>Facility maintenance information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{maintenanceCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming</CardTitle>
              <CardDescription>Notices for next month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">{upcomingCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices listing */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Latest announcements for residents</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading notices...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading notices</div>
            ) : (
              <div className="space-y-4">
                {notices?.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{notice.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(notice.date).toLocaleDateString()}
                      </div>
                      <p className="text-sm mt-2">{notice.content}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 gap-2">
                      <Badge variant="outline">{notice.category}</Badge>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(notice.priority)}
                      >
                        {notice.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateNoticeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAdd={refetch}
      />
    </Layout>
  );
};

export default Notices;
