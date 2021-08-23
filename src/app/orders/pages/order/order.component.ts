import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';

import { OrderService } from 'src/app/services/order.service';

import { Order, OrderState } from 'src/app/interfaces/order';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderId: string;
  order: Order;

  isLoading = false;

  constructor(
    private router: ActivatedRoute,
    private orderService: OrderService,
    public authService: AuthService,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.router.params
      .pipe(
        tap(({ id }) => (this.orderId = id)),
        switchMap(({ id }) => this.orderService.getOne(id))
      )
      .subscribe((order) => {
        this.order = order;
        this.order.id = this.orderId;
      });
  }

  setCompleted() {
    this.isLoading = true;
    this.orderService
      .setCompleted(this.orderId)
      .then(async () => {
        const toast = await this.utilService.createToast(
          'Se completo esta orden!'
        );
        this.isLoading = false;
        toast.present();
      })
      .catch(async (err) => {
        const alert = await this.utilService.createAlert(err.message);
        this.isLoading = false;
        alert.present();
      });
  }

  setNew() {
    this.isLoading = true;
    this.orderService
      .setNew(this.orderId)
      .then(async () => {
        const toast = await this.utilService.createToast(
          'Se reanudo esta orden!'
        );
        this.isLoading = false;
        toast.present();
      })
      .catch(async (err) => {
        const alert = await this.utilService.createAlert(err.message);
        this.isLoading = false;
        alert.present();
      });
  }

  get isNewOrProgress() {
    return (
      this.order?.state === OrderState.new ||
      this.order?.state === OrderState.progress
    );
  }
}
