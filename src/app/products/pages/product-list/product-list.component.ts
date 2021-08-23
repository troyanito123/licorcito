import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

import { Product } from 'src/app/interfaces/interface';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private utilService: UtilsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });
  }

  async remove(product: Product) {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      message: '¿Seguro quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Si, Estoy seguro',
          handler: () => {
            this.productService
              .delete(product.id, product.images)
              .then(async () => {
                const toast = await this.utilService.createToast(
                  'Se elimino el producto!'
                );
                toast.present();
              });
          },
        },
      ],
    });
    alert.present();
  }
}
