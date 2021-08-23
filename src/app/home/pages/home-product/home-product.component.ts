import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/interface';
import { ProductCart } from 'src/app/models/product-cart';
import { ProductService } from 'src/app/services/product.service';
import { addProduct } from 'src/app/state/actions/cart.action';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-home-product',
  templateUrl: './home-product.component.html',
  styleUrls: ['./home-product.component.scss'],
})
export class HomeProductComponent implements OnInit, OnDestroy {
  product: Product;
  productSubs: Subscription;

  imgSlideOpts = {
    watchSlidesProgress: true,
  };

  cant: number;
  cantSubs: Subscription;

  imgLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.productSubs = this.route.params
      .pipe(switchMap(({ id }) => this.productService.getOne(id)))
      .subscribe((product) => (this.product = product));

    this.cantSubs = this.store
      .select('cart')
      .subscribe(({ cant }) => (this.cant = cant));
  }

  ngOnDestroy() {
    this.cantSubs?.unsubscribe();
    this.productSubs?.unsubscribe();
  }

  addProductToCart() {
    const product = ProductCart.fromProduct(this.product);
    this.store.dispatch(addProduct({ product }));
  }

  toCart() {
    this.router.navigate(['/cart']);
  }
}
