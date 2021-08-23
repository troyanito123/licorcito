import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CameraService } from 'src/app/services/camera.service';

import { ImageItem } from 'src/app/models/imageItem';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-new-images',
  templateUrl: './product-new-images.component.html',
  styleUrls: ['./product-new-images.component.scss'],
})
export class ProductNewImagesComponent implements OnInit, OnDestroy {
  imageList: ImageItem[] = [];
  imageListSubs: Subscription;
  path = '';

  slidesOpt = {
    initialSlide: this.imageList ? 0 : this.imageList.length - 1,
  };

  constructor(
    private cameraService: CameraService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.imageList = this.cameraService.imageList;
    this.imageListSubs = this.cameraService.imageList$.subscribe((list) => {
      this.imageList = list;
    });

    this.route.url.subscribe((res) => (this.path = res[0].path));
  }

  ngOnDestroy() {
    this.cameraService.cleanAllImagesFromList();
    this.imageListSubs?.unsubscribe();
  }

  takePicture() {
    this.cameraService.takePicture();
  }

  chooseFromGallery() {
    this.cameraService.chooseGallery();
  }

  removeImage(id: string) {
    this.cameraService.removeImageFromList(id);
  }
}
