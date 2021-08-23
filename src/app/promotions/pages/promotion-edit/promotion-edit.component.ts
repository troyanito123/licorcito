import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Promotion } from 'src/app/models/promotion';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-promotion-edit',
  templateUrl: './promotion-edit.component.html',
  styleUrls: ['./promotion-edit.component.scss'],
})
export class PromotionEditComponent implements OnInit, OnDestroy {
  promotion: Promotion;

  promotionSubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.promotionSubs = this.route.params
      .pipe(switchMap(({ id }) => this.promotionService.getOne(id)))
      .subscribe((promotion) => (this.promotion = promotion));
  }

  ngOnDestroy() {
    this.promotionSubs?.unsubscribe();
  }
}
