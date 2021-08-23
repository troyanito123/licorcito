import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  @Input() products: Product[];

  constructor() {}

  ngOnInit() {}
}
