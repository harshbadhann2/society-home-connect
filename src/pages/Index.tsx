
import React from 'react';
import Layout from '@/components/layout/layout';
import StatCard from '@/components/dashboard/stat-card';
import RecentNotices from '@/components/dashboard/recent-notices';
import UpcomingEvents from '@/components/dashboard/upcoming-events';
import ComplaintStatus from '@/components/dashboard/complaint-status';
import { Users, Building, FileText, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to BlueSky Society management system.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Residents"
            value="124"
            description="+4 since last month"
            icon={Users}
          />
          <StatCard
            title="Properties"
            value="48"
            description="8 currently vacant"
            icon={Building}
          />
          <StatCard
            title="Active Notices"
            value="7"
            description="2 require action"
            icon={FileText}
          />
          <StatCard
            title="Open Complaints"
            value="6"
            description="4 in progress"
            icon={MessageSquare}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <RecentNotices />
          <div className="col-span-1">
            <div className="grid gap-4">
              <ComplaintStatus />
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
