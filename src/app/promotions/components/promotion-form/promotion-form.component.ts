import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CameraPhoto } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Promotion } from 'src/app/models/promotion';
import { CameraSingleService } from 'src/app/services/camera-single.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { initLoading, stopLoading } from 'src/app/state/actions/ui.actions';
import { AppState } from 'src/app/state/app.reducer';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss'],
})
export class PromotionFormComponent implements OnInit {
  @Input() promotion: Promotion;

  isLoading = false;

  promotionForm: FormGroup;

  uiSubs: Subscription;

  singlePhoto: CameraPhoto;
  singlePhotoSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private cameraSingleService: CameraSingleService,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.createForm();
    this.uiSubs = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading;
    });

    this.singlePhotoSubs = this.cameraSingleService.singleImage$.subscribe(
      (singlePhoto) => (this.singlePhoto = singlePhoto)
    );
  }

  ngOnDestroy(): void {
    this.uiSubs?.unsubscribe();
    this.singlePhotoSubs?.unsubscribe();
  }

  async save() {
    if (this.promotion) {
      if (this.promotionForm.invalid) {
        this.promotionForm.markAllAsTouched();
        return;
      }

      this.store.dispatch(initLoading());
      const image = await this.createBlobImage();

      this.promotionService
        .edit(
          this.promotion.id,
          this.promotionForm.value,
          this.promotion.image,
          image
        )
        .then(() => {
          this.store.dispatch(stopLoading());
          this.router
            .navigate(['/promotions', this.promotion.id])
            .then(async () => {
              const toast = await this.utilsService.createToast(
                'Promocion editada!'
              );
              toast.present();
            });
        })
        .catch(async (err) => {
          this.store.dispatch(stopLoading());
          const alert = await this.utilsService.createAlert(err.message);
          alert.present();
        });
    } else {
      if (!this.singlePhoto) {
        const alert = await this.utilsService.createAlert(
          'Se necesita la imagen'
        );
        alert.present();
        this.promotionForm.markAllAsTouched();
        return;
      }

      if (this.promotionForm.invalid) {
        this.promotionForm.markAllAsTouched();
        return;
      }

      this.store.dispatch(initLoading());
      const image = await this.createBlobImage();

      this.promotionService
        .save(this.promotionForm.value, image)
        .then(() => {
          this.store.dispatch(stopLoading());
          this.router.navigate(['/promotions']).then(async () => {
            this.promotionForm.reset();
            const toast = await this.utilsService.createToast(
              'Promocion creada!'
            );
            toast.present();
          });
        })
        .catch(async (err) => {
          this.store.dispatch(stopLoading());
          const alert = await this.utilsService.createAlert(err.message);
          alert.present();
        });
    }
  }

  cancel() {
    this.promotionForm.reset();
    this.router.navigate(['promotions']);
  }

  private createForm() {
    this.promotionForm = this.fb.group({
      name: [
        this.promotion ? this.promotion.name : '',
        [Validators.required, Validators.minLength(2)],
      ],
      description: [
        this.promotion ? this.promotion.description : '',
        [Validators.required, Validators.minLength(2)],
      ],
      price: [
        this.promotion ? Number(this.promotion.price) : 1.0,
        [Validators.required, Validators.min(1), Validators.max(9999)],
      ],
      available: [
        this.promotion ? this.promotion.available : true,
        Validators.required,
      ],
    });
  }

  invalidField(field: string) {
    return (
      this.promotionForm.get(field).invalid &&
      this.promotionForm.get(field).touched
    );
  }

  get invalidNameMsg(): string {
    const errors = this.promotionForm.get('name').errors;
    if (errors?.required) {
      return 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      return 'Nombre debe contener minimo 2 caracters';
    }
    return '';
  }

  get invalidDescriptionMsg(): string {
    const errors = this.promotionForm.get('description').errors;
    if (errors?.required) {
      return 'Descripcion es obligatorio';
    } else if (errors?.minlength) {
      return 'Descripcion debe contener minimo 2 caracters';
    }
    return '';
  }

  get invalidPriceMsg(): string {
    const errors = this.promotionForm.get('price').errors;
    if (errors?.required) {
      return 'Precio es obligatorio';
    } else if (errors?.min) {
      return 'Precio debe ser minimo de 1';
    } else if (errors?.max) {
      return 'Precio debe ser maximo de 9999';
    }
    return '';
  }

  private async createBlobImages() {
    // const images = [];
    // for (const item of this.imageList) {
    //   const blob = await fetch(item.image.webPath).then((r) => r.blob());
    //   images.push(blob);
    // }
    // return images;
  }

  private async createBlobImage() {
    try {
      return fetch(this.singlePhoto.webPath).then((r) => r.blob());
    } catch (error) {
      return null;
    }
  }
}
