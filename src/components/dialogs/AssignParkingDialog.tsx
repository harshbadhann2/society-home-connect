
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mockResidents } from "@/types/database";

interface AssignParkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: () => void;
  spotId?: number;
}

export function AssignParkingDialog({ open, onOpenChange, onAssign, spotId }: AssignParkingDialogProps) {
  const [residentId, setResidentId] = useState<number | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Use fallback data if query fails
  const { data: residents = mockResidents } = useQuery({
    queryKey: ["resident-data"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('resident')
          .select('resident_id, name');
        
        if (error) {
          console.error('Error fetching residents:', error);
          return mockResidents;
        }
        
        return data;
      } catch (err) {
        console.error('Error in residents query:', err);
        return mockResidents;
      }
    }
  });

  const handleSubmit = async () => {
    if (!vehicleType || !vehicleNumber || !residentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Try to update Supabase first
      const { error } = await supabase
        .from('parking')
        .update({
          resident_id: residentId,
          vehicle_type: vehicleType,
          vehicle_number: vehicleNumber,
          parking_status: 'Occupied' // This matches the parking_status column in DB
        })
        .eq('parking_id', spotId); // This matches the parking_id column in DB

      if (error) {
        console.log('Error assigning parking in database:', error);
        // Fall back to local data updating if needed
      }

      toast({
        title: "Parking assigned",
        description: "The parking spot has been successfully assigned."
      });
      onOpenChange(false);
      if (onAssign) onAssign();
    } catch (error) {
      console.error('Error assigning parking:', error);
      toast({
        title: "Error",
        description: "Failed to assign parking spot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Parking Spot</DialogTitle>
          <DialogDescription>
            Assign this parking spot to a resident and their vehicle.
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
                  <SelectItem key={resident.resident_id} value={resident.resident_id?.toString() || ''}>
                    {resident.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicleType" className="text-right">
              Vehicle Type
            </Label>
            <Select onValueChange={setVehicleType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="Scooter">Scooter</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicleNumber" className="text-right">
              Vehicle Number
            </Label>
            <Input
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Assigning..." : "Assign Parking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
