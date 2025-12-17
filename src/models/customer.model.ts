export interface CustomerModel {
  name: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  totalOrders: number;
  createdAt: Date;
}
