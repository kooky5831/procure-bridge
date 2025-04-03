
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Vendor } from "@/types/vendor";

interface VendorDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
}

export function VendorDetailDialog({
  open,
  onOpenChange,
  vendor,
}: VendorDetailDialogProps) {
  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Vendor ID</h3>
              <p className="text-sm text-muted-foreground">{vendor.id}</p>
            </div>
            <div>
              <h3 className="font-medium">Name</h3>
              <p className="text-sm text-muted-foreground">{vendor.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{vendor.email}</p>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-sm text-muted-foreground">{vendor.phone}</p>
            </div>
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-sm text-muted-foreground">{vendor.address}</p>
            </div>
            <div>
              <h3 className="font-medium">Service Categories</h3>
              <p className="text-sm text-muted-foreground">{vendor.service_categories}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {vendor.status}
              </span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
