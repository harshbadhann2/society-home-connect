
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee } from 'lucide-react';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
}

export function RecordPaymentDialog({ open, onOpenChange, onAdd }: RecordPaymentDialogProps) {
  const [residentId, setResidentId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
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

  const handleSubmit = async () => {
    if (!description || !amount || !paymentMethod || !residentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          resident_id: residentId,
          description,
          amount: amountValue,
          currency: 'INR',
          date: new Date().toISOString(),
          payment_method: paymentMethod,
          status: 'Paid',
        });

      if (error) throw error;

      toast({
        title: "Payment recorded",
        description: "The payment has been successfully recorded."
      });
      onOpenChange(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
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
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a new payment from a resident.
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
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Maintenance Fee - May 2025"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <div className="col-span-3 relative">
              <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="e.g. 2500"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method
            </Label>
            <Select onValueChange={setPaymentMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
