
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { maintenanceService } from "@/services/maintenance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AssetField } from "./form/AssetField";
import { DescriptionField } from "./form/DescriptionField";
import { DateField } from "./form/DateField";
import { CostField } from "./form/CostField";
import { VendorField } from "./form/VendorField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { MaintenanceFormData } from "./form/types";
import { toast } from "sonner";

interface CreateMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Add this prop
}

export function CreateMaintenanceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateMaintenanceDialogProps) {
  const { toast } = useToast();
  const form = useForm<MaintenanceFormData>({
    defaultValues: {
      assetId: "",
      description: "",
      maintenanceType: "Internal",
      cost: 0,
      vendor: "",
      status: "Scheduled",
      notes: [],
      attachments: [],
      scheduledDate: new Date(),
    },
  });

  const onSubmit = async (data: MaintenanceFormData) => {
    try {

      // Format the date to YYYY-MM-DD format
      const formattedDate = data.scheduledDate.toISOString().split('T')[0];

      const apiData = {
        task_type: data.maintenanceType === "Internal" ? "internal_maintenance" : "external_maintenance",
        maintenance_type: (data.maintenanceType === "Internal" ? "internal_maintenance" : "external_maintenance") as "internal_maintenance" | "external_maintenance",
        description: data.description,
        scheduled_date: formattedDate,
        cost: data.cost.toString(),
        asset: parseInt(data.assetId.replace('AST', '')),
        company: 1,
        status: "incomplete" as "incomplete" | "in_progress" | "completed",
        vendor: data.vendor || undefined,
        assigned_to: 1,
        priority: "medium" as "low" | "medium" | "high",
        completed_at: null,
        task_id: `TSK${Date.now()}`,
        asset_name: ""
      };
      console.log('Sending to API:', apiData);
      const response = await maintenanceService.createMaintenance(apiData);
      console.log('API Response:', response);

      toast({
        title: "Success",
        description: "Maintenance task created successfully"
      });
      onOpenChange(false);
      form.reset();
      onSuccess?.(); // Call the refresh function after successful creation
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create maintenance task",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Create Maintenance Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maintenanceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Maintenance Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Internal" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Internal Maintenance
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="External" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          External Maintenance (Vendor)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <AssetField form={form} />
            <DescriptionField form={form} />
            <DateField form={form} />
            <CostField form={form} />
            <VendorField form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
