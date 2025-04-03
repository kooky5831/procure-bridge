
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Star, FileText, Trash2 } from "lucide-react";
import { vendorService } from "@/services/vendors";
import type { Vendor } from "@/types/vendor";
import { VendorDetailDialog } from "./VendorDetailDialog";
import { CreateVendorDialog } from "./CreateVendorDialog";
import { useToast } from "@/hooks/use-toast";

export function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVendors();
  }, []);

  const handleDeleteVendor = async (id: string) => {
    try {
      const vendorId = id.includes('VEN-') ? id : `VEN-${id}`;
      await vendorService.deleteVendor(vendorId);
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      loadVendors(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };
  
  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendors();
      
      const responseData = Array.isArray(response) ? response : (response as any)?.data || [];
      
      const vendorsArray = responseData.map(vendor => ({
        ...vendor,
        id: vendor.vendor_id.toString(), 
        service_categories: vendor.service_categories || '',
        status: vendor.status?.toLowerCase() === "active" ? "Active" : "Inactive"
      })) || [];
      setVendors(vendorsArray);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = Array.isArray(vendors) ? vendors.filter(vendor =>
    vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.service_categories?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  const handleVendorCreated = () => {
    loadVendors();
    setIsCreateOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 border-t-2 border-r-2 border-primary rounded-full animate-spin mr-2" />
        <span>Loading vendors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">VEN-{vendor.id.replace('VEN-', '')}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                </TableCell>
                <TableCell>{vendor.service_categories}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {vendor.rating || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {vendor.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setIsDetailOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <VendorDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        vendor={selectedVendor}
      />

      <CreateVendorDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onVendorCreated={handleVendorCreated} 
      />
    </div>
  );
}
