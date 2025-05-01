
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const UpcomingEvents: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Upcoming events and bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
