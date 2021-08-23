import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from './promotions.component';
import { PromotionEditComponent } from './pages/promotion-edit/promotion-edit.component';
import { PromotionListComponent } from './pages/promotion-list/promotion-list.component';
import { PromotionNewComponent } from './pages/promotion-new/promotion-new.component';
import { PromotionViewComponent } from './pages/promotion-view/promotion-view.component';

const routes: Routes = [
  {
    path: '',
    component: PromotionsComponent,
    children: [
      { path: 'list', component: PromotionListComponent },
      { path: 'edit/:id', component: PromotionEditComponent },
      { path: 'new', component: PromotionNewComponent },
      { path: ':id', component: PromotionViewComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {}
