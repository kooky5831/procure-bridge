
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CreateRequestForm } from "../types";

export function useCreateRequest(onComplete: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CreateRequestForm>({
    defaultValues: {
      title: "",
      assetCategory: "IT Equipment",
      quantity: 1,
      unitCost: 0,
      costCenter: "",
      justification: "",
      // IT Asset specific fields
      itCategory: "",
      brandModel: "",
      processor: "",
      memory: "",
      storage: "",
      color: "",
      otherSpecs: "",
      condition: "",
      conditionNotes: "",
    },
  });

  const { watch } = form;
  const quantity = Number(watch("quantity")) || 0;
  const unitCost = Number(watch("unitCost")) || 0;
  const totalCost = quantity * unitCost;

  const onSubmit = async (data: CreateRequestForm) => {
    console.log('Starting form submission with data:', data);
    if (isSubmitting) {
      console.log('Submission already in progress, returning');
      return;
    }

    // Validate numeric fields
    const validatedQuantity = Number(data.quantity);
    const validatedUnitCost = Number(data.unitCost);

    if (isNaN(validatedQuantity) || validatedQuantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }

    if (isNaN(validatedUnitCost) || validatedUnitCost < 0) {
      toast.error("Please enter a valid unit cost (must be 0 or greater)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Mock request creation
      console.log('Creating request:', {
        ...data,
        quantity: validatedQuantity,
        unitCost: validatedUnitCost,
        status: 'DRAFT'
      });

      toast.success("Request created successfully!");
      onComplete();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    totalCost,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
