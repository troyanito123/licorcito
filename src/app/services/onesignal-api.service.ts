import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  OneSignalAppClient,
  NotificationBySegmentBuilder,
  NotificationByDeviceBuilder,
} from 'onesignal-api-client-core';
import { map, take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class OnesignalApiService {
  private client: OneSignalAppClient;

  private headsForUser = 'Licorcito';

  private usersRef = 'users';

  constructor(private db: AngularFireDatabase) {
    this.client = new OneSignalAppClient(
      environment.onesignal.appId,
      environment.onesignal.apiKey
    );
  }

  sendNotificationToUser(
    orderId: string,
    onesignalId: string,
    message: string
  ) {
    const input = new NotificationByDeviceBuilder()
      .setIncludePlayerIds([onesignalId])
      .notification() // .email()
      .setHeadings({
        en: this.headsForUser,
        es: this.headsForUser,
      })
      .setContents({ en: message, es: message })
      .setSubtitle({ en: 'El licorcito feliz', es: 'El licorcito feliz' })
      .setAttachments({ data: { orderId } })
      .build();
    return this.client.createNotification(input);
  }

  sendNotificationToAdmin(orderId: string, name: string, total: number) {
    const header = 'Hay un nuevo pedido, revisalo!';
    const message = `${name} pidio productos a valor de Bs. ${total}, a trabajar!`;
    this.db
      .list(this.usersRef)
      .snapshotChanges()
      .pipe(
        map((res: any[]) =>
          res.map((r) => ({ id: r.key, ...r.payload.val() }))
        ),
        map((res: any[]) => res.map((r) => User.fromFirebase(r))),
        map((users) => users.filter((u) => u.role === UserRole.admin)),
        map((users) => users.map((u) => u.onesignalId)),
        map((ids) => ids.filter((i) => i !== undefined)),
        take(1)
      )
      .subscribe((onesignalIds) => {
        if (onesignalIds.length === 0) {
          return;
        }
        const input = new NotificationByDeviceBuilder()
          .setIncludePlayerIds(onesignalIds)
          .notification() // .email()
          .setHeadings({
            en: header,
            es: header,
          })
          .setContents({ en: message, es: message })
          .setSubtitle({ en: 'El licorcito feliz', es: 'El licorcito feliz' })
          .setAttachments({ data: { orderId } })
          .build();

        this.client.createNotification(input);
      });
  }

  sendNotificationToDealer(dealerId: string, orderId: string, total: number) {
    const header = 'Nueva orden asignada!';
    const message = `Se te asigno una orden de Bs. ${total}, ya esta lista llevasela al usuario`;

    this.db
      .list(`${this.usersRef}`, (ref) =>
        ref.orderByChild('dealerId').equalTo(dealerId)
      )
      .valueChanges()
      .pipe(
        map((res: any) => User.fromFirebase(res[0])),
        take(1)
      )
      .subscribe((user) => {
        if (!user.onesignalId) {
          console.log('no tiene onesignal id');
          return;
        }

        const input = new NotificationByDeviceBuilder()
          .setIncludePlayerIds([user.onesignalId])
          .notification() // .email()
          .setHeadings({
            en: header,
            es: header,
          })
          .setContents({ en: message, es: message })
          .setSubtitle({ en: 'El licorcito feliz', es: 'El licorcito feliz' })
          .setAttachments({ data: { orderId } })
          .build();

        this.client.createNotification(input);
      });
  }
}
