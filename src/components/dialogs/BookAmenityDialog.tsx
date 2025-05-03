
import React, { useState } from 'react';
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

interface BookAmenityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  amenityId?: number;
}

export function BookAmenityDialog({ open, onOpenChange, onAdd, amenityId }: BookAmenityDialogProps) {
  const [residentId, setResidentId] = useState<number | null>(null);
  const [amenity, setAmenity] = useState<number | null>(amenityId || null);
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: residents } = useQuery({
    queryKey: ["residents"],
    queryFn: async () => {
      const { data, error } = await supabase.from('residents').select('id, name, apartment');
      if (error) {
        console.error('Error fetching residents:', error);
        return [];
      }
      return data;
    }
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const { data, error } = await supabase.from('amenities').select('id, name');
      if (error) {
        console.error('Error fetching amenities:', error);
        return [];
      }
      return data;
    }
  });

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

      const { error } = await supabase
        .from('bookings')
        .insert({
          amenity_id: amenity,
          resident_id: residentId,
          date: bookingDate,
          time_slot: timeSlot,
          purpose,
        });

      if (error) throw error;

      // Update amenity status to 'Booked'
      await supabase
        .from('amenities')
        .update({ status: 'Booked' })
        .eq('id', amenity);

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
            <Select onValueChange={(value) => setResidentId(Number(value))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a resident" />
              </SelectTrigger>
              <SelectContent>
                {residents?.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id.toString()}>
                    {resident.name} ({resident.apartment})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amenity" className="text-right">
              Amenity
            </Label>
            <Select 
              onValueChange={(value) => setAmenity(Number(value))}
              defaultValue={amenityId ? String(amenityId) : undefined}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an amenity" />
              </SelectTrigger>
              <SelectContent>
                {amenities?.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
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
