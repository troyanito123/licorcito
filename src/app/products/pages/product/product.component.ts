import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { switchMap, tap } from 'rxjs/operators';

import { Product } from 'src/app/interfaces/interface';
import { ProductService } from 'src/app/services/product.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: Product;
  productId: string;

  imgLoading = true;

  imgSlideOpts = {
    watchSlidesProgress: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private utilService: UtilsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        tap(({ id }) => (this.productId = id)),
        switchMap(({ id }) => this.productService.getOne(id))
      )
      .subscribe((product) => {
        this.product = product;
        this.product.id = this.productId;
      });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: async () => {
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
                      .delete(this.product.id, this.product.images)
                      .then(() => {
                        this.router.navigate(['products']).then(async () => {
                          const toast = await this.utilService.createToast(
                            'Se elimino el producto!'
                          );
                          toast.present();
                        });
                      });
                  },
                },
              ],
            });
            alert.present();
          },
        },
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () =>
            this.router.navigate(['products/edit', this.productId]),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
