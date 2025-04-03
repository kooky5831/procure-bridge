
import { Form } from "@/components/ui/form";
import { RequestFormFields } from "./RequestFormFields";
import { RequestFormActions } from "./RequestFormActions";
import { useCreateRequest } from "../hooks/useCreateRequest";

interface CreateRequestFormProps {
  onComplete: () => void;
}

export function CreateRequestForm({ onComplete }: CreateRequestFormProps) {
  const { form, isSubmitting, totalCost, onSubmit } = useCreateRequest(onComplete);

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <RequestFormFields form={form} totalCost={totalCost} />
          <RequestFormActions onCancel={onComplete} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
