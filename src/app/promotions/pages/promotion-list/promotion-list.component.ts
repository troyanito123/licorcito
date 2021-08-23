import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Promotion } from 'src/app/models/promotion';
import { PromotionService } from 'src/app/services/promotion.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss'],
})
export class PromotionListComponent implements OnInit, OnDestroy {
  promotions: Promotion[] = [];
  promotionSubs: Subscription;

  constructor(
    private promotionService: PromotionService,
    private alertController: AlertController,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.promotionSubs = this.promotionService
      .getAll()
      .subscribe((promotions) => (this.promotions = promotions));
  }

  ngOnDestroy() {
    this.promotionSubs?.unsubscribe();
  }

  async remove(promotion: Promotion) {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      message: '¿Seguro quieres eliminar esta promocion?',
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
              .delete(promotion.id, promotion.image)
              .then(async () => {
                const toast = await this.utilService.createToast(
                  'Se elimino la promocion!'
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
