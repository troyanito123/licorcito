import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Dealer } from 'src/app/interfaces/dealer';
import { Order } from 'src/app/interfaces/order';
import { DealerService } from 'src/app/services/dealer.service';
import { OnesignalApiService } from 'src/app/services/onesignal-api.service';
import { OrderService } from 'src/app/services/order.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-order-dealer',
  templateUrl: './order-dealer.component.html',
  styleUrls: ['./order-dealer.component.scss'],
})
export class OrderDealerComponent implements OnInit, OnDestroy {
  dealers: Dealer[] = [];
  dealerSub: Subscription;

  @Input() order: Order;

  dealerForm: FormControl;

  isLoading = false;

  constructor(
    private dealerService: DealerService,
    private orderService: OrderService,
    private utilService: UtilsService,
    private onesignalApiService: OnesignalApiService
  ) {}

  ngOnInit() {
    this.dealerForm = new FormControl(
      this.order.dealerId ? this.order.dealerId : '',
      Validators.required
    );

    this.dealerSub = this.dealerService.getAll().subscribe((dealers) => {
      this.dealers = dealers;
    });
  }

  ngOnDestroy() {
    this.dealerSub?.unsubscribe();
  }

  assignDealer() {
    if (this.dealerForm.invalid) {
      this.dealerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.orderService
      .assignDealer(this.dealerForm.value, this.order.id)
      .then(async () => {
        this.onesignalApiService.sendNotificationToDealer(
          this.dealerForm.value,
          this.order.id,
          this.order.total
        );
        const toast = await this.utilService.createToast(
          'Se asigno el dealer correctamente!'
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
}
