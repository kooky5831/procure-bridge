
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GRNTable } from "@/components/grn/GRNTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GRN } from "@/types/grn";

// Dummy data for development
const dummyGRNs: GRN[] = [
  {
    id: "GRN001",
    supplier_name: "Tech Solutions Ltd",
    received_date: "2024-03-15",
    status: "SUBMITTED",
    created_by: "user1",
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
    total_items: 5,
    total_value: 2500.00,
    notes: "Regular IT equipment delivery",
    workflow_step: 2,
    items: []
  },
  {
    id: "GRN002",
    supplier_name: "Office Furniture Co",
    received_date: "2024-03-14",
    status: "AUTHORIZED",
    created_by: "user1",
    created_at: "2024-03-14T09:30:00Z",
    updated_at: "2024-03-14T15:00:00Z",
    total_items: 10,
    total_value: 5000.00,
    notes: "Office chairs and desks",
    workflow_step: 4,
    items: []
  },
  {
    id: "GRN003",
    supplier_name: "Electronics Plus",
    received_date: "2024-03-13",
    status: "CHECKED",
    created_by: "user1",
    created_at: "2024-03-13T14:20:00Z",
    updated_at: "2024-03-13T16:45:00Z",
    total_items: 3,
    total_value: 1800.00,
    notes: "Monitors and accessories",
    workflow_step: 3,
    items: []
  },
  {
    id: "GRN004",
    supplier_name: "Network Systems Inc",
    received_date: "2024-03-12",
    status: "DRAFT",
    created_by: "user1",
    created_at: "2024-03-12T11:15:00Z",
    updated_at: "2024-03-12T11:15:00Z",
    total_items: 8,
    total_value: 3200.00,
    notes: "Network equipment",
    workflow_step: 1,
    items: []
  },
  {
    id: "GRN005",
    supplier_name: "Security Solutions",
    received_date: "2024-03-11",
    status: "REJECTED",
    created_by: "user1",
    created_at: "2024-03-11T09:00:00Z",
    updated_at: "2024-03-11T13:30:00Z",
    total_items: 4,
    total_value: 1200.00,
    notes: "CCTV cameras and accessories",
    workflow_step: 1,
    items: []
  }
];

export default function GRNList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: grns, isLoading } = useQuery({
    queryKey: ['grns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goods_receipt_notes')
        .select(`
          *,
          items:grn_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Return dummy data for now
      return dummyGRNs;
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Goods Receipt Notes</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track received goods
          </p>
        </div>
        <Button onClick={() => navigate("/grn/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create GRN
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <GRNTable
          grns={grns || []}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
