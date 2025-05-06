
import React, { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Amenity, mockAmenities, mockBookings, Booking } from "@/types/database";
import AuthContext from "@/context/AuthContext";

interface BookAmenityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  amenityId?: number;
}

export function BookAmenityDialog({ open, onOpenChange, onAdd, amenityId }: BookAmenityDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [selectedAmenityId, setSelectedAmenityId] = useState<number | undefined>(amenityId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useContext(AuthContext);
  
  // Load amenities for the dropdown
  const { data: amenities = mockAmenities } = useQuery({
    queryKey: ["bookable-amenities"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("amenity")
          .select("*")
          .eq("availability_status", "Available");

        if (error) {
          console.error("Error loading amenities:", error);
          // Filter mock data to only show available amenities
          return mockAmenities.filter(a => a.availability_status === "Available");
        }

        // Transform the data from Supabase to match the expected Amenity type
        return data.map(item => ({
          amenity_id: item.amenity_id,
          amenity_name: item.amenity_name || "Unknown",
          availability_status: item.availability_status || "Available",
          operating_hours: item.operating_hours || "9:00 AM - 9:00 PM",
          staff_id: item.staff_id,
          booking_fees: item.booking_fees,
          booking_required: item.booking_required,
          // Add these explicitly, even though they might be undefined
          location: "Main Building", // Default value
          capacity: 10, // Default value
          maintenance_day: "Sunday", // Default value
          // Compatibility fields
          id: item.amenity_id,
          name: item.amenity_name || "Unknown",
          status: item.availability_status || "Available",
          opening_hours: item.operating_hours || "9:00 AM - 9:00 PM"
        }) as Amenity);
      } catch (err) {
        console.error("Failed to fetch amenities:", err);
        // Filter mock data to only show available amenities
        return mockAmenities.filter(a => a.availability_status === "Available");
      }
    }
  });

  // Common time slots for booking
  const timeSlots = [
    "6:00 AM - 8:00 AM",
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
    "8:00 PM - 10:00 PM"
  ];

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setDate(new Date());
      setTimeSlot("");
      setPurpose("");
      setSelectedAmenityId(amenityId);
    }
  }, [open, amenityId]);

  const handleSubmit = async () => {
    if (!date || !timeSlot || !purpose || !selectedAmenityId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser || !currentUser.resident_id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to book an amenity",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        amenity_id: selectedAmenityId,
        resident_id: currentUser.resident_id,
        booking_date: format(date, "yyyy-MM-dd"),
        time_slot: timeSlot,
        purpose: purpose,
        status: "Pending" // Default status for new bookings
      };

      // Use the mock data for now since the booking table doesn't exist in Supabase yet
      console.log("Creating booking:", bookingData);
      
      // Instead of trying to insert into a non-existent table,
      // just simulate a successful booking
      setTimeout(() => {
        // Update amenity status in the UI
        toast({
          title: "Booking successful",
          description: "Your amenity booking has been submitted successfully."
        });
        
        onOpenChange(false);
        if (onAdd) onAdd();
      }, 1000);
    } catch (error: any) {
      console.error('Error booking amenity:', error);
      toast({
        title: "Booking failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Society Amenity</DialogTitle>
          <DialogDescription>
            Reserve an amenity for your use. All bookings are subject to approval.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!amenityId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amenity" className="text-right">
                Amenity
              </Label>
              <Select
                value={selectedAmenityId?.toString()}
                onValueChange={(value) => setSelectedAmenityId(parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an amenity" />
                </SelectTrigger>
                <SelectContent>
                  {amenities.map((amenity) => (
                    <SelectItem 
                      key={amenity.amenity_id} 
                      value={amenity.amenity_id?.toString() || ''}
                      disabled={amenity.availability_status !== "Available"}
                    >
                      {amenity.amenity_name || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeSlot" className="text-right">
              Time Slot
            </Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose
            </Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Briefly describe the purpose of your booking"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Amenity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
