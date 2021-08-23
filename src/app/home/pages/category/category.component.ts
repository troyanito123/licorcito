import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/interface';
import { ProductService } from 'src/app/services/product.service';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productsSubs: Subscription;
  category = '';

  cant: number;
  cantSubs: Subscription;

  searchText = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.productsSubs = this.route.params
      .pipe(
        tap(({ category }) => {
          this.category = category;
          this.category = `${this.category[0]}${this.category
            .substring(1)
            .toLowerCase()}`;
        }),
        switchMap(({ category }) =>
          this.productService.getProductsByCategory(category)
        )
      )
      .subscribe((products) => (this.products = products));
    this.cantSubs = this.store
      .select('cart')
      .subscribe(({ cant }) => (this.cant = cant));
  }

  ngOnDestroy() {
    this.productsSubs?.unsubscribe();
    this.cantSubs?.unsubscribe();
  }
}
