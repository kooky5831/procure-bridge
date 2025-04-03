
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { impairmentFormSchema, type ImpairmentFormData, type MockAsset } from "@/components/finance/impairment/types";
import { ImpairmentForm } from "@/components/finance/impairment/ImpairmentForm";
import { ImpairmentHeader } from "@/components/finance/impairment/ImpairmentHeader";
import { ImpairmentNotes } from "@/components/finance/impairment/ImpairmentNotes";

export default function ImpairmentRevaluation() {
  // Mock assets for demonstration
  const [assets] = useState<MockAsset[]>([
    { id: "1", name: "Dell Laptop XPS 15", currentValue: 1200 },
    { id: "2", name: "Office Furniture Set", currentValue: 3000 },
    { id: "3", name: "Company Vehicle - Toyota", currentValue: 25000 },
  ]);

  const form = useForm<ImpairmentFormData>({
    resolver: zodResolver(impairmentFormSchema),
    defaultValues: {
      assetId: "",
      revaluationType: "upward",
      fairValue: 0,
      effectiveDate: new Date(),
      reason: "",
      attachments: [],
    },
  });

  const handleSubmit = async (values: ImpairmentFormData) => {
    console.log("Form submitted:", values);
    // Here we would typically send the data to the backend
  };

  return (
    <div className="space-y-6">
      <ImpairmentHeader />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Revaluation</CardTitle>
              <CardDescription>
                Enter the details of the asset revaluation or impairment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImpairmentForm 
                form={form} 
                onSubmit={handleSubmit}
                assets={assets}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ImpairmentNotes />
        </div>
      </div>
    </div>
  );
}
