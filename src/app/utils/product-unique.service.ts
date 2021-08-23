import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Product } from '../interfaces/interface';
import { ProductService } from '../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductUniqueService implements AsyncValidator {
  constructor(private productService: ProductService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const name = control.value;
    const product = this.productService.product;
    if (product && product?.name === name) {
      return of(null);
    }
    return this.productService.existsProduct(name).pipe(
      map((exists) => (exists ? { unique: true } : null)),
      catchError((err) => of({ unique: true }))
    );
  }
}
