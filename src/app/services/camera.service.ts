import { EventEmitter, Injectable } from '@angular/core';
import {
  Camera,
  CameraOptions,
  CameraPhoto,
  CameraResultType,
  CameraSource,
} from '@capacitor/core';
import { Observable } from 'rxjs';
import { ImageItem } from '../models/imageItem';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private _imagesList: ImageItem[] = [];

  imageList$: EventEmitter<ImageItem[]> = new EventEmitter();
  get imageList() {
    return [...this._imagesList];
  }

  isNew$: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  async takePicture() {
    const image = await this.processImage(CameraSource.Camera);
    const id = Date.now().toPrecision();
    this._imagesList.push(new ImageItem(id, image));
    this.emitChanges();
    this.isNew$.emit(true);
  }

  async chooseGallery() {
    const image = await this.processImage(CameraSource.Photos);
    const id = Date.now().toPrecision();
    this._imagesList.push(new ImageItem(id, image));
    this.emitChanges();
    this.isNew$.emit(true);
  }

  removeImageFromList(id: string) {
    this._imagesList = this._imagesList.filter((i) => i.id !== id);
    this.emitChanges();
  }

  cleanAllImagesFromList() {
    this._imagesList = [];
    this.emitChanges();
  }

  takeSinglePhoto(): Promise<CameraPhoto> {
    const source = CameraSource.Camera;
    const opts: CameraOptions = {
      source,
      resultType: CameraResultType.Uri,
      allowEditing: false,
      quality: 50,
      correctOrientation: true,
      height: 800,
      width: 800,
    };
    return Camera.getPhoto(opts);
  }

  private emitChanges() {
    this.imageList$.emit(this._imagesList);
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
