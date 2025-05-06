
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

interface FileComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
}

export function FileComplaintDialog({ open, onOpenChange, onAdd }: FileComplaintDialogProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { userRole } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!subject || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First check if the complaint table exists
      const { error: checkError } = await supabase.from('complaint').select('count').limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('Complaint table does not exist, attempting to use feedback mechanism');
        
        // Try to store in notice_board as a fallback
        const { error: noticeError } = await supabase
          .from('notice_board')
          .insert({
            title: `Complaint: ${subject}`,
            message: `Category: ${category}\n\n${description}`,
            posted_by: 'Resident',
            posted_date: new Date().toISOString(),
          });
          
        if (noticeError) {
          console.error('Failed to store complaint in notice_board:', noticeError);
          throw noticeError;
        }
      } else {
        // Table exists, proceed with insert to complaint
        const { error } = await supabase
          .from('complaint')
          .insert({
            subject,
            complaint_text: description,
            complaint_status: 'Pending',
            date_raised: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          });

        if (error) throw error;
      }

      toast({
        title: "Complaint filed",
        description: "Your complaint has been successfully submitted."
      });
      setSubject("");
      setDescription("");
      setCategory("");
      onOpenChange(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error('Error filing complaint:', error);
      toast({
        title: "Error",
        description: "Failed to file complaint. Please try again.",
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
          <DialogTitle>File New Complaint</DialogTitle>
          <DialogDescription>
            Submit a new complaint or maintenance request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Leaking Pipe in Bathroom"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                <SelectItem value="Noise">Noise</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 h-24"
              placeholder="Please describe the issue in detail..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Filing..." : "Submit Complaint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
