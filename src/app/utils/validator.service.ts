import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern: string = '[467][0-9]{7}';

  constructor() {}

  sameFields(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1 = formGroup.get(field1)?.value;
      const pass2 = formGroup.get(field2)?.value;

      if (pass1 !== pass2) {
        formGroup.get(field2)?.setErrors({ noSame: true });
        return { noSame: true };
      }

      formGroup.get(field2)?.setErrors(null);

      return null;
    };
  }
}
