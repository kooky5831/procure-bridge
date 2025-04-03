
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AssetSelect } from "./form/AssetSelect";
import { RevaluationTypeSelect } from "./form/RevaluationTypeSelect";
import { FairValueInput } from "./form/FairValueInput";
import { DatePicker } from "./form/DatePicker";
import { ReasonInput } from "./form/ReasonInput";
import { FileUploadField } from "./form/FileUploadField";
import type { ImpairmentFormData, MockAsset } from "./types";

interface ImpairmentFormProps {
  form: UseFormReturn<ImpairmentFormData>;
  onSubmit: (values: ImpairmentFormData) => Promise<void>;
  assets: MockAsset[];
}

export function ImpairmentForm({ form, onSubmit, assets = [] }: ImpairmentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Revaluation</CardTitle>
        <CardDescription>
          Enter the details of the asset revaluation or impairment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AssetSelect form={form} assets={assets} />
            <RevaluationTypeSelect form={form} />
            <FairValueInput form={form} assets={assets} />
            <DatePicker form={form} />
            <ReasonInput form={form} />
            <FileUploadField form={form} />
            <Button type="submit" className="w-full">Record Revaluation</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
