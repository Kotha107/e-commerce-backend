export interface ProductDetailsModel {
  name: string;
  price: number;
  categoryId: string;   
  description?: string; 
  imageUrl: string;
  createdAt?: Date;
}