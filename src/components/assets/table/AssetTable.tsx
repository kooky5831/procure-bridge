
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransferDialog } from "@/components/assets/TransferDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Asset {
  id: number;
  asset_id: string;
  asset_name: string;
  name: string;  
  description?: string;
  category?: string;
  location?: string;
  status: string;
  purchase_price?: string;  
  purchase_date?: string;
  cost?: string;
}

// Helper function for status variant
const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'incomplete':
      return 'destructive';
    default:
      return 'outline';
  }
};

interface AssetTableProps {
  assets: Asset[];
  onViewAsset: (id: string) => void;
  onDispose: (asset: Asset) => void;
  onTransferComplete: () => void;
}

export function AssetTable({ assets, onViewAsset, onDispose, onTransferComplete }: AssetTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset ID</TableHead>
          <TableHead>Name/Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Net Book Value</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No assets found matching your filters
            </TableCell>
          </TableRow>
        ) : (
          assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.asset_id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.description || 'No description'}</p>
                </div>
              </TableCell>
              <TableCell>{asset.category || 'N/A'}</TableCell>
              <TableCell>{asset.location || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(asset.status)}>
                  {asset.status}
                </Badge>
              </TableCell>
              <TableCell>{asset.purchase_price ? `$${asset.purchase_price}` : 'N/A'}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewAsset(asset.id.toString())}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <TransferDialog
                    assetId={asset.id.toString()}
                    assetName={asset.asset_name}
                    currentLocation={asset.location || 'No location'}
                    onTransferComplete={onTransferComplete}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDispose(asset)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
