
import { z } from "zod";

export const impairmentFormSchema = z.object({
  assetId: z.string().min(1, "Please select an asset"),
  revaluationType: z.enum(["upward", "downward"]),
  fairValue: z.number().min(0, "Fair value must be greater than 0"),
  effectiveDate: z.date(),
  reason: z.string().min(1, "Please provide a reason for revaluation"),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type ImpairmentFormData = z.infer<typeof impairmentFormSchema>;

export interface MockAsset {
  id: string;
  name: string;
  currentValue: number;
}
