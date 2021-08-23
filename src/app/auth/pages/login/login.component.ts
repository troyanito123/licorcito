import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';
import { initLoading, stopLoading } from 'src/app/state/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/utils/validator.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  emailPattern: string;
  isLoading = false;

  uiSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private utilService: UtilsService
  ) {
    this.emailPattern = this.validatorService.emailPattern;
  }

  ngOnInit() {
    this.createForm();
    this.uiSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));
  }

  ngOnDestroy() {
    this.uiSubs?.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(initLoading());

    this.authService
      .login(this.loginForm.value)
      .then(() => {
        this.store.dispatch(stopLoading());
        this.loginForm.reset();
        this.router.navigate(['home']).then(async () => {
          const toast = await this.utilService.createToast('¡Bienvenido!');
          toast.present();
        });
      })
      .catch(async (err) => {
        this.loginForm.get('password').reset();
        this.store.dispatch(stopLoading());
        const alert = await this.utilService.createAlert(
          'Credenciales incorrectas'
        );
        alert.present();
      });
  }

  googleLogin() {
    this.authService
      .googleAuth()
      .then(() => {
        // this.store.dispatch(stopLoading());
        this.loginForm.reset();
        this.router.navigate(['home']).then(async () => {
          const toast = await this.utilService.createToast('¡Bienvenido!');
          toast.present();
        });
      })
      .catch(async (err) => {
        this.loginForm.get('password').reset();
        this.store.dispatch(stopLoading());
        const alert = await this.utilService.createAlert(err.message);
        alert.present();
      });
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  invalidField(field: string) {
    return (
      this.loginForm.get(field).invalid && this.loginForm.get(field).touched
    );
  }

  get emailMessageError(): string {
    const errors = this.loginForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Email es obligatorio';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un email valido';
    }
    return message;
  }

  get passwordMessageError(): string {
    const errors = this.loginForm.get('password').errors;
    let message = '';
    if (errors?.required) {
      message = 'Contraseña es obligatorio';
    } else if (errors?.minlength) {
      message = 'Minimo 6 caracteres';
    }
    return message;
  }
}
