import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CameraPhoto } from '@capacitor/core';
import { CameraFormService } from 'src/app/services/camera-form.service';

@Component({
  selector: 'app-dealer-image',
  templateUrl: './dealer-image.component.html',
  styleUrls: ['./dealer-image.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DealerImageComponent),
      multi: true,
    },
  ],
})
export class DealerImageComponent implements OnInit, ControlValueAccessor {
  initialValue: string;

  photo: CameraPhoto;

  onChange = (_: any) => {};
  onTouch = () => {};
  isDisabled: boolean;

  constructor(private cameraFormService: CameraFormService) {}

  ngOnInit() {}

  writeValue(image: string): void {
    if (image) {
      this.initialValue = image;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  async openCamera() {
    this.photo = await this.cameraFormService.takePicture();
    this.initialValue = null;
    this.onTouch();
    this.onChange(this.photo);
  }

  async openGallery() {
    this.photo = await this.cameraFormService.chooseGallery();
    this.initialValue = null;
    this.onTouch();
    this.onChange(this.photo);
  }

  removePhoto() {
    this.photo = null;
  }
}
