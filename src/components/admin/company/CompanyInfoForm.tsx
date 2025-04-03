
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { companyService } from "@/services/company";
import { useAsyncError } from "react-router-dom";


interface CompanyDetails{
  address: string;
  created_at: string;
  email: string;
  id: string;
  legal_name: string;
  name: string;
  phone: string;
  tax_id: string;
  website: string;
}


const formSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  legal_name: z.string().min(2, "Legal name must be at least 2 characters"),
  tax_id: z.string().min(2, "Tax ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export function CompanyInfoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyDetails | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: companyData || {
      name: "",
      legal_name: "",
      tax_id: "",
      email: "",
      phone: "",
      website: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>, e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values:", values);
      await companyService.putCompany(values);
      // TODO: Implement API call to save company information
      toast.success("Company information updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update company information");
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try{
        const data = await companyService.getCompany();
        setCompanyData(data);
      } catch (error){
        console.error('Error fetching user details:', error);
      }finally {
        setIsLoading(false);
      }
    }

    fetchCompanyData()
  }, [])
  useEffect(() => {
    if (companyData) {
      form.reset(companyData);
    }
  }, [companyData, form]);
  return (
    <Form {...form}>
      {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"/>
            </svg>
            <span>Loading...</span>
          </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter legal name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax ID" {...field} />
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
                    <Input type="email" placeholder="Enter company email" {...field}/>
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Enter website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter company address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      )}
    </Form>
  );
}
