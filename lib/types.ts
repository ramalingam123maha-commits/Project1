export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

export interface CartItem {
  product: Product;
  quantity: number;
}
