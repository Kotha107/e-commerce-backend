export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SaleModel {
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: "cash" | "card" | "bkash";
  createdAt: Date;
}
