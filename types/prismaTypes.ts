// types/items.ts

export type Size = 
  | "XXS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL";

export interface ItemPhoto {
  id: string;
  url: string;
  itemId: string;
}

export interface ItemVariant {
  id: string;
  size: Size;
  description: string;
  availbility: boolean;
  itemId: string;

  // Optional back relation to access parent
  item?: AbstractItem;
}

export interface AbstractItem {
  id: string;
  name: string;
  price: number;

  // Relations
  ItemVariants?: ItemVariant[];
  ItemPhotos?: ItemPhoto[];
}
