import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ItemComponent } from './components/item/item.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { PipesModule } from '../pipes/pipes.module';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { PromotionItemComponent } from './components/promotion-item/promotion-item.component';
import { CategoryComponent } from './pages/category/category.component';
import { HomePromotionComponent } from './pages/home-promotion/home-promotion.component';
import { SearchProductsComponent } from './components/search-products/search-products.component';
import { HomeProductComponent } from './pages/home-product/home-product.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PipesModule,
  ],
  declarations: [
    HomePage,
    ItemComponent,
    ItemListComponent,
    CategoryItemComponent,
    PromotionItemComponent,
    CategoryComponent,
    HomePromotionComponent,
    SearchProductsComponent,
    HomeProductComponent,
  ],
})
export class HomePageModule {}
