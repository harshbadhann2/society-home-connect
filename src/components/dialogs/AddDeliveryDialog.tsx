
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

interface AddDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
}

export function AddDeliveryDialog({ open, onOpenChange, onAdd }: AddDeliveryDialogProps) {
  const [residentId, setResidentId] = useState<number | null>(null);
  const [packageInfo, setPackageInfo] = useState("");
  const [courier, setCourier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Use fallback data if query fails
  const { data: residents = mockResidents } = useQuery({
    queryKey: ["delivery-residents"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('resident')
          .select('resident_id, name, contact_number, apartment_id');
        
        if (error) {
          console.error('Error fetching residents:', error);
          return mockResidents;
        }
        
        return data.map(r => ({
          ...r,
          contact: r.contact_number, // Map for backwards compatibility
          apartment: `A-${r.apartment_id}` // Create apartment string for display
        }));
      } catch (error) {
        console.error('Unexpected error fetching residents:', error);
        return mockResidents;
      }
    }
  });

  const handleSubmit = async () => {
    if (!packageInfo || !courier || !residentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Try to insert into Supabase
      const { error } = await supabase
        .from('delivery_records')
        .insert({
          resident_id: residentId,
          courier_company_name: courier,
          delivery_status: 'Received',
          delivery_date: new Date().toISOString(),
          delivery_address: packageInfo // Using packageInfo as delivery_address
        });

      if (error) {
        console.error('Error adding delivery to database:', error);
        throw error;
      }

      toast({
        title: "Delivery added",
        description: "The delivery has been successfully recorded."
      });
      onOpenChange(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error('Error adding delivery:', error);
      toast({
        title: "Error",
        description: "Failed to add delivery. Please try again.",
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
          <DialogTitle>Record New Delivery</DialogTitle>
          <DialogDescription>
            Add a new package delivery for a resident.
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
                    {resident.name} ({resident.apartment || resident.apartment_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="packageInfo" className="text-right">
              Package Info
            </Label>
            <Input
              id="packageInfo"
              value={packageInfo}
              onChange={(e) => setPackageInfo(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Amazon package, medium size"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courier" className="text-right">
              Courier
            </Label>
            <Input
              id="courier"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="col-span-3"
              placeholder="e.g. FedEx, Amazon"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Delivery"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
