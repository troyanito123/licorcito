import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from 'src/app/models/promotion';

@Component({
  selector: 'app-promotion-item',
  templateUrl: './promotion-item.component.html',
  styleUrls: ['./promotion-item.component.scss'],
})
export class PromotionItemComponent implements OnInit {
  @Input() promotion: Promotion;

  imgLoading = true;

  constructor(private router: Router) {}

  ngOnInit() {}

  toPromotion() {
    this.router.navigate(['/home/promotion', this.promotion.id]);
  }
}
