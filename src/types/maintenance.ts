
export type MaintenanceStatus = "Scheduled" | "In Progress" | "Completed";
export type MaintenanceType = "Internal" | "External";

export interface MaintenanceTask {
  id: string;
  assetId: string;
  assetName: string;
  scheduledDate: string;
  location: string;
  cost: number;
  status: MaintenanceStatus;
  maintenanceType: MaintenanceType;
  description?: string;
  vendor?: string;
  invoiceUrl?: string;
  task_id: string;
  completedDate?: string;
  completedBy?: string;
  notes?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
}
export interface Maintenance {
  id?: string;
  task_id?: string;
  maintenance_type: 'internal_maintenance' | 'external_maintenance';
  description: string;
  scheduled_date: string;
  cost: string;
  asset: number;
  company: number;
  asset_name?: string;
  vendor_name?: string;
  vendor?: number;
  status: 'incomplete' | 'in_progress' | 'completed';
}
