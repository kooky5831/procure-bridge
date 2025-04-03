
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { AssetLocation } from "@/types/asset";
import { assetService } from "@/services/assets";
import { useToast } from "@/hooks/use-toast";

interface CreateAssetFormProps {
  onSuccess: (data: any) => void;
  categories: string[];
  locations: AssetLocation[];
}

interface FormData {
  name: string;
  category: string;
  locationId: string;
  purchasePrice: string;
  purchaseDate: string;
}

export function CreateAssetForm({ onSuccess, categories = [], locations = [] }: CreateAssetFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      category: "",
      locationId: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });
  const onSubmit = async (data: FormData) => {
    try {
      const categoryMapping = {
        'IT Equipment': 'it_equipment',
        'Office Equipment': 'office_equipment',
        'Manufacturing Equipment': 'manufacturing_equipment',
        'Vehicle': 'vehicle',
        'Furniture': 'furniture'
      };
      
      const selectedLocation = locations.find(loc => Number(loc.id) === Number(data.locationId));
      
      if (!selectedLocation) {
        toast({
          title: "Error",
          description: `Location with ID ${data.locationId} not found`,
          variant: "destructive",
        });
        return;
      }

      const locationId = parseInt(selectedLocation.id, 10);
      
      const formattedData = {
        name: data.name.trim(),
        category: categoryMapping[data.category] || data.category.toLowerCase(),
        purchase_price: data.purchasePrice,
        purchase_date: data.purchaseDate,
        location: locationId,
        status: "in_service",
        company: 1
      };

      onSuccess(formattedData);
      form.reset();
    } catch (error: any) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        requestData: data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Failed to create asset. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Asset name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter asset name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.name} ({location.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchasePrice"
          rules={{ 
            required: "Purchase price is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid price"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Enter purchase price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          rules={{ required: "Purchase date is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Asset</Button>
      </form>
    </Form>
  );
}
