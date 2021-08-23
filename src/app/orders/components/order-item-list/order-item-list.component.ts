import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderState } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-item-list',
  templateUrl: './order-item-list.component.html',
  styleUrls: ['./order-item-list.component.scss'],
})
export class OrderItemListComponent implements OnInit {
  @Input() orders: Order[];

  constructor() {}

  ngOnInit() {}

  getColor(state: OrderState) {
    if (state === OrderState.new) {
      return 'primary';
    } else if (state === OrderState.progress) {
      return 'secondary';
    } else {
      return 'warning';
    }
  }

  getName(state: OrderState) {
    if (state === OrderState.new) {
      return 'Nuevo';
    } else if (state === OrderState.progress) {
      return 'En progreso';
    } else {
      return 'Finalizado';
    }
  }
}
