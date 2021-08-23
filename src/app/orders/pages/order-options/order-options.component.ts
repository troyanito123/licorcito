import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Order } from 'src/app/interfaces/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-options',
  templateUrl: './order-options.component.html',
  styleUrls: ['./order-options.component.scss'],
})
export class OrderOptionsComponent implements OnInit, AfterViewInit {
  order: Order;
  orderId: string;

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private orderService: OrderService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        tap(({ id }) => (this.orderId = id)),
        switchMap(({ id }) => this.orderService.getOne(id))
      )
      .subscribe((order) => {
        this.order = order;
        this.order.id = this.orderId;
      });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
