
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { AssetCategory } from "./types";
import { DEPRECIATION_METHODS } from "./constants";

interface CategoryDetailsProps {
  category: AssetCategory;
  pendingChanges: Partial<AssetCategory>;
  onPendingChangesUpdate: (changes: Partial<AssetCategory>) => void;
  onEdit: (category: AssetCategory) => void;
  onSave: () => void;
}

export function CategoryDetails({
  category,
  pendingChanges,
  onPendingChangesUpdate,
  onEdit,
  onSave,
}: CategoryDetailsProps) {
  return (
    <TooltipProvider>
      <Card className="lg:col-span-2 w-full">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <Button variant="outline" onClick={() => onEdit(category)}>
              Edit Category
            </Button>
          </div>

          <Tabs defaultValue="ifrs" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger
                value="ifrs"
                className="w-full py-2 sm:py-3 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-l-md"
              >
                IFRS Depreciation
              </TabsTrigger>
              <TabsTrigger
                value="tax"
                className="w-full py-2 sm:py-3 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-r-md"
              >
                Tax Depreciation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ifrs" className="space-y-4">
              <div className="space-y-4 p-3 sm:p-4 bg-muted/50 rounded-md">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm sm:text-base">IFRS Depreciation Method</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[250px] text-sm">IFRS depreciation method based on expected useful life and economic substance.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CustomSelect
                    options={DEPRECIATION_METHODS}
                    value={(pendingChanges.ifrsMethod || category.ifrsMethod)}
                    onChange={(value) => {
                      onPendingChangesUpdate({ ...pendingChanges, ifrsMethod: value });
                    }}
                    placeholder="Select depreciation method"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm sm:text-base">IFRS Useful Life</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[250px] text-sm">The period over which the asset is expected to be economically useful to the business.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex gap-4 items-center mt-2">
                    <Input 
                      type="number" 
                      value={(pendingChanges.ifrsYears !== undefined ? pendingChanges.ifrsYears : category.ifrsYears) || ""} 
                      onChange={(e) => {
                        onPendingChangesUpdate({ 
                          ...pendingChanges, 
                          ifrsYears: parseInt(e.target.value) 
                        });
                      }}
                      className="w-20"
                    />
                    <span className="text-muted-foreground">years</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tax" className="space-y-4">
              <div className="space-y-4 p-3 sm:p-4 bg-muted/50 rounded-md">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm sm:text-base">Tax Depreciation Method</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[250px] text-sm">Tax depreciation method as per local tax regulations. Can differ from IFRS even when using the same method.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CustomSelect
                    options={DEPRECIATION_METHODS}
                    value={(pendingChanges.taxMethod || category.taxMethod)}
                    onChange={(value) => {
                      onPendingChangesUpdate({ ...pendingChanges, taxMethod: value });
                    }}
                    placeholder="Select depreciation method"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm sm:text-base">Tax Useful Life</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[250px] text-sm">The depreciation period allowed by tax authorities, which may differ from IFRS useful life.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex gap-4 items-center mt-2">
                    <Input 
                      type="number" 
                      value={(pendingChanges.taxYears !== undefined ? pendingChanges.taxYears : category.taxYears) || ""} 
                      onChange={(e) => {
                        onPendingChangesUpdate({ 
                          ...pendingChanges, 
                          taxYears: parseInt(e.target.value) 
                        });
                      }}
                      className="w-20"
                    />
                    <span className="text-muted-foreground">years</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {Object.keys(pendingChanges).length > 0 && (
            <div className="flex justify-end">
              <Button onClick={onSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}
