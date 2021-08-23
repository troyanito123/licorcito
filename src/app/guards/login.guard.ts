import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilsService
  ) {}

  canActivate() {
    return this.authService.isAuth().pipe(
      map((success) => !success),
      tap((success) => {
        if (!success) {
          this.router.navigate(['/auth/profile']).then(async () => {
            const toast = await this.utilService.createToast(
              'Antes de continuar primero haz un LOGOUT!'
            );
            toast.present();
          });
        }
      })
    );
  }
}
