
import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
import StatCard from '@/components/dashboard/stat-card';
import RecentNotices from '@/components/dashboard/recent-notices';
import UpcomingEvents from '@/components/dashboard/upcoming-events';
import ComplaintStatus from '@/components/dashboard/complaint-status';
import { Users, Building, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { userRole, currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalResidents: "124",
    newResidents: "+4",
    totalProperties: "48",
    vacantProperties: "8",
    activeNotices: "7",
    pendingNotices: "2",
    openComplaints: "6",
    inProgressComplaints: "4"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch statistics from Supabase
        const [
          { data: residents, error: residentsError },
          { data: notices, error: noticesError },
          { data: complaints, error: complaintsError }
        ] = await Promise.all([
          supabase.from('resident').select('*'),
          supabase.from('notice_board').select('*'),
          supabase.from('complaint').select('*')
        ]);

        if (!residentsError && residents) {
          setStats(prev => ({
            ...prev,
            totalResidents: residents.length.toString()
          }));
        }

        if (!noticesError && notices) {
          // Count active notices (posted within the last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const activeNotices = notices.filter(notice => {
            const noticeDate = new Date(notice.posted_date || 0);
            return noticeDate > thirtyDaysAgo;
          });

          setStats(prev => ({
            ...prev,
            activeNotices: activeNotices.length.toString(),
            pendingNotices: "0" // You may need to define what makes a notice "pending"
          }));
        }

        if (!complaintsError && complaints) {
          const openComplaints = complaints.filter(complaint => 
            complaint.complaint_status?.toLowerCase() !== 'resolved' && 
            complaint.complaint_status?.toLowerCase() !== 'closed'
          );
          
          const inProgressComplaints = complaints.filter(complaint => 
            complaint.complaint_status?.toLowerCase() === 'in progress'
          );

          setStats(prev => ({
            ...prev,
            openComplaints: openComplaints.length.toString(),
            inProgressComplaints: inProgressComplaints.length.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to BlueSky Society management system{currentUser?.name ? `, ${currentUser.name}` : ''}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Residents"
            value={stats.totalResidents}
            description={`${stats.newResidents} since last month`}
            icon={Users}
          />
          <StatCard
            title="Properties"
            value={stats.totalProperties}
            description={`${stats.vacantProperties} currently vacant`}
            icon={Building}
          />
          <StatCard
            title="Active Notices"
            value={stats.activeNotices}
            description={`${stats.pendingNotices} require action`}
            icon={FileText}
          />
          <StatCard
            title="Open Complaints"
            value={stats.openComplaints}
            description={`${stats.inProgressComplaints} in progress`}
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
