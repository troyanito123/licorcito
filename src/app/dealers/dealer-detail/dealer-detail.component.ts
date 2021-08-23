import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Dealer } from 'src/app/models/dealer';
import { DealerService } from 'src/app/services/dealer.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-dealer-detail',
  templateUrl: './dealer-detail.component.html',
  styleUrls: ['./dealer-detail.component.scss'],
})
export class DealerDetailComponent implements OnInit {
  dealer: Dealer;
  dealerId: string;

  imgLoading = true;
  constructor(
    private ds: DealerService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private router: Router,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        tap(({ id }) => (this.dealerId = id)),
        switchMap(({ id }) => this.ds.getDealer(id))
      )
      .subscribe((data) => (this.dealer = data));
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Proveedor',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: async () => {
            const alert = await this.alertController.create({
              header: 'Cuidado',
              message: 'Esta seguro de eliminar este proveedor?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Si, Eliminar',
                  handler: () => {
                    this.ds
                      .deleteDealer(
                        this.dealerId,
                        this.dealer.email,
                        this.dealer.urlImage
                      )
                      .then(() => {
                        this.router
                          .navigate(['dealers/list'])
                          .then(async () => {
                            const toast = await this.utilService.createToast(
                              'Dealer eliminado...'
                            );
                            toast.present();
                          });
                      });
                  },
                },
              ],
            });
            await alert.present();
          },
        },
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.router.navigate(['dealers/edit', this.dealerId]);
          },
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
