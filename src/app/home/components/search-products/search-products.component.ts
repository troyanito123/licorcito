import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { categories, Product } from 'src/app/interfaces/interface';
import { ProductService } from 'src/app/services/product.service';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss'],
})
export class SearchProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories = categories;

  searchText = '';
  selectCat = 'all';

  productsSubs: Subscription;

  cantInCart: number;
  cartSubs: Subscription;

  constructor(
    private productService: ProductService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.productsSubs = this.productService
      .getProductForHome()
      .subscribe((res) => (this.products = res));

    this.cartSubs = this.store
      .select('cart')
      .subscribe(({ cant }) => (this.cantInCart = cant));
  }

  ngOnDestroy() {
    this.productsSubs?.unsubscribe();
    this.cartSubs?.unsubscribe();
  }
}
