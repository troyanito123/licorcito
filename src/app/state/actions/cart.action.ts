import { createAction, props } from '@ngrx/store';
import { ProductCart } from 'src/app/models/product-cart';

export const addProduct = createAction(
  '[CART] add product to cart',
  props<{ product: ProductCart }>()
);

export const removeProduct = createAction(
  '[CART] remove product from cart',
  props<{ product: ProductCart }>()
);

export const incrementProduct = createAction(
  '[CART] increment product in cart',
  props<{ product: ProductCart }>()
);

export const decrementProduct = createAction(
  '[CART] decrement product in cart',
  props<{ product: ProductCart }>()
);

export const cleanCart = createAction('[CART] clean cart');
