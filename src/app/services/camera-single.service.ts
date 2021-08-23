import { EventEmitter, Injectable } from '@angular/core';
import {
  Camera,
  CameraOptions,
  CameraPhoto,
  CameraResultType,
  CameraSource,
} from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CameraSingleService {
  private singleImage: CameraPhoto;
  singleImage$: EventEmitter<CameraPhoto | null> = new EventEmitter();

  constructor() {}

  async takePicture() {
    this.singleImage = await this.processImage(CameraSource.Camera);
    this.emitChanges();
  }

  async chooseGallery() {
    this.singleImage = await this.processImage(CameraSource.Photos);
    this.emitChanges();
  }

  removeImage() {
    this.singleImage = null;
    this.emitChanges();
  }

  private async processImage(source: CameraSource) {
    const opts: CameraOptions = {
      source,
      resultType: CameraResultType.Uri,
      allowEditing: false,
      quality: 50,
      correctOrientation: true,
      height: 800,
      width: 800,
    };
    return await Camera.getPhoto(opts);
  }

  private emitChanges() {
    this.singleImage$.emit(this.singleImage);
  }
}
