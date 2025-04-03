
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";
import { companyService } from "@/services/company";
import { toast } from "sonner";

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reload: boolean
  onReload:(reload: boolean) => void;
}

export function CreateLocationDialog({ open, onOpenChange, onReload, reload }: CreateLocationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (values: unknown) => {
    console.log("i got here")
    setIsLoading(true);
    try{
      await companyService.postLocation(values);
      // TODO: Implement API call to save company information
      toast.success("Location created successfully");
      onReload(true)
    } catch (error) {
      toast.error("Failed to create location");
    }finally {
      setIsLoading(false);
      onReload(true)
    }
    console.log("Creating location:", values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Create a new location or branch for your organization
          </DialogDescription>
        </DialogHeader>
        <LocationForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
