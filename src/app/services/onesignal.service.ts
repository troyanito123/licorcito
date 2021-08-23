import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OnesignalService {
  private _onesignalId: string;

  get onesignalId() {
    return this._onesignalId;
  }

  constructor(
    private oneSignal: OneSignal,
    private router: Router,
    private _ngZone: NgZone,
    private platform: Platform
  ) {}

  initialize() {
    this.oneSignal.startInit(
      environment.onesignal.appId,
      environment.firebaseConfig.messagingSenderId
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal.handleNotificationReceived().subscribe((notification) => {
      console.log('Recivido', notification);
    });

    this.oneSignal.handleNotificationOpened().subscribe((push) => {
      console.log('Abierto', push);

      this._ngZone.run(() =>
        this.router.navigate([
          '/orders',
          push.notification.payload.additionalData.orderId,
        ])
      );
    });

    this.oneSignal.getIds().then((info) => {
      this._onesignalId = info.userId;
    });

    this.oneSignal.endInit();
  }

  isAndroid() {
    return this.platform.is('android');
  }

  isCordova() {
    return this.platform.is('cordova');
  }
}
