import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private root = 'messages';

  constructor(private db: AngularFireDatabase) {}

  create(body: string, orderId: string, user: User) {
    const date = new Date().toUTCString();
    return this.db
      .list(`${this.root}/${orderId}`)
      .push({ body, role: user.role, name: user.name, userId: user.uid, date });
  }

  getMessages(orderId: string) {
    return this.db
      .list(`${this.root}/${orderId}`)
      .valueChanges()
      .pipe(map((res: any[]) => res.map((r) => Message.fromFirebase(r))));
  }
}
