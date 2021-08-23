import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Image, Product } from 'src/app/interfaces/interface';

import { catchError, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ImageItem } from 'src/app/models/imageItem';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private MEDIA_STORAGE_PATH = 'products';
  private _products: Product[] = [];

  _product: Product;

  imagesDeleted: Image[] = [];

  get product() {
    return { ...this._product };
  }

  get products() {
    return [...this._products];
  }

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  getAll() {
    return this.db
      .list<Product>('products')
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) =>
          res.map((r) => {
            const imgArr = this.createImagesArr(r.images);
            const newp = { ...r };
            newp.images = imgArr;
            return newp as Product;
          })
        ),
        tap((products) => (this._products = products))
      );
  }

  getProductForHome() {
    return this.db
      .list('products', (ref) => ref.orderByChild('available').equalTo(true))
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) =>
          res.map((r) => {
            const imgArr = this.createImagesArr(r.images);
            const newp = { ...r };
            newp.images = imgArr;
            return newp as Product;
          })
        )
      );
  }

  getProductsByCategory(category: string) {
    return this.db
      .list('products', (ref) => ref.orderByChild('category').equalTo(category))
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) =>
          res.map((r) => {
            const imgArr = this.createImagesArr(r.images);
            const newp = { ...r };
            newp.images = imgArr;
            return newp as Product;
          })
        )
      );
  }

  createImagesArr(imagesObj: object) {
    const images: Image[] = [];
    if (!imagesObj) {
      return images;
    }
    Object.keys(imagesObj).forEach((key) => {
      const image: any = {};
      image.id = key;
      image.url = imagesObj[key];
      images.push(image);
    });
    return images;
  }

  create(product: Product, images?: Blob[]) {
    product.createdAt = Date.now().toPrecision();
    product.updatedAt = Date.now().toPrecision();

    return this.db
      .list(this.MEDIA_STORAGE_PATH)
      .push(product)
      .then((ref) => {
        const imagesRef = this.db.list(
          `${this.MEDIA_STORAGE_PATH}/${ref.key}/images`
        );
        for (const item of images) {
          const filePath = this.generateFileName(
            `${Date.now().toPrecision()}-no-name`
          );
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, item);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((res) => {
                  imagesRef.push(res);
                });
              })
            )
            .subscribe();
        }
      });
  }

  getOne(id: string) {
    return this.db
      .object<Product>(`products/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        map((product) => {
          const imgArr = this.createImagesArr(product.images);
          const newp = { ...product };
          newp.images = imgArr;
          return newp as Product;
        }),
        tap((res) => this.changeProductAndEmitt(res))
      );
  }

  update(id: string, product: Product, images: Blob[], oldImages?: Image[]) {
    product.updatedAt = new Date().getDate().toPrecision();
    return this.db
      .list('products')
      .update(id, product)
      .then((ref) => {
        const imagesRef = this.db.list(
          `${this.MEDIA_STORAGE_PATH}/${id}/images`
        );
        if (images.length > 0) {
          oldImages.forEach((img) => {
            this.storage.refFromURL(img.url).delete();
          });
          imagesRef.remove();
        }
        if (this.imagesDeleted.length > 0) {
          this.imagesDeleted.forEach((img) => {
            this.storage.refFromURL(img.url).delete();
            this.db
              .object(`${this.MEDIA_STORAGE_PATH}/${id}/images/${img.id}`)
              .remove();
          });
        }
        for (const item of images) {
          const filePath = this.generateFileName(
            `${Date.now().toPrecision()}-no-name`
          );
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, item);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((res) => {
                  imagesRef.push(res);
                });
              })
            )
            .subscribe();
        }
      });
  }

  delete(id: string, images: Image[]) {
    images.forEach((image) => {
      this.storage.refFromURL(image.url).delete();
    });
    return this.db.object(`products/${id}`).remove();
  }

  resetProduct() {
    this._product = null;
  }

  private changeProductAndEmitt(product: Product) {
    this._product = product;
  }

  existsProduct(field: string) {
    return this.db
      .list<Product>('products')
      .valueChanges()
      .pipe(
        take(1),
        map((products) =>
          products.find((p) => p.name === field) ? true : false
        ),
        catchError((err) => of(false))
      );
  }

  private generateFileName(name: string): string {
    return `${this.MEDIA_STORAGE_PATH}/${new Date().getTime()}_${name}`;
  }

  removeImageById(productId: string, image: Image) {
    return this.db
      .object(`${this.MEDIA_STORAGE_PATH}/${productId}/images/${image.id}`)
      .remove()
      .then((res) => {
        return this.storage.refFromURL(image.url).delete().toPromise();
      });
  }

  setImageDeleted(image: Image) {
    this.imagesDeleted.push(image);
  }

  cleanImagesDeleted() {
    this.imagesDeleted = [];
  }
}
