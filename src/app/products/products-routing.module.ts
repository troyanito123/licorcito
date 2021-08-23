import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsPage } from './products.page';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductNewComponent } from './pages/product-new/product-new.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    children: [
      { path: 'list', component: ProductListComponent },
      { path: 'edit/:id', component: ProductEditComponent },
      { path: 'new', component: ProductNewComponent },
      { path: ':id', component: ProductComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
