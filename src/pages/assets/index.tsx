
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assetService } from "@/services/assets";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { AssetFilters } from "@/components/assets/filters/AssetFilters";
import { AssetTable } from "@/components/assets/table/AssetTable";
import { DisposalDialog } from "@/components/assets/DisposalDialog";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CreateAssetForm } from "@/components/assets/CreateAssetForm";
import { assetStatuses } from "@/components/assets/constants";
import { Asset, AssetLocation } from "@/types/asset";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Location {
  id: number;
  company_name: string;
  name: string;
  code: string;
  type: string;
  location_type: string;
  country: string;
  city: string;
  address: string;
  company: number;
}
  interface ApiResponse {
    status: boolean;
    data: Asset[];
    message: string;
  }

const mockAssets = Array.from({ length: 1000 }, (_, index) => ({
  id: `AST${(index + 1).toString().padStart(4, '0')}`,
  name: `Asset ${index + 1}`,
  category: ['IT Equipment', 'Furniture', 'Vehicle', 'Office Equipment', 'Manufacturing Equipment'][Math.floor(Math.random() * 5)],
  location: {
    id: String(Math.floor(Math.random() * 4) + 1),
    name: ['Addis Ababa HQ', 'Dire Dawa Branch', 'Bahir Dar Office', 'Hawassa Center'][Math.floor(Math.random() * 4)],
    code: ['ADD-001', 'DIR-001', 'BAH-001', 'HAW-001'][Math.floor(Math.random() * 4)],
    type: 'Branch',
    country: 'Ethiopia',
    city: ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Hawassa'][Math.floor(Math.random() * 4)],
  },
  status: ['In Service', 'Under Repair', 'Disposed', 'In Transit'][Math.floor(Math.random() * 4)],
  value: Math.floor(Math.random() * 100000) + 1000,
}));

const locations: AssetLocation[] = [
  {
    id: "1",
    name: "Addis Ababa HQ",
    code: "ADD-001",
    type: "Head Office",
    country: "Ethiopia",
    city: "Addis Ababa"
  },
  {
    id: "2",
    name: "Dire Dawa Branch",
    code: "DIR-001",
    type: "Branch",
    country: "Ethiopia",
    city: "Dire Dawa"
  },
  {
    id: "3",
    name: "Bahir Dar Office",
    code: "BAH-001",
    type: "Branch",
    country: "Ethiopia",
    city: "Bahir Dar"
  },
  {
    id: "4",
    name: "Hawassa Center",
    code: "HAW-001",
    type: "Branch",
    country: "Ethiopia",
    city: "Hawassa"
  }
];

export default function Assets() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Update the state type to use Asset type
  const [selectedAssetForDisposal, setSelectedAssetForDisposal] = useState<Asset | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const categories = ["All", "IT Equipment", "Furniture", "Vehicle", "Office Equipment", "Manufacturing Equipment"];
  const statuses = ["All", ...assetStatuses];
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchAssets();
  }, []);


  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response: unknown = await assetService.getAllAssets();
      const typedResponse = response as ApiResponse;
      console.log('API Response:', typedResponse);
      const assetsArray = typedResponse?.data || [];
      setAssets(assetsArray);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets. Please try again.",
        variant: "destructive",
      });
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAssetList = () => {
    fetchAssets();
  };

  const filteredAssets = (Array.isArray(assets) ? assets : []).filter((asset) => {
    if (!asset) return false;
    
    const matchesSearch = (asset.asset_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                       (asset.asset_id?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus;
    const matchesLocation = selectedLocation === "All" || asset.location?.id === selectedLocation;
    
    const result = matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    return result;
  });
  const totalItems = filteredAssets.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredAssets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const viewAsset = (id: string) => {
    navigate(`/assets/${id}`);
  };

  const createFormCategories = categories.filter(cat => cat !== "All");
  // Add these near the top with other state declarations
  const [companyLocations, setCompanyLocations] = useState<Location[]>([]);
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const companyId = await assetService.getUserCompany();
        if (companyId) {
          const locations = await assetService.getCompanyLocations(companyId);
          const mappedLocations = locations.map(loc => ({
            ...loc,
            type: loc.location_type
          }));
          setCompanyLocations(mappedLocations);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: "Error",
          description: "Failed to load locations. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchLocations();
  }, []);

  // Cache company ID to avoid multiple requests
  const [cachedCompanyId, setCachedCompanyId] = useState<number | null>(null);

  const handleCreateSuccess = async (formData: any) => {
    try {
      if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data');
      }

      const assetData = {
        name: formData.name,
        category: formData.category,
        location: Number(formData.location),
        purchase_price: formData.purchase_price ? Number(formData.purchase_price) : 0,
        purchase_date: formData.purchase_date,
        company: cachedCompanyId || await assetService.getUserCompany(),
        status: formData.status || "in_service"
      };

      await assetService.createAsset(assetData);
      setIsCreateOpen(false);
      refreshAssetList();
    } catch (error: any) {
      console.error('Creation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create asset",
        variant: "destructive",
      });
    }
  };
  // Update this line to use the fetched locations
  const createFormLocations = companyLocations;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Assets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your organization's assets across Ethiopia</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Asset
        </Button>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {["Asset List", "Maintenance", "Vendors"].map((item) => (
            <Link
              key={item}
              to={item === "Asset List" ? "/assets" : 
                  item === "Maintenance" ? "/maintenance" : "/vendors"}
              className={cn(
                "flex items-center py-4 px-1 border-b-2 text-sm font-medium transition-colors hover:border-gray-300 hover:text-gray-700",
                location.pathname === 
                  (item === "Asset List" ? "/assets" : 
                   item === "Maintenance" ? "/maintenance" : "/vendors")
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {item}
              {item === "Maintenance" && <ArrowRight className="ml-1 h-4 w-4" />}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <AssetFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          dateRange={dateRange}
          setDateRange={setDateRange}
          categories={categories}
          statuses={statuses}
          locations={companyLocations.map(loc => ({
            ...loc,
            id: String(loc.id)
          }))}
        />

        <div className="bg-white rounded-lg border overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 border-t-2 border-r-2 border-primary rounded-full animate-spin mr-2" />
              <span>Loading assets...</span>
            </div>
          ) : (
            <AssetTable
              assets={currentItems}
              onViewAsset={viewAsset}
              onDispose={(asset) => {
                if (!asset.category) return;
                setSelectedAssetForDisposal({
                  id: asset.id,
                  asset_id: asset.asset_id,
                  name: asset.name,
                  asset_name: asset.name, 
                  category: asset.category,
                  location: asset.location,
                  status: asset.status,
                  purchase_price: Number(asset.purchase_price) || 0,
                  purchase_date: asset.purchase_date,
                  description: asset.description
                } as unknown as Asset); 
              }}
              onTransferComplete={refreshAssetList}
            />
          )}
        </div>

        <div className="mt-4 flex justify-center sm:justify-end">
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-center gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNum, idx) => (
                pageNum === -1 ? (
                  <PaginationItem key={`ellipsis-${idx}`} className="hidden sm:block">
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                      className="hidden sm:block"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {selectedAssetForDisposal && (
        <DisposalDialog
          assetId={selectedAssetForDisposal.asset_id} // Update to use API property names
          assetName={selectedAssetForDisposal.asset_name}
          currentValue={selectedAssetForDisposal.purchase_price}
          open={!!selectedAssetForDisposal}
          onOpenChange={(open) => !open && setSelectedAssetForDisposal(null)}
          onDisposalComplete={refreshAssetList}
        />
      )}

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Asset</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <CreateAssetForm
              onSuccess={handleCreateSuccess}  // Direct function reference
              categories={createFormCategories}
              locations={companyLocations.map(loc => ({
                id: String(loc.id),
                name: loc.name,
                code: loc.code,
                type: loc.location_type,
                country: loc.country,
                city: loc.city
              }))}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
