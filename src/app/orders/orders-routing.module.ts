import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderNewGuard } from '../guards/order-new.guard';
import { OrdersComponent } from './orders.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderOptionsComponent } from './pages/order-options/order-options.component';
import { OrderPageChatComponent } from './pages/order-page-chat/order-page-chat.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderlistComponent } from './pages/orderlist/orderlist.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {
        path: 'new',
        component: OrderNewComponent,
        canActivate: [OrderNewGuard],
      },
      { path: 'list', component: OrderlistComponent },
      { path: ':id', component: OrderComponent },
      { path: 'details/:id', component: OrderDetailsComponent },
      { path: 'options/:id', component: OrderOptionsComponent },
      { path: 'chat/:id', component: OrderPageChatComponent },
      { path: '', redirectTo: 'list' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
