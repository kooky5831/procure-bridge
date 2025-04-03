
export interface Asset {
  asset_id: string;
  asset_name: string;
  name: string;
  category: string;
  location: number;
  status: string;
  purchase_price: number;
}
export interface AssetLocation {
  id: string;
  name: string;
  code: string;
  type: string;
  country: string;
  city: string;
}
