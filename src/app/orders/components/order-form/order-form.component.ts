import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';

import { OrderService } from 'src/app/services/order.service';

import { User } from 'src/app/models/user.model';
import { ProductCart } from 'src/app/models/product-cart';
import { initLoading, stopLoading } from 'src/app/state/actions/ui.actions';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils/utils.service';
import { cleanCart } from 'src/app/state/actions/cart.action';
import { unsetLocation } from 'src/app/state/actions/location.action';
import { ValidatorService } from 'src/app/utils/validator.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit, OnDestroy {
  detailForm: FormGroup;

  isLoading = false;

  products: ProductCart[] = [];
  cant: number;
  total: number;
  cartSubs: Subscription;

  uiSubs: Subscription;

  user: User;
  userSubs: Subscription;

  location: { lng: number; lat: number } = { lng: null, lat: null };
  locationSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private orderService: OrderService,
    private router: Router,
    private utilService: UtilsService,
    private validatorService: ValidatorService
  ) {}

  ngOnInit() {
    this.createForm();
    this.cartSubs = this.store
      .select('cart')
      .subscribe(({ products, total, cant }) => {
        this.products = products;
        this.cant = cant;
        this.total = total;
      });

    this.uiSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));

    this.userSubs = this.store
      .select('auth')
      .subscribe(({ user }) => (this.user = user));

    this.locationSubs = this.store
      .select('location')
      .subscribe(({ lng, lat }) => {
        this.location.lat = lat;
        this.location.lng = lng;
      });
  }

  ngOnDestroy() {
    this.cartSubs?.unsubscribe();
    this.uiSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
    this.locationSubs?.unsubscribe();
  }

  async sendOrder() {
    if (!this.location.lat) {
      const alert = await this.utilService.createAlert(
        'Mueve el marcador en el mapa donde quiere que te llevemos tu pedido'
      );
      alert.present();
      this.detailForm.markAllAsTouched();
      return;
    }

    const { lng, lat } = this.location;

    if (
      lng > -66.13689346418048 ||
      lng < -66.17689346418048 ||
      lat < -17.413779843949304 ||
      lat > -17.373779843949304
    ) {
      const alert = await this.utilService.createAlert(
        'Lo sentimos, no contamos con servicio en esa zona'
      );
      alert.present();
      this.detailForm.markAllAsTouched();
      return;
    }

    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(initLoading());
    const { onesignalId, dealerId, ...rest } = this.user;
    this.orderService
      .createOrder(
        this.detailForm.value,
        this.location,
        this.products,
        this.total,
        this.cant,
        rest
      )
      .then((ref) => {
        this.router.navigate(['/home']).then(async () => {
          this.store.dispatch(cleanCart());
          this.store.dispatch(unsetLocation());
          this.detailForm.reset();
          this.store.dispatch(stopLoading());
          const toast = await this.utilService.createToast('Pedido enviado!');
          toast.present();
        });
      })
      .catch(async (err) => {
        this.store.dispatch(stopLoading());
        this.store.dispatch(unsetLocation());
        const alert = await this.utilService.createAlert(err.message);
        alert.present();
      });
  }

  private createForm() {
    this.detailForm = this.fb.group({
      street1: [''],
      street2: [''],
      street3: [''],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validatorService.phonePattern),
        ],
      ],
      description: ['', Validators.required],
    });
  }

  invalidField(field: string) {
    return (
      this.detailForm.get(field).invalid && this.detailForm.get(field).touched
    );
  }

  get descriptionMessageError(): string {
    const errors = this.detailForm.get('description').errors;
    let message = '';
    if (errors?.required) {
      message = 'La descripcion del lugar de entrega es necesario';
    }
    return message;
  }

  get phoneMessageError(): string {
    const errors = this.detailForm.get('phone').errors;
    let message = '';
    if (errors?.required) {
      message = 'Un telefono de contacto es necesario';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un telefono valido';
    }
    return message;
  }
}
