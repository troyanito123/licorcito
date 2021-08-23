import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { PipesModule } from '../pipes/pipes.module';
import { CartButtonComponent } from './components/cart-button/cart-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    PipesModule,
  ],
  declarations: [CartPage, CartProductComponent, CartButtonComponent],
})
export class CartPageModule {}
