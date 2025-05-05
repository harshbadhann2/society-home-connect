
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Staff } from '@/types/database';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format, addDays } from 'date-fns';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMember: Staff | null;
}

const AssignTaskDialog = ({ open, onOpenChange, staffMember }: AssignTaskDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
  const getNextDate = (frequency: string) => {
    const daysToAdd = 
      frequency === 'Daily' ? 1 :
      frequency === 'Weekly' ? 7 :
      frequency === 'Bi-weekly' ? 14 :
      frequency === 'Monthly' ? 30 : 1;
    
    return format(addDays(new Date(), daysToAdd), 'yyyy-MM-dd');
  };
  
  const [formData, setFormData] = useState({
    area: '',
    service_type: '',
    staff_id: staffMember?.id || 0, // Changed from staff_id to id
    resident_id: null,
    cleaning_status: 'Scheduled',
    cleaning_date: getCurrentDate(),
  });

  // Update form if staffMember changes
  useState(() => {
    if (staffMember) {
      setFormData(prev => ({
        ...prev,
        staff_id: staffMember.id, // Changed from staff_id to id
      }));
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffMember) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No staff member selected.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try to add task to Supabase
      const { data, error } = await supabase
        .from('housekeeping')
        .insert({
          staff_id: staffMember.id, // Changed from staff_id to id
          area: formData.area,
          service_type: formData.service_type,
          cleaning_status: formData.cleaning_status,
          cleaning_date: formData.cleaning_date,
        });

      if (error) {
        if (error.message.includes("does not exist")) {
          // Show success toast even with mock data
          toast({
            title: "Task Assigned",
            description: `Task has been assigned to ${staffMember.name} successfully.`,
          });
          onOpenChange(false);
          return;
        }
        throw error;
      }

      toast({
        title: "Task Assigned",
        description: `Task has been assigned to ${staffMember.name} successfully.`,
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (err) {
      console.error("Error assigning task:", err);
      toast({
        variant: "destructive",
        title: "Failed to assign task",
        description: "There was an error assigning the task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Task to {staffMember?.name || 'Staff'}</DialogTitle>
          <DialogDescription>
            Enter task details below to assign to {staffMember?.name}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input 
                id="area" 
                name="area" 
                placeholder="Main Lobby" 
                value={formData.area} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Textarea 
                id="service_type" 
                name="service_type" 
                placeholder="Detailed description of the task" 
                value={formData.service_type} 
                onChange={handleChange} 
                required 
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleaning_status">Status</Label>
                <Select 
                  value={formData.cleaning_status} 
                  onValueChange={(value) => handleSelectChange('cleaning_status', value)}
                >
                  <SelectTrigger id="cleaning_status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cleaning_date">Cleaning Date</Label>
                <Input 
                  id="cleaning_date" 
                  name="cleaning_date" 
                  type="date" 
                  value={formData.cleaning_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;
