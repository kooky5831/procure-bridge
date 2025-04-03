
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { MaintenanceFormData } from "./types";
import { useEffect, useState } from "react";
import { assetService } from "@/services/assets";
import { Asset } from "@/types/asset";

interface AssetFieldProps {
  form: UseFormReturn<MaintenanceFormData>;
}

interface ApiResponse {
  status: boolean;
  data: Asset[];
  message: string;
}

export function AssetField({ form }: AssetFieldProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response: unknown = await assetService.getAllAssets();
        const typedResponse = response as ApiResponse;
        const assetsList = typedResponse.data || [];
        setAssets(assetsList);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <FormField
      control={form.control}
      name="assetId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Asset</FormLabel>
          <Select 
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder={isLoading ? "Loading assets..." : "Select an asset"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Array.isArray(assets) && assets.map((asset) => (
                <SelectItem key={asset.asset_id} value={`AST${asset.asset_id}`}>
                  {asset.asset_name} (AST{asset.asset_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
