
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ImpairmentFormData } from "../types";

interface DatePickerProps {
  form: UseFormReturn<ImpairmentFormData>;
}

export function DatePicker({ form }: DatePickerProps) {
  return (
    <FormField
      control={form.control}
      name="effectiveDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-base font-semibold">Effective Date</FormLabel>
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal px-3 py-5 h-auto",
                !field.value && "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                const calendarElement = document.getElementById('impairment-calendar');
                if (calendarElement) {
                  calendarElement.style.display = calendarElement.style.display === 'none' ? 'block' : 'none';
                }
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "PPP") : "Pick a date"}
            </Button>
            <div
              id="impairment-calendar"
              className="absolute top-[calc(100%+4px)] left-0 z-[9999] bg-white border rounded-md shadow-lg p-3"
              style={{ display: 'none' }}
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(newDate) => {
                  field.onChange(newDate);
                  const calendarElement = document.getElementById('impairment-calendar');
                  if (calendarElement) {
                    calendarElement.style.display = 'none';
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
