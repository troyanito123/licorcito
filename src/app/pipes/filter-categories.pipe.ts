import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/interface';

@Pipe({
  name: 'filterCategories'
})
export class FilterCategoriesPipe implements PipeTransform {

  transform(products: Array<Product>, text: string, category: string = 'all'): Array<any> {
    if(category === 'all') {
      return products.filter(element =>  element.name
        .toLocaleLowerCase()
        .trim()
        .indexOf(text.toLocaleLowerCase().trim()) > -1);
    }
    else {
      return products.filter(element =>  (element.name
        .toLocaleLowerCase()
        .trim()
        .indexOf(text.toLocaleLowerCase().trim()) > -1) && element.category === category);
    }
  }

}
