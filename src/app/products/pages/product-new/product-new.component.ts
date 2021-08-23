import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.scss'],
})
export class ProductNewComponent implements OnInit {
  constructor(private productSerive: ProductService) {}

  ngOnInit() {
    this.productSerive.resetProduct();
  }
}
