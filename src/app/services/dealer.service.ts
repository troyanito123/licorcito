import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable, of } from 'rxjs';
import { catchError, finalize, map, take, tap } from 'rxjs/operators';

import { Dealer } from '../models/dealer';
import { User, UserRole } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DealerService {
  dealers$: Observable<any>;

  itemsRef: AngularFireList<any>;
  dealers: Observable<any[]>;

  dealer: Dealer;
  dealerRoot = 'dealers';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private us: UserService
  ) {
    this.dealers$ = this.db.list<Dealer>('dealers').snapshotChanges();
    this.itemsRef = this.db.list('dealers/');
  }

  create({ email, name, company, phones }, image: Blob) {
    return this.db
      .list(this.dealerRoot)
      .push({ email, name, company, phones })
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
                  .object(`${this.dealerRoot}/${ref.key}/`)
                  .update({ urlImage: res });
              });
            })
          )
          .subscribe();
        this.db
          .list(`users`, (ref) => ref.orderByChild('email').equalTo(email))
          .snapshotChanges()
          .pipe(
            map((changes) => {
              const uid = changes[0].payload.key;
              this.db
                .object(`users/${uid}`)
                .update({ role: UserRole.dealer, dealerId: ref.key });
            }),
            take(1)
          )
          .subscribe();
      });
  }

  edit(id: string, { name, company, phones }, urlImage: string, image?: Blob) {
    return this.db
      .object(`${this.dealerRoot}/${id}`)
      .update({ name, company, phones })
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
                    .object(`${this.dealerRoot}/${id}`)
                    .update({ urlImage: res })
                    .then(() => {
                      this.storage.refFromURL(urlImage).delete().subscribe();
                    });
                });
              })
            )
            .subscribe();
        }
      });
  }

  getAll() {
    this.itemsRef = this.db.list('dealers');
    this.dealers = this.itemsRef
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ id: c.payload.key, ...c.payload.val() }))
        )
      );

    return this.dealers;
  }

  getDealer(id: string): Observable<Dealer> {
    return this.db
      .object<Dealer>(`dealers/${id}`)
      .valueChanges()
      .pipe(
        map((res) => Dealer.fromFirebase(res)),
        tap((dealer) => (this.dealer = dealer))
      );
  }

  existEmail(email: string, discard?: string) {
    return this.db
      .list<User>('users')
      .valueChanges()
      .pipe(
        take(1),
        map((users) => (users.find((u) => u.email === email) ? true : false)),
        catchError((err) => of(false))
      );
  }

  existDealer(name: string, discard?: string) {
    return new Observable((o) => {
      this.db
        .list<Dealer>('dealers', (ref) =>
          ref.orderByChild('name').equalTo(name)
        )
        .valueChanges()
        .subscribe((data) => {
          if (discard) {
            if (data.length === 1 && data[0].name === discard) {
              o.next(false);
            } else {
              o.next(data.length === 0 ? false : true);
            }
          } else {
            o.next(data.length === 0 ? false : true);
          }
          o.complete();
        });
    });
  }

  existUser(email: string, discard?: string) {
    return new Observable((o) => {
      this.db
        .list<Dealer>('users', (ref) =>
          ref.orderByChild('email').equalTo(email)
        )
        .valueChanges()
        .subscribe((data) => {
          if (discard) {
            console.log('discard', data.length);
            if (data.length === 1 && data[0].email === discard) {
              o.next(false);
            } else {
              o.next(data.length === 0 ? false : true);
            }
          } else {
            console.log('value', data.length === 0 ? false : true);
            o.next(data.length === 0 ? false : true);
          }
          o.complete();
        });
    });
  }

  getUserId(id: string) {
    return this.db
      .list<any>('user_dealer', (ref) =>
        ref.orderByChild('dealerId').equalTo(id)
      )
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ id: c.payload.key, ...c.payload.val() }))
        )
      );
  }

  deleteDealer(id: string, email: string, urlImage: string) {
    this.storage.refFromURL(urlImage).delete().subscribe();
    this.db
      .list('users', (ref) => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .pipe(
        map((data) => {
          const uid = data[0].payload.key;
          this.db
            .object(`users/${uid}`)
            .update({ role: UserRole.user, dealerId: null });
        })
      )
      .subscribe();

    return this.db.object(`${this.dealerRoot}/${id}`).remove();
  }

  private generateFileName(): string {
    return `${this.dealerRoot}/${new Date().getTime()}`;
  }
}
