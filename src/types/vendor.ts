
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  service_categories: string; 
  rating?: number;
  serviceHistory?: {
    taskId: string;
    date: string;
    rating: number;
    feedback?: string;
  }[];
  status: "Active" | "Inactive";
}
