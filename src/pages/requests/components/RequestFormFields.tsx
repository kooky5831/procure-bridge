
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { assetCategories, costCenters, CreateRequestForm } from "../types";
import { TotalCostDisplay } from "./TotalCostDisplay";
import { itCategories, conditionGrades } from "@/components/assets/create-form/constants";
import { useState } from "react";

interface RequestFormFieldsProps {
  form: UseFormReturn<CreateRequestForm>;
  totalCost: number;
}

export function RequestFormFields({ form, totalCost }: RequestFormFieldsProps) {
  const [showITFields, setShowITFields] = useState(false);

  const handleCategoryChange = (category: typeof assetCategories[number]) => {
    form.setValue("assetCategory", category);
    setShowITFields(category === "IT Equipment");
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Purchase 10 Laptops" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assetCategory"
        rules={{ required: "Asset category is required" }}
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Asset Category</FormLabel>
            <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background z-50">
                {assetCategories.map((category) => (
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

      {showITFields && (
        <div className="space-y-6 border-l-2 border-primary pl-4">
          <FormField
            control={form.control}
            name="itCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IT Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select IT asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itCategories.map((category) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brandModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand/Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HP EliteBook G8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Intel i7-1165G7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 16GB DDR4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 512GB SSD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditionGrades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Space Gray" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="otherSpecs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Specifications</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional specifications (OS, screen size, etc.)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conditionNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific condition requirements..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="quantity"
          rules={{ 
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitCost"
          rules={{ 
            required: "Unit cost is required",
            min: { value: 0, message: "Unit cost cannot be negative" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Cost</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <TotalCostDisplay totalCost={totalCost} />

      <FormField
        control={form.control}
        name="costCenter"
        rules={{ required: "Cost center is required" }}
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Budget/Cost Center</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select cost center" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background z-50">
                {costCenters.map((center) => (
                  <SelectItem key={center} value={center}>
                    {center}
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
        name="justification"
        rules={{ required: "Justification is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Justification</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please provide a detailed justification for this request..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
