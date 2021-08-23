import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderlistComponent } from './pages/orderlist/orderlist.component';
import { OrderMapComponent } from './components/order-map/order-map.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderItemListComponent } from './components/order-item-list/order-item-list.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderOptionsComponent } from './pages/order-options/order-options.component';
import { OrderChatComponent } from './components/order-chat/order-chat.component';
import { OrderNotificationComponent } from './components/order-notification/order-notification.component';
import { OrderDealerComponent } from './components/order-dealer/order-dealer.component';
import { OrderPopoverComponent } from './components/order-popover/order-popover.component';
import { OrderPageChatComponent } from './pages/order-page-chat/order-page-chat.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderNewComponent,
    OrderlistComponent,
    OrderMapComponent,
    OrderFormComponent,
    OrderItemListComponent,
    OrderComponent,
    OrderDetailsComponent,
    OrderOptionsComponent,
    OrderChatComponent,
    OrderNotificationComponent,
    OrderDealerComponent,
    OrderPopoverComponent,
    OrderPageChatComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class OrdersModule {}
