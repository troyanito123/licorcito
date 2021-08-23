import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Order, OrderState } from '../interfaces/order';
import { ProductCart } from '../models/product-cart';
import { User, UserRole } from '../models/user.model';
import { MessageService } from './message.service';
import { OnesignalApiService } from './onesignal-api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersRoot = 'orders';

  constructor(
    private db: AngularFireDatabase,
    private messageService: MessageService,
    private onesignalApiService: OnesignalApiService
  ) {}

  getAllOrders() {
    return this.db
      .list(this.ordersRoot)
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() } as Order))
        )
      );
  }

  getOrdersByRole(role: UserRole, userId: string, dealerId?: string) {
    if (role === UserRole.admin) {
      return this.db
        .list(this.ordersRoot)
        .snapshotChanges()
        .pipe(
          map((res: any[]) =>
            res.map((r) => ({ id: r.key, ...r.payload.val() } as Order))
          )
        );
    } else if (role === UserRole.dealer) {
      return this.db
        .list(this.ordersRoot, (ref) =>
          ref.orderByChild('dealerId').equalTo(dealerId)
        )
        .snapshotChanges()
        .pipe(
          map((res: any[]) =>
            res.map((r) => ({ id: r.key, ...r.payload.val() } as Order))
          )
        );
    } else {
      return this.db
        .list(this.ordersRoot, (ref) =>
          ref.orderByChild('userId').equalTo(userId)
        )
        .snapshotChanges()
        .pipe(
          map((res: any[]) =>
            res.map((r) => ({ id: r.key, ...r.payload.val() } as Order))
          )
        );
    }
  }

  getOne(id: string) {
    return this.db.object<Order>(`${this.ordersRoot}/${id}`).valueChanges();
  }

  createOrder(
    { street1, street2, street3, description, phone },
    { lng, lat },
    products: ProductCart[],
    total: number,
    cant: number,
    user: any
  ) {
    const createdAt = new Date().toUTCString();

    return this.db
      .list(this.ordersRoot)
      .push({
        street1,
        street2,
        street3,
        description,
        phone,
        location: { lng, lat },
        products,
        total,
        cant,
        user,
        createdAt,
        state: OrderState.new,
        userId: user.uid,
      })
      .then((ref) => {
        this.onesignalApiService.sendNotificationToAdmin(
          ref.key,
          user.name,
          total
        );
        const message =
          'Estamos preparando tu pedido, nos comunicaremos por este medio!';
        const adminUser = new User(
          'default-id',
          'Administrador',
          'admin@test.com',
          '70000000',
          UserRole.admin
        );
        return this.messageService.create(message, ref.key, adminUser);
      });
  }

  assignDealer(dealerId: string, orderId: string) {
    return this.db
      .object(`${this.ordersRoot}/${orderId}`)
      .update({ dealerId, state: OrderState.progress });
  }

  setCompleted(orderId: string) {
    return this.db
      .object(`${this.ordersRoot}/${orderId}`)
      .update({ state: OrderState.completed });
  }

  setNew(orderId: string) {
    return this.db
      .object(`${this.ordersRoot}/${orderId}`)
      .update({ state: OrderState.new });
  }
}
