import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User, UserRole } from './models/user.model';
import { AuthService } from './services/auth.service';
import { OnesignalService } from './services/onesignal.service';
import { AppState } from './state/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUser: User;

  constructor(
    public authService: AuthService,
    private router: Router,
    private onesignalService: OnesignalService,
    private store: Store<AppState>
  ) {
    this.authService.initAuthListener();
    if (this.onesignalService.isCordova()) {
      this.onesignalService.initialize();
    }
    this.store
      .select('auth')
      .subscribe(({ user }) => (this.currentUser = user));
  }

  logout() {
    this.authService.logout().then((res) => this.router.navigate(['auth']));
  }
}
