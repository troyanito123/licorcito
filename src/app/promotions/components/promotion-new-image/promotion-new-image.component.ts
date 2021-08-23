import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CameraPhoto } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { CameraSingleService } from 'src/app/services/camera-single.service';

@Component({
  selector: 'app-promotion-new-image',
  templateUrl: './promotion-new-image.component.html',
  styleUrls: ['./promotion-new-image.component.scss'],
})
export class PromotionNewImageComponent implements OnInit, OnDestroy {
  singlePhoto: CameraPhoto;
  singlePhotoSubs: Subscription;

  @Input() photoDB: string;

  constructor(private cameraSingleService: CameraSingleService) {}

  ngOnInit() {
    this.singlePhotoSubs = this.cameraSingleService.singleImage$.subscribe(
      (singlePhoto) => (this.singlePhoto = singlePhoto)
    );
  }

  ngOnDestroy() {
    this.cameraSingleService.removeImage();
  }

  takePicture() {
    this.cameraSingleService.takePicture();
  }

  chooseGallery() {
    this.cameraSingleService.chooseGallery();
  }
}
