
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// In a real application, we would fetch this from the API
const mockNotices = [
  {
    id: 1,
    title: 'Annual General Meeting',
    date: '2025-05-15',
    category: 'Meeting',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Water Supply Interruption',
    date: '2025-05-10',
    category: 'Maintenance',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'New Security Measures',
    date: '2025-05-08',
    category: 'Security',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Community Garden Initiative',
    date: '2025-05-05',
    category: 'Community',
    priority: 'low',
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

const RecentNotices: React.FC = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Notices</CardTitle>
        <CardDescription>Latest announcements for residents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNotices.map((notice) => (
            <div
              key={notice.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="font-medium">{notice.title}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(notice.date).toLocaleDateString()}
                </div>
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
      </CardContent>
    </Card>
  );
};

export default RecentNotices;
