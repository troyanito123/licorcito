import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { OnesignalApiService } from 'src/app/services/onesignal-api.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrls: ['./order-notification.component.scss'],
})
export class OrderNotificationComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() orderId: string;

  user: User;
  userSubs: Subscription;

  notificationControl = new FormControl('', Validators.required);

  isLoading = false;

  constructor(
    private onesignalApiService: OnesignalApiService,
    private userService: UserService,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.userSubs = this.userService
      .getById(this.userId)
      .subscribe((user) => (this.user = user));
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
  }

  async sendNotificationToUser() {
    if (this.notificationControl.invalid) {
      this.notificationControl.markAllAsTouched();
      return;
    }
    if (!this.user?.onesignalId) {
      const alert = await this.utilService.createAlert(
        'No se puede mandar notificaciones a este usuario'
      );
      alert.present();
      return;
    }
    this.isLoading = true;

    this.onesignalApiService
      .sendNotificationToUser(
        this.orderId,
        this.user.onesignalId,
        this.notificationControl.value
      )
      .then(async () => {
        const toast = await this.utilService.createToast(
          'Notificacion enviada!'
        );
        this.isLoading = false;
        this.notificationControl.reset();
        toast.present();
      })
      .catch(async (err) => {
        const alert = await this.utilService.createAlert(
          'Ponte en contacto con el administrador!'
        );
        this.isLoading = false;
        alert.present();
      });
  }
}
