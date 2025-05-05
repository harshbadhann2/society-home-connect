
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId?: number | null;
  onTaskAssigned?: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
}

const AssignTaskDialog = ({ open, onOpenChange, staffId, onTaskAssigned }: AssignTaskDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Assigned'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData(prev => ({ 
        ...prev, 
        due_date: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!staffId) {
        throw new Error("No staff member selected");
      }
      
      // Mock API call since we don't have a tasks table yet
      console.log(`Assigning task to staff #${staffId}:`, formData);
      
      // In a real app, you'd insert into a tasks table
      // const { error } = await supabase.from('tasks').insert({
      //   staff_id: staffId,
      //   ...formData,
      //   created_at: new Date().toISOString()
      // });
      
      // if (error) throw error;

      toast({
        title: "Task Assigned",
        description: `The task has been assigned successfully.`,
      });
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        due_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'Assigned'
      });
      
      onOpenChange(false);
      
      if (onTaskAssigned) {
        await onTaskAssigned();
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogDescription>
            Create a new task for staff member #{staffId}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Clean the lobby" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide details about the task"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="due_date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            <Button type="submit" disabled={isSubmitting || !staffId}>
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;
