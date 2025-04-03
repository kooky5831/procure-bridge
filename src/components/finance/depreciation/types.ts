
export interface AssetCategory {
  id: string;
  name: string;
  ifrsMethod: string;
  ifrsYears: number;
  taxMethod: string;
  taxYears: number;
  ifrsClassification?: IFRSClassification;
  ifrsCategory?: IFRSCategory;
  taxCategory?: TaxCategory;
}

export interface IFRSClassification {
  class: string;
  name: string;
  description: string;
}

export interface IFRSCategory {
  code: string;
  name: string;
  class: string;
  description: string;
}

export interface TaxCategory {
  code: string;
  name: string;
  description: string;
  depreciationRate: number;
  isCustom?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export interface DepreciationAsset {
  assetId: string;
  assetName: string;
  cost: number;
  startDate: string;
  ifrsClass: IFRSClassification;
  ifrsCat: IFRSCategory;
  taxCategory: TaxCategory;
  ifrsMethod: string;
  taxMethod: string;
  ifrsMonthlyDep: number;
  taxMonthlyDep: number;
  ifrsAccumulatedDep: number;
  taxAccumulatedDep: number;
  ifrsNetBookValue: number;
  taxNetBookValue: number;
}
