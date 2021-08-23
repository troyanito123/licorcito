import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Promotion } from '../models/promotion';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  promotionRoot = 'promotions';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  save({ name, description, price, available }, image: Blob) {
    return this.db
      .list(this.promotionRoot)
      .push({ name, description, price, available })
      .then((ref) => {
        const filePath = this.generateFileName();
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, image);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((res) => {
                this.db
                  .object(`${this.promotionRoot}/${ref.key}/`)
                  .update({ image: res });
              });
            })
          )
          .subscribe();
      });
  }

  edit(
    id: string,
    { name, description, price, available },
    imageUrl: string,
    image?: Blob
  ) {
    return this.db
      .object(`${this.promotionRoot}/${id}`)
      .update({ name, description, price, available })
      .then(() => {
        if (image) {
          const filePath = this.generateFileName();
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, image);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((res) => {
                  this.db
                    .object(`${this.promotionRoot}/${id}`)
                    .update({ image: res })
                    .then(() => {
                      this.storage.refFromURL(imageUrl).delete().subscribe();
                    });
                });
              })
            )
            .subscribe();
        }
      });
  }

  getAvailable() {
    return this.db
      .list(this.promotionRoot, (ref) =>
        ref.orderByChild('available').equalTo(true)
      )
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) => res.map((r) => Promotion.fromFirebase(r)))
      );
  }

  getAll() {
    return this.db
      .list(this.promotionRoot)
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) => res.map((r) => Promotion.fromFirebase(r)))
      );
  }

  getOne(id: string) {
    return this.db
      .object(`${this.promotionRoot}/${id}`)
      .snapshotChanges()
      .pipe(
        map((res: any) => ({ id: res.key, ...res.payload.val() })),
        map((res: any) => Promotion.fromFirebase(res))
      );
  }

  delete(id: string, image: string) {
    this.storage.refFromURL(image).delete();
    return this.db.object(`${this.promotionRoot}/${id}`).remove();
  }

  private generateFileName(): string {
    return `${this.promotionRoot}/${new Date().getTime()}`;
  }
}
