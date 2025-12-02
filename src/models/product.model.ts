export interface ProductDetails {
  name: string;
  price: number;
  category: string;   
  description?: string; 
  imageUrl: string;
  createdAt?: Date;
}