import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Order } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
})
export class OrderlistComponent implements OnInit, OnDestroy {
  orders: Order[] = [];

  orderSubs: Subscription;

  constructor(
    private orderService: OrderService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.orderSubs = this.store
      .select('auth')
      .pipe(
        filter(({ user }) => user !== null),
        switchMap(({ user }) =>
          this.orderService.getOrdersByRole(user.role, user.uid, user?.dealerId)
        )
      )
      .subscribe((orders) => (this.orders = orders));
  }

  ngOnDestroy() {
    this.orderSubs?.unsubscribe();
  }
}
