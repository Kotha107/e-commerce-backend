export interface ProductDetailsModel {
  name: string;
  price: number;
  unit?: string;
  discountPercent?: number;
  categoryId: string;
  description?: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
