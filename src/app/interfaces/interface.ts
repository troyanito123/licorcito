export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  stock: number;
  unit: string;
  category: string;
  available: boolean;
  offer: boolean;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductInCart extends Product {
  cant: number;
  subTotal: number;
}

export interface Image {
  id: string;
  url: string;
}

export const categories = [
  'CERVEZA',
  'EXTRAS',
  'RON',
  'SNACKS',
  'TEQUILA',
  'VINO',
  'VODKA',
  'WHISKEY',
  'REFRESCOS',
];

export const units = ['UNIDAD', 'CAJA', 'LIBRA'];
