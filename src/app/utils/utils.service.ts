import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  createAlert(message: string) {
    return this.alertController.create({
      backdropDismiss: false,
      message,
      header: 'Ocurrio un error',
      buttons: ['Ok'],
    });
  }

  createToast(message: string) {
    return this.toastController.create({
      message,
      duration: 2000,
    });
  }
}
