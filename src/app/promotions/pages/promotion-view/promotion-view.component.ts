import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Promotion } from 'src/app/models/promotion';
import { PromotionService } from 'src/app/services/promotion.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-promotion-view',
  templateUrl: './promotion-view.component.html',
  styleUrls: ['./promotion-view.component.scss'],
})
export class PromotionViewComponent implements OnInit, OnDestroy {
  promotion: Promotion;

  promotionSubs: Subscription;

  imageLoad = false;

  imgLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promotionService: PromotionService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.promotionSubs = this.route.params
      .pipe(switchMap(({ id }) => this.promotionService.getOne(id)))
      .subscribe((promotion) => (this.promotion = promotion));
  }

  ngOnDestroy() {
    this.promotionSubs?.unsubscribe();
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
                    this.promotionService
                      .delete(this.promotion.id, this.promotion.image)
                      .then(() => {
                        this.router.navigate(['/promotions']).then(async () => {
                          const toast = await this.utilService.createToast(
                            'Se elimino la promocion!'
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
            this.router.navigate(['promotions/edit', this.promotion.id]),
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

  inmgDidLoad(event: any) {
    this.imageLoad = true;
  }
}
