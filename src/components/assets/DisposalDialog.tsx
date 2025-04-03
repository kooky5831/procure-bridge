
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DisposalDatePicker } from "./disposal/DisposalDatePicker";
import { FinancialImpactDisplay } from "./disposal/FinancialImpactDisplay";
import { calculateFinancialImpact } from "./disposal/utils";
import { disposalReasons } from "./disposal/constants";
import type { DisposalDialogProps } from "./disposal/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { assetService } from "@/services/assets";

interface BookValue {
  type: "IFRS" | "TAX";
  value: number;
}

export function DisposalDialog({
  assetId,
  assetName,
  currentValue,
  ifrsValue = currentValue,
  taxValue = currentValue,
  open,
  onOpenChange,
  onDisposalComplete,
}: DisposalDialogProps & {
  ifrsValue?: number;
  taxValue?: number;
}) {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<Date>();
  const [salvageValue, setSalvageValue] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBookValue, setSelectedBookValue] = useState<"IFRS" | "TAX">("IFRS");

  const bookValues: BookValue[] = [
    { type: "IFRS", value: ifrsValue },
    { type: "TAX", value: taxValue },
  ];

  const currentBookValue = selectedBookValue === "IFRS" ? ifrsValue : taxValue;

  const validateForm = () => {
    if (!reason) {
      toast.error("Please select a reason for disposal");
      return false;
    }
    if (!date) {
      toast.error("Please select a disposal date");
      return false;
    }
    if (salvageValue && isNaN(parseFloat(salvageValue))) {
      toast.error("Please enter a valid salvage value");
      return false;
    }
    if (parseFloat(salvageValue) < 0) {
      toast.error("Salvage value cannot be negative");
      return false;
    }
    return true;
  };

  const handleDisposal = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const disposalData = {
        reason,
        disposal_date: date,
        salvage_value: parseFloat(salvageValue) || 0,
        book_value_type: selectedBookValue,
        book_value: currentBookValue,
        financial_impact: calculateFinancialImpact(salvageValue, currentBookValue),
        notes,
      };

      await assetService.disposeAsset(assetId, disposalData);

      toast.success("Asset disposed successfully");
      onOpenChange(false);
      onDisposalComplete?.();
    } catch (error) {
      console.error("Error disposing asset:", error);
      toast.error("Failed to dispose asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason("");
    setDate(undefined);
    setSalvageValue("");
    setNotes("");
    setSelectedBookValue("IFRS");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const impact = calculateFinancialImpact(salvageValue, currentBookValue);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent 
        className="sm:max-w-[425px] overflow-visible"
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby="disposal-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Dispose Asset</DialogTitle>
          <DialogDescription id="disposal-dialog-description">
            Record disposal of {assetName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Book Value Type</Label>
            <RadioGroup
              defaultValue="IFRS"
              value={selectedBookValue}
              onValueChange={(value) => setSelectedBookValue(value as "IFRS" | "TAX")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="IFRS" id="ifrs" />
                <Label htmlFor="ifrs">IFRS (${ifrsValue.toFixed(2)})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TAX" id="tax" />
                <Label htmlFor="tax">Tax (${taxValue.toFixed(2)})</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="current-value">Current Book Value ({selectedBookValue})</Label>
            <Input
              id="current-value"
              value={`$${currentBookValue.toFixed(2)}`}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason" className="required">Reason for Disposal</Label>
            <Select 
              onValueChange={setReason} 
              value={reason}
              required
            >
              <SelectTrigger id="reason" className="bg-background">
                <SelectValue placeholder="Select disposal reason" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={4}
                className="bg-white border rounded-md shadow-md min-w-[200px] p-1"
              >
                {disposalReasons.map((reason) => (
                  <SelectItem 
                    key={reason} 
                    value={reason}
                    className="relative flex cursor-default select-none items-center rounded-sm py-2.5 px-3 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-slate-100"
                  >
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="required">Disposal Date</Label>
            <DisposalDatePicker date={date} onDateChange={setDate} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="salvage-value">Salvage Value</Label>
            <Input
              id="salvage-value"
              type="number"
              placeholder="0.00"
              value={salvageValue}
              onChange={(e) => setSalvageValue(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid gap-2">
            <Label>Financial Impact</Label>
            <FinancialImpactDisplay impact={impact} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDisposal}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Disposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
