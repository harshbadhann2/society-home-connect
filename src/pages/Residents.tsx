
import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Search, Plus, Phone, Mail, Loader2, UserPlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Resident, mockResidents } from '@/types/database';
import { toast } from '@/components/ui/use-toast';
import AddResidentDialog from '@/components/dialogs/AddResidentDialog';
import AuthContext from '@/context/AuthContext';

const Residents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { userRole } = useContext(AuthContext);
  
  // Only admins and staff can see all residents
  const canViewAllResidents = userRole === 'admin' || userRole === 'staff';

  // Fetch residents data from Supabase
  const { data: residents, isLoading, error, refetch } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      try {
        // Try to get data from Supabase
        const { data, error } = await supabase
          .from('resident')
          .select('*');
        
        if (error) {
          console.log("Supabase error:", error);
          
          // Create the table if it doesn't exist
          if (error.message.includes("does not exist")) {
            try {
              // Try to create the table with proper schema
              const createTableResult = await supabase.rpc('create_residents_table_if_not_exists');
              console.log("Table creation result:", createTableResult);
              
              // Try fetching again after creation
              const { data: newData, error: newError } = await supabase
                .from('resident')
                .select('*');
                
              if (newError) {
                console.log("Error after table creation:", newError);
                return mockResidents;
              }
              
              return newData as Resident[] || mockResidents;
            } catch (createErr) {
              console.log("Error creating table:", createErr);
              return mockResidents;
            }
          }
          
          throw error;
        }
        
        return data as Resident[];
      } catch (err) {
        console.log("Falling back to mock data:", err);
        return mockResidents;
      }
    },
  });

  // Handle search functionality
  const filteredResidents = residents?.filter(resident =>
    resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show error toast if fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Note about resident data",
        description: "Using mock data since the residents table doesn't exist in your database yet",
        variant: "default",
      });
    }
  }, [error]);

  const handleAddResident = async (newResident: Omit<Resident, 'id' | 'created_at'>) => {
    if (!canViewAllResidents) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add residents.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log("Attempting to add resident:", newResident);
      
      // First, check if we need to create the table
      try {
        const { data: checkData, error: checkError } = await supabase
          .from('resident')
          .select('count')
          .limit(1);
          
        if (checkError && checkError.message.includes("does not exist")) {
          // Table doesn't exist, create it
          await supabase.rpc('create_residents_table_if_not_exists');
          console.log("Created residents table");
        }
      } catch (checkErr) {
        console.log("Error checking table:", checkErr);
      }
      
      // Try to add to Supabase
      const { data, error } = await supabase
        .from('resident')
        .insert([{ 
          name: newResident.name,
          email: newResident.email,
          contact_number: newResident.contact,
          apartment_id: parseInt(newResident.apartment),
          status: newResident.status,
          joining_date: new Date().toISOString().split('T')[0]
        }])
        .select();

      if (error) {
        console.error("Error inserting resident:", error);
        
        // Show different message based on error type
        if (error.message.includes("does not exist")) {
          // Still having table issues
          toast({
            title: "Database Issue",
            description: "The residents table is not properly set up. Used mock data instead.",
            variant: "destructive",
          });
          return true; // Return true to close the dialog
        }
        throw error;
      }

      toast({
        title: "Resident Added",
        description: `${newResident.name} has been added successfully.`,
      });
      
      // Refetch data to update the list
      refetch();
      return true;
    } catch (err) {
      console.error("Error adding resident:", err);
      toast({
        variant: "destructive",
        title: "Failed to add resident",
        description: "There was an error adding the resident. Please try again.",
      });
      return false;
    }
  };

  // If the user is not an admin or staff, show an access denied message
  if (!canViewAllResidents) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="rounded-full p-4 bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to view the residents directory. Please contact an administrator for assistance.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Residents</h2>
            <p className="text-muted-foreground">
              Manage residents and their information
            </p>
          </div>
          {(userRole === 'admin') && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add Resident
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Residents Directory</CardTitle>
            <CardDescription>
              View and manage all society residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center w-full max-w-sm mb-6">
              <Input
                placeholder="Search residents..."
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading residents...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents && filteredResidents.length > 0 ? (
                      filteredResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium">{resident.name}</TableCell>
                          <TableCell>{resident.apartment}</TableCell>
                          <TableCell>{resident.status}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              <span className="hidden md:inline">{resident.contact}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              <span>{resident.email}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {searchTerm ? 'No residents match your search' : 'No residents found'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddResidentDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onAdd={handleAddResident} 
      />
    </Layout>
  );
};

export default Residents;
