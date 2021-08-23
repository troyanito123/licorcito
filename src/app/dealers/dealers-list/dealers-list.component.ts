import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/utils/utils.service';
import { Dealer } from '../../models/dealer';
import { DealerService } from '../../services/dealer.service';

@Component({
  selector: 'app-dealers-list',
  templateUrl: './dealers-list.component.html',
  styleUrls: ['./dealers-list.component.scss'],
})
export class DealersListComponent implements OnInit {
  dealers: any[];
  dealersData: Dealer[];

  search = '';

  constructor(
    private ds: DealerService,
    private alertController: AlertController,
    private router: Router,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.dealers = [];
    this.ds.getAll().subscribe((data) => {
      this.dealers = data;
    });
  }

  async remove(id: string, email: string, urlImage: string) {
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
          text: 'Si Eliminar',
          handler: () => {
            this.ds.deleteDealer(id, email, urlImage).then(() => {
              this.router.navigate(['dealers/list']).then(async () => {
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
  }
}
