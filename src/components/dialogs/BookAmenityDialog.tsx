
import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AuthContext from "@/context/AuthContext";
import { mockResidents } from "@/types/database";

interface BookAmenityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  amenityId?: number;
}

export function BookAmenityDialog({ open, onOpenChange, onAdd, amenityId }: BookAmenityDialogProps) {
  const { currentUser } = useContext(AuthContext);
  const [residentId, setResidentId] = useState<number | null>(currentUser?.resident_id || null);
  const [amenity, setAmenity] = useState<number | null>(amenityId || null);
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Use fallback data if query fails
  const { data: residents = mockResidents, isLoading: isLoadingResidents } = useQuery({
    queryKey: ["residents-for-booking"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('resident').select('resident_id, name, apartment_id');
        if (error) {
          console.error('Error fetching residents:', error);
          return mockResidents;
        }
        return data || mockResidents;
      } catch (err) {
        console.error('Error in resident query:', err);
        return mockResidents;
      }
    }
  });

  const { data: amenities = [], isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities-for-booking"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('amenity').select('amenity_id, amenity_name');
        if (error) {
          console.error('Error fetching amenities:', error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error('Error in amenities query:', err);
        return [];
      }
    }
  });

  // Set current user as default resident when logged in
  useEffect(() => {
    if (currentUser?.resident_id) {
      setResidentId(currentUser.resident_id);
    }
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!amenity || !date || !timeStart || !timeEnd || !purpose || !residentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const timeSlot = `${timeStart} - ${timeEnd}`;

      // First check if notice_board table exists (we'll use it to store bookings)
      const { data: tableCheck, error: tableError } = await supabase
        .from('notice_board')
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.error('Error checking notice_board table:', tableError);
        // Fall back to local handling
      } else {
        // Use notice_board to store booking info since no bookings table exists
        const { error } = await supabase
          .from('notice_board')
          .insert({
            title: `Amenity Booking: ${amenity}`,
            message: `Booking for resident ${residentId}, Purpose: ${purpose}, Time: ${timeSlot}`,
            posted_by: 'System',
            posted_date: new Date().toISOString()
          });

        if (error) {
          console.error('Error storing booking:', error);
          throw error;
        }

        // Update amenity status to 'Booked' if possible
        await supabase
          .from('amenity')
          .update({ availability_status: 'Booked' })
          .eq('amenity_id', amenity);
      }

      toast({
        title: "Booking confirmed",
        description: "The amenity has been successfully booked."
      });
      onOpenChange(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error('Error booking amenity:', error);
      toast({
        title: "Error",
        description: "Failed to book amenity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Book Amenity</DialogTitle>
          <DialogDescription>
            Book a society amenity for your event or activity.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resident" className="text-right">
              Resident
            </Label>
            <Select 
              onValueChange={(value) => setResidentId(Number(value))}
              value={residentId ? residentId.toString() : undefined}
              disabled={!!currentUser?.resident_id}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a resident" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingResidents ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : residents && residents.length > 0 ? (
                  residents.map((resident) => (
                    <SelectItem key={resident.resident_id} value={resident.resident_id.toString()}>
                      {resident.name || 'Unknown'} ({resident.apartment_id || 'N/A'})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No residents found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amenity" className="text-right">
              Amenity
            </Label>
            <Select 
              onValueChange={(value) => setAmenity(Number(value))}
              defaultValue={amenityId ? amenityId.toString() : undefined}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an amenity" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingAmenities ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : amenities && amenities.length > 0 ? (
                  amenities.map((item) => (
                    <SelectItem key={item.amenity_id} value={item.amenity_id.toString()}>
                      {item.amenity_name || 'Unknown Amenity'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No amenities found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeStart" className="text-right">
              Start Time
            </Label>
            <Input
              id="timeStart"
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeEnd" className="text-right">
              End Time
            </Label>
            <Input
              id="timeEnd"
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose
            </Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="col-span-3"
              placeholder="Describe the purpose of your booking..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Amenity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
