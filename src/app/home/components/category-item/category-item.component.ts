import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent implements OnInit {
  @Input() category: string;
  img: string;

  constructor() {}

  ngOnInit() {
    this.img = `assets/categories/${this.category.toLocaleLowerCase()}.jpg`;
  }
}
