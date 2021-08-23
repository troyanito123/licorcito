import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';
import { initLoading, stopLoading } from 'src/app/state/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from '../../../utils/validator.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { PopoverController } from '@ionic/angular';
import { AuthPopOverInfoComponent } from '../../components/auth-pop-over-info/auth-pop-over-info.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;

  emailPattern: string;
  phonePattern: string;

  isLoading = false;
  uiSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilsService,
    private store: Store<AppState>,
    private popoverController: PopoverController
  ) {
    this.emailPattern = this.validatorService.emailPattern;
    this.phonePattern = this.validatorService.phonePattern;
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

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(initLoading());

    this.authService
      .register(this.registerForm.value)
      .then(() => {
        this.store.dispatch(stopLoading());
        this.registerForm.reset();
        this.router.navigate(['home']).then(async () => {
          const toast = await this.utilService.createToast('¡Bienvenido!');
          toast.present();
        });
      })
      .catch(async (err) => {
        this.registerForm.get('password').reset();
        this.store.dispatch(stopLoading());
        const alert = await this.utilService.createAlert(
          'Correo electronico ya registrado!'
        );
        alert.present();
      });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AuthPopOverInfoComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios',
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  private createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
    });
  }

  invalidField(field: string) {
    return (
      this.registerForm.get(field).invalid &&
      this.registerForm.get(field).touched
    );
  }

  get nameMessageError(): string {
    const errors = this.registerForm.get('name').errors;
    let message = '';
    if (errors?.required) {
      message = 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      message = 'Nombre debe contener minimo 2 caracters';
    }
    return message;
  }

  get emailMessageError(): string {
    const errors = this.registerForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Email es obligatorio';
    } else if (errors?.unique) {
      message = 'Email ya registrado';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un email valido';
    }
    return message;
  }

  get passwordMessageError(): string {
    const errors = this.registerForm.get('password').errors;
    let message = '';
    if (errors?.required) {
      message = 'Contraseña es obligatorio';
    } else if (errors?.minlength) {
      message = 'Minimo 6 caracteres';
    }
    return message;
  }

  get password2MessageError(): string {
    const errors = this.registerForm.get('password2').errors;
    let message = '';
    if (errors?.required) {
      message = 'la confirmacion es obligatoria';
    } else if (errors?.noSame) {
      message = 'las contraseñas no coinciden';
    }
    return message;
  }

  get phoneMessageError(): string {
    const errors = this.registerForm.get('phone').errors;
    let message = '';
    if (errors?.required) {
      message = 'El telefono es obligatorio';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un telefono valido';
    }
    return message;
  }
}
