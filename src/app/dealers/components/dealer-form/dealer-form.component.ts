import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Dealer } from 'src/app/models/dealer';
import { DealerService } from 'src/app/services/dealer.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { ValidatorService } from 'src/app/utils/validator.service';
import { ValidationsDealer } from '../../utils/validations-dealer';

@Component({
  selector: 'app-dealer-form',
  templateUrl: './dealer-form.component.html',
  styleUrls: ['./dealer-form.component.scss'],
})
export class DealerFormComponent implements OnInit {
  @Input() dealer: Dealer;
  @Input() dealerId: string;

  phonePattern: string;
  emailPattern: string;

  dealerForm: FormGroup;
  newPhone: FormControl;

  isLoading = false;

  get phones() {
    return this.dealerForm.get('phones') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private validationsDealer: ValidationsDealer,
    private router: Router,
    private dealerService: DealerService,
    private utilService: UtilsService
  ) {
    this.phonePattern = this.validatorService.phonePattern;
    this.emailPattern = this.validatorService.emailPattern;
    this.newPhone = this.fb.control('', [
      Validators.required,
      Validators.pattern(this.phonePattern),
    ]);
  }

  ngOnInit() {
    this.createForm();
  }

  async save() {
    if (this.dealerForm.invalid) {
      this.dealerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const blobImage = await this.createBlobImage();
    const { image, ...rest } = this.dealerForm.value;

    if (this.dealer) {
      this.dealerService
        .edit(this.dealerId, rest, this.dealer.urlImage, blobImage)
        .then(() => {
          this.isLoading = false;
          this.router.navigate(['/dealers']).then(async () => {
            const toast = await this.utilService.createToast(
              'Dealer Actualizado!'
            );
            toast.present();
          });
        })
        .catch(async (err) => {
          this.isLoading = false;
          const alert = await this.utilService.createAlert(err.message);
          alert.present();
        });
    } else {
      this.dealerService
        .create(rest, blobImage)
        .then(() => {
          this.router.navigate(['/dealers']).then(async () => {
            this.dealerForm.reset();
            this.isLoading = false;
            const toast = await this.utilService.createToast('Dealer creado!');
            toast.present();
          });
        })
        .catch(async (err) => {
          this.isLoading = false;
          const alert = await this.utilService.createAlert(err.message);
          alert.present();
        });
    }
  }

  addPhone() {
    if (this.newPhone.invalid) {
      return;
    }
    this.phones.push(
      this.fb.control(this.newPhone.value, [
        Validators.required,
        Validators.pattern(this.phonePattern),
      ])
    );

    this.newPhone.reset();
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  invalidField(field: string) {
    return (
      this.dealerForm.get(field).invalid && this.dealerForm.get(field).touched
    );
  }

  get invalidNameMsg(): string {
    const errors = this.dealerForm.get('email').errors;
    if (errors?.unique) {
      return 'Tiene que existir un email para el dealer';
    }
    return '';
  }
  get invalidImageMsg(): string {
    const errors = this.dealerForm.get('image').errors;
    if (errors?.required) {
      return 'La imagen es necesaria';
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/dealers']);
  }

  private createForm() {
    this.dealerForm = this.fb.group({
      name: [this.dealer ? this.dealer.name : '', [Validators.required]],
      company: [this.dealer ? this.dealer.company : '', [Validators.required]],
      email: [
        {
          value: this.dealer ? this.dealer.email : '',
          disabled: this.isEditing(),
        },
        [Validators.required, Validators.pattern(this.emailPattern)],
        [this.validationsDealer],
      ],
      image: [this.dealer ? this.dealer.urlImage : '', Validators.required],
      phones: this.fb.array(
        this.dealer ? this.createFormControls(this.dealer.phones) : [],
        Validators.required
      ),
    });
  }

  private async createBlobImage() {
    const image = this.dealerForm.get('image').value;

    if (typeof image === 'string') {
      return null;
    }
    const blob = await fetch(this.dealerForm.get('image').value.webPath).then(
      (r) => r.blob()
    );
    return blob;
  }

  private createFormControls(phones: number[]) {
    return phones.map((p) => [
      p,
      [Validators.required, Validators.pattern(this.phonePattern)],
    ]);
  }

  private isEditing() {
    return this.dealer !== undefined;
  }
}
