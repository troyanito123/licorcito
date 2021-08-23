import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from 'src/app/state/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  user: User;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.userSubs = this.store
      .select('auth')
      .subscribe(({ user }) => (this.user = user));
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
