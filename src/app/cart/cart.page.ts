import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../state/app.reducer';
import {
  decrementProduct,
  incrementProduct,
  removeProduct,
} from '../state/actions/cart.action';

import { ProductCart } from '../models/product-cart';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  products: ProductCart[] = [];
  total: number;

  cartSubs: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.cartSubs = this.store
      .select('cart')
      .subscribe(({ products, total }) => {
        this.products = products;
        this.total = total;
      });
  }

  ngOnDestroy() {
    this.cartSubs?.unsubscribe();
  }

  removeFromCart(product: ProductCart) {
    this.store.dispatch(removeProduct({ product }));
  }
}
