
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Resident } from '@/types/database';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface AddResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (resident: Omit<Resident, 'id' | 'created_at'>) => Promise<boolean>;
}

const AddResidentDialog = ({ open, onOpenChange, onAdd }: AddResidentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    apartment: '',
    status: 'Owner',
    contact: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name || !formData.apartment || !formData.email || !formData.contact) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Submitting resident data:", formData);
      const success = await onAdd(formData);
      if (success) {
        // Reset form and close dialog
        setFormData({
          name: '',
          apartment: '',
          status: 'Owner',
          contact: '',
          email: '',
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem adding the resident. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Resident</DialogTitle>
          <DialogDescription>
            Enter the details of the new resident below.
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
              <Label htmlFor="apartment">Apartment</Label>
              <Input 
                id="apartment" 
                name="apartment" 
                placeholder="A101" 
                value={formData.apartment} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Tenant">Tenant</SelectItem>
                  <SelectItem value="Family Member">Family Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Phone Number</Label>
              <Input 
                id="contact" 
                name="contact" 
                placeholder="9876543210" 
                value={formData.contact} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2 col-span-2">
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
              {isSubmitting ? 'Adding...' : 'Add Resident'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResidentDialog;
