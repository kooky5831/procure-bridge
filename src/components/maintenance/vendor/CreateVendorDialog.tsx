
import { useForm } from "react-hook-form";
import { z } from "zod";
import { vendorService } from "@/services/vendors";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Update schema to match API requirements
// Remove company from schema
const vendorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  service_categories: z.string().min(1, "Service categories are required"),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  contact_person: z.string().min(1, "Contact person is required"),
  service_type: z.string().min(1, "Service type is required")
});

type VendorFormData = z.infer<typeof vendorFormSchema>;


interface CreateVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorCreated?: () => void;
}

export function CreateVendorDialog({
  open,
  onOpenChange,
  onVendorCreated,
}: CreateVendorDialogProps) {
  const { toast } = useToast();
  const form = useForm<VendorFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service_categories: "",
      address: "",
      status: "Active" as const,
      contact_person: "",
      service_type: ""
    },
  });

  const onSubmit = async (data: VendorFormData) => {
    try {
      const response = await vendorService.createVendor({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_categories: data.service_categories,
        address: data.address || "",
        status: data.status.toLowerCase() as "active" | "inactive",
        contact_person: data.contact_person,
        service_type: data.service_type,
        company: 1  
      });
      
      console.log('API Response:', response); 
      
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });
      onVendorCreated?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error('API Error:', error.response?.data); // Debug log
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.response?.data?.message || "Failed to create vendor",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Categories</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter service categories"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Vendor</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
