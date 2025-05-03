
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
import { toast } from '@/components/ui/use-toast';

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (staff: Omit<Staff, 'id' | 'created_at'>) => Promise<boolean>;
}

const AddStaffDialog = ({ open, onOpenChange, onAdd }: AddStaffDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: 'Security',
    contact: '',
    email: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onAdd(formData);
      if (success) {
        // Reset form and close dialog
        setFormData({
          name: '',
          position: 'Security',
          contact: '',
          email: '',
          joining_date: new Date().toISOString().split('T')[0],
          status: 'Active',
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add staff member. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new staff member below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="John Doe" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select 
                value={formData.position} 
                onValueChange={(value) => handleSelectChange('position', value)}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Cleaner">Cleaner</SelectItem>
                  <SelectItem value="Gardener">Gardener</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input 
                id="contact" 
                name="contact" 
                placeholder="9876543210" 
                value={formData.contact} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input 
                id="joining_date" 
                name="joining_date" 
                type="date" 
                value={formData.joining_date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
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
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
