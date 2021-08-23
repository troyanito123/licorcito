import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FilterPipe } from './filter.pipe';
import { FilterCategoriesPipe } from './filter-categories.pipe';
import { UpperFirstPipe } from './upper-first.pipe';

@NgModule({
  declarations: [
    DomSanitizerPipe,
    FilterPipe,
    FilterCategoriesPipe,
    UpperFirstPipe,
  ],
  exports: [DomSanitizerPipe, FilterPipe, FilterCategoriesPipe, UpperFirstPipe],
  imports: [CommonModule],
})
export class PipesModule {}
