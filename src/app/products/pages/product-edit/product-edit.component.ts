import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  product: Product;
  productId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          this.productId = id;
          return this.productService.getOne(id);
        })
      )
      .subscribe((product) => {
        this.product = product;
        this.product.id = this.productId;
      });
  }
}
