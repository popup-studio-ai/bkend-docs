export interface CartDto {
  id: string;
  productId: string;
  quantity: number;
  createdBy: string;
  createdAt: string;
}

export interface CartItemWithProduct extends CartDto {
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    isActive: boolean;
  };
}
