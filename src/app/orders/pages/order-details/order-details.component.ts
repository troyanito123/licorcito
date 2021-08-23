import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Order, Product } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order: Order;
  orderId: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        tap(({ id }) => (this.orderId = id)),
        switchMap(({ id }) => this.orderService.getOne(id))
      )
      .subscribe((order) => {
        this.order = order;
      });
  }
}
