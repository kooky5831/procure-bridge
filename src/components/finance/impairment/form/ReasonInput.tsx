
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ImpairmentFormData } from "../types";

interface ReasonInputProps {
  form: UseFormReturn<ImpairmentFormData>;
}

export function ReasonInput({ form }: ReasonInputProps) {
  return (
    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">Reason for Revaluation</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter reason for the revaluation" className="px-3 py-5 h-auto" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
