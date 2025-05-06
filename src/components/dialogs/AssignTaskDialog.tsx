
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Staff, Housekeeping } from '@/types/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; 
import { useToast } from '@/hooks/use-toast';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMember: Staff | null;
}

const AssignTaskDialog = ({ open, onOpenChange, staffMember }: AssignTaskDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    task_type: 'Regular Cleaning',
    area: 'Common Area',
    description: '',
    frequency: 'Daily',
  });

  // Fetch existing tasks to show in the dialog
  const { data: existingTasks, isLoading: isLoadingTasks, refetch } = useQuery({
    queryKey: ['staff-tasks', staffMember?.staff_id],
    queryFn: async () => {
      if (!staffMember) return [];

      try {
        const { data, error } = await supabase
          .from('housekeeping')
          .select('*')
          .eq('staff_id', staffMember.staff_id)
          .order('cleaning_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching tasks:', error);
          return [];
        }
        
        return data;
      } catch (err) {
        console.error('Error in query:', err);
        return [];
      }
    },
    enabled: !!staffMember,
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
    if (!staffMember) return;
    
    setIsSubmitting(true);
    
    try {
      const housekeepingData = {
        service_type: formData.task_type,
        staff_id: staffMember.staff_id,
        resident_id: 1, // Set a default or fetch from resident selection
        cleaning_date: new Date().toISOString(),
        cleaning_status: 'Assigned',
        area: formData.area,
        task_description: formData.description,
        frequency: formData.frequency,
        last_completed: null,
        next_scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next day
      };

      const { error } = await supabase
        .from('housekeeping')
        .insert(housekeepingData);

      if (error) throw error;
      
      toast({
        title: "Task Assigned",
        description: `Task assigned successfully to ${staffMember.name}`,
      });
      
      refetch();
      
      // Reset form
      setFormData({
        task_type: 'Regular Cleaning',
        area: 'Common Area',
        description: '',
        frequency: 'Daily',
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error assigning task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Task to {staffMember?.name}</DialogTitle>
          <DialogDescription>
            Assign a new task to this staff member.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task_type">Task Type</Label>
                <Select 
                  value={formData.task_type} 
                  onValueChange={(value) => handleSelectChange('task_type', value)}
                >
                  <SelectTrigger id="task_type">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Cleaning">Regular Cleaning</SelectItem>
                    <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select 
                  value={formData.area} 
                  onValueChange={(value) => handleSelectChange('area', value)}
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common Area">Common Area</SelectItem>
                    <SelectItem value="Swimming Pool">Swimming Pool</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                    <SelectItem value="Garden">Garden</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <Input 
                id="description" 
                name="description" 
                placeholder="Describe the task in detail" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => handleSelectChange('frequency', value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {existingTasks && existingTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Tasks</h4>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {existingTasks.map((task: any, index: number) => (
                  <div key={index} className="text-sm py-1 border-b last:border-b-0">
                    <span className="font-medium">{task.service_type}</span>: {task.task_description || 'No description'} 
                    <span className="text-muted-foreground text-xs block">{new Date(task.cleaning_date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !staffMember}>
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;
