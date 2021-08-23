import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators/';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersRef = 'users';

  constructor(private db: AngularFireDatabase) {}

  getUserByEmail(email: string) {
    return this.db
      .list<any>('users', (ref) => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ id: c.payload.key, ...c.payload.val() }))
        )
      );
  }

  addOneSignalId(userId: string, onesignalId: string) {
    return this.db.object(`users/${userId}`).update({ onesignalId });
  }

  getById(id: string) {
    return this.db
      .object(`${this.usersRef}/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        map((res: any) => User.fromFirebase(res))
      );
  }
}
