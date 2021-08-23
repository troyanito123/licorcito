import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { DealerService } from 'src/app/services/dealer.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ValidationsDealer implements AsyncValidator {
  constructor(private dealerService: DealerService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    const dealer = this.dealerService.dealer;
    if (dealer && dealer?.email === email) {
      return of(null);
    }
    return this.dealerService.existEmail(email).pipe(
      map((exists) => (exists ? null : { unique: true })),
      catchError((err) => of({ unique: true }))
    );
  }

  static isUniqueName(ds: DealerService, discard?: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (discard) {
        return ds
          .existDealer(value, discard)
          .pipe(map((resp) => (resp === false ? null : { notUnique: true })));
      } else {
        return ds
          .existDealer(value)
          .pipe(map((resp) => (resp === false ? null : { notUnique: true })));
      }
    };
  }

  static isUniqueEmail(ds: DealerService, discard?: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (discard) {
        return ds
          .existEmail(value, discard)
          .pipe(map((resp) => (resp === false ? null : { notUnique: true })));
      } else {
        return ds
          .existEmail(value)
          .pipe(map((resp) => (resp === false ? null : { notUnique: true })));
      }
    };
  }

  static existUser(ds: DealerService, discard?: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (discard) {
        return ds
          .existUser(value, discard)
          .pipe(map((resp) => (resp === true ? null : { noUser: true })));
      } else {
        return ds
          .existUser(value)
          .pipe(map((resp) => (resp === true ? null : { noUser: true })));
      }
    };
  }
}
