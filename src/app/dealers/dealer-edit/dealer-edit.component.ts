import { Component, OnInit } from '@angular/core';

import { DealerService } from 'src/app/services/dealer.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Dealer } from 'src/app/models/dealer';

import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dealer-edit',
  templateUrl: './dealer-edit.component.html',
  styleUrls: ['./dealer-edit.component.scss'],
})
export class DealerEditComponent implements OnInit {
  dealerId: string;
  dealer: Dealer;

  constructor(
    private dealerService: DealerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        tap(({ id }) => (this.dealerId = id)),
        switchMap(({ id }) => this.dealerService.getDealer(id))
      )
      .subscribe((dealer) => (this.dealer = dealer));
  }
}
