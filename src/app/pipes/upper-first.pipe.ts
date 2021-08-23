import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperFirst',
})
export class UpperFirstPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .toLocaleLowerCase()
      .replace(/\b[a-z]/g, (c) => c.toLocaleUpperCase());
  }
}
