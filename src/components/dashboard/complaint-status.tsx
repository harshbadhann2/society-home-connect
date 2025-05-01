
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Mock data - would come from the database in a real application
const complaintsData = {
  total: 14,
  resolved: 8,
  inProgress: 4,
  pending: 2,
};

const ComplaintStatus: React.FC = () => {
  const resolvedPercentage = (complaintsData.resolved / complaintsData.total) * 100;
  const inProgressPercentage = (complaintsData.inProgress / complaintsData.total) * 100;
  const pendingPercentage = (complaintsData.pending / complaintsData.total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Status</CardTitle>
        <CardDescription>Current status of resident complaints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Resolved</div>
            <div className="text-sm text-muted-foreground">{complaintsData.resolved} ({resolvedPercentage.toFixed(0)}%)</div>
          </div>
          <Progress value={resolvedPercentage} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">In Progress</div>
            <div className="text-sm text-muted-foreground">{complaintsData.inProgress} ({inProgressPercentage.toFixed(0)}%)</div>
          </div>
          <Progress value={inProgressPercentage} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Pending</div>
            <div className="text-sm text-muted-foreground">{complaintsData.pending} ({pendingPercentage.toFixed(0)}%)</div>
          </div>
          <Progress value={pendingPercentage} className="h-2 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintStatus;
