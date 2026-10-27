// types/items.ts

export type Size = 
  | "3-6 mo"
  | "6-12 mo"
  | "2T"
  | "3T"
  | "4T"
  | "Youth S"
  | "Youth M"
  | "Youth L"
  | "Youth XL"
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
  availability: boolean;
  itemId: string;
  stockRemaining: number;

  // Optional back relation to access parent
  item?: AbstractItem;
}

export interface AbstractItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isArchived: boolean;
  pickupAvailable: boolean;

  // Relations
  ItemVariants?: ItemVariant[];
  ItemPhotos?: ItemPhoto[];
}

export enum OrderStatus {
  UNCONFIRMED = "UNCONFIRMED",
  CONFIRMED = "CONFIRMED",
  PAID = "PAID",
  DELIVERED = "DELIVERED",
}

export enum OrderType {
  PICKUP = "PICKUP",
  SHIPPING = "SHIPPING",
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemVariantId: string;
  quantity: number;

  // Relations
  Order?: Order;
  ItemVariants?: ItemVariant;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  orderType: OrderType;
  shippingAddress?: string | null;
  pickupEventID?: string | null;
  trackingNumber?: string | null;
  placedAt: Date | string;
  updatedAt: Date | string;

  // Relations
  OrderItems?: OrderItem[];
}
