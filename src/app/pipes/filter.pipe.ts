import { Pipe, PipeTransform } from '@angular/core';
import { Dealer } from '../models/dealer';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(dealers: Array<Dealer>, text: string): Array<any> {
    const matched = dealers.filter(
      (element) =>
        element.name
          .toLocaleLowerCase()
          .trim()
          .indexOf(text.toLocaleLowerCase().trim()) > -1
    );
    return matched;
  }
}
