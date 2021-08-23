import { Injectable } from '@angular/core';
import {
  Camera,
  CameraOptions,
  CameraResultType,
  CameraSource,
} from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CameraFormService {
  constructor() {}

  takePicture() {
    return this.processImage(CameraSource.Camera);
  }

  async chooseGallery() {
    return this.processImage(CameraSource.Photos);
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
}
