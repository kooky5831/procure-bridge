
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Package, PackageCheck, Plus, Search, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Request } from "@/components/dashboard/types";

interface GRNItem {
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  asset_category: string;
  condition_notes: string;
  request_id?: string;
  location?: string;
}

interface LinkedRequest {
  id: string;
  title: string;
  asset_category: string;
  quantity: number;
  unit_cost: number;
}

const ASSET_CATEGORIES = [
  { value: "IT_EQUIPMENT", label: "IT Equipment" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "VEHICLES", label: "Vehicles" },
  { value: "OFFICE_EQUIPMENT", label: "Office Equipment" },
  { value: "MACHINERY", label: "Machinery" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "TOOLS", label: "Tools" },
  { value: "SOFTWARE", label: "Software" },
  { value: "NETWORKING", label: "Networking Equipment" },
  { value: "OTHER", label: "Other" },
] as const;

const LOCATIONS = [
  "Main Office",
  "Warehouse A",
  "Warehouse B",
  "Branch Office 1",
  "Branch Office 2",
  "IT Department",
  "Finance Department",
  "Operations"
];

export default function GRNCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingRequests, setMatchingRequests] = useState<LinkedRequest[]>([]);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [items, setItems] = useState<GRNItem[]>([{
    item_name: "",
    description: "",
    quantity: 1,
    unit_price: 0,
    asset_category: "",
    condition_notes: "",
    location: ""
  }]);
  const [supplierName, setSupplierName] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const searchRequests = async (searchTerm: string) => {
    if (!searchTerm) {
      setMatchingRequests([]);
      return;
    }

    const { data: requests, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'APPROVED')
      .eq('grn_status', 'PENDING')
      .ilike('title', `%${searchTerm}%`)
      .limit(5);

    if (error) {
      console.error('Error searching requests:', error);
      return;
    }

    setMatchingRequests(requests || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, {
      item_name: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      asset_category: "",
      condition_notes: "",
      location: ""
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof GRNItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);

    // If updating item name, search for matching requests
    if (field === 'item_name' && typeof value === 'string') {
      searchRequests(value);
    }
  };

  const linkRequest = (index: number, request: LinkedRequest) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      item_name: request.title,
      asset_category: request.asset_category,
      quantity: request.quantity,
      unit_price: request.unit_cost,
      request_id: request.id
    };
    setItems(newItems);
    setSearchTerm("");
    setMatchingRequests([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: grn, error: grnError } = await supabase
        .from('goods_receipt_notes')
        .insert({
          supplier_name: supplierName,
          received_date: receivedDate,
          notes,
          status: 'DRAFT',
          workflow_step: 1,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (grnError) throw grnError;

      const { error: itemsError } = await supabase
        .from('grn_items')
        .insert(
          items.map(item => ({
            grn_id: grn.id,
            ...item,
            total_price: item.quantity * item.unit_price
          }))
        );

      if (itemsError) throw itemsError;

      // Update request status if items are linked to requests
      for (const item of items) {
        if (item.request_id) {
          const { error: requestError } = await supabase
            .from('requests')
            .update({ grn_status: 'RECEIVED' })
            .eq('id', item.request_id);

          if (requestError) throw requestError;
        }
      }

      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const filePath = `${grn.id}/${crypto.randomUUID()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('grn-attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
        }
      }

      toast({
        title: "Success",
        description: "GRN created successfully",
      });

      navigate(`/grn/${grn.id}`);
    } catch (error) {
      console.error('Error creating GRN:', error);
      toast({
        title: "Error",
        description: "Failed to create GRN. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open onOpenChange={() => navigate('/grn')} modal>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-3xl overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Record Goods Receipt
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Delivery Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5" />
              Delivery Information
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter supplier name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNote">Delivery Note #</Label>
                <Input
                  id="deliveryNote"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Enter delivery note number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedDate">Received Date</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this delivery"
                rows={3}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5" />
                Received Items
              </h2>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium flex items-center gap-2">
                      Item {index + 1}
                      {item.request_id && (
                        <Badge variant="outline" className="ml-2">
                          Linked to Request
                        </Badge>
                      )}
                    </h3>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                      <div className="relative">
                        <Input
                          id={`item-name-${index}`}
                          value={item.item_name}
                          onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                          placeholder="Enter item name or search requests"
                          required
                        />
                        {matchingRequests.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                            <Command>
                              <CommandList>
                                <CommandGroup heading="Matching Requests">
                                  {matchingRequests.map((request) => (
                                    <CommandItem
                                      key={request.id}
                                      onSelect={() => linkRequest(index, request)}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <div>{request.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {request.quantity} items at ${request.unit_cost} each
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`asset-category-${index}`}>Asset Category</Label>
                      <Select
                        value={item.asset_category}
                        onValueChange={(value) => updateItem(index, 'asset_category', value)}
                      >
                        <SelectTrigger id={`asset-category-${index}`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSET_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unit-price-${index}`}>Unit Price</Label>
                      <Input
                        id={`unit-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`location-${index}`}>Location</Label>
                      <Select
                        value={item.location}
                        onValueChange={(value) => updateItem(index, 'location', value)}
                      >
                        <SelectTrigger id={`location-${index}`}>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Enter item description"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor={`condition-${index}`}>Condition Notes</Label>
                      <Textarea
                        id={`condition-${index}`}
                        value={item.condition_notes}
                        onChange={(e) => updateItem(index, 'condition_notes', e.target.value)}
                        placeholder="Enter condition notes if any"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FileUp className="h-5 w-5" />
              Supporting Documents
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 sticky bottom-0 py-4 bg-background border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/grn')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create GRN"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
