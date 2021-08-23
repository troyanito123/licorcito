import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilsService
  ) {}

  canActivate() {
    return this.authService.isAuth().pipe(
      tap((success) => {
        if (!success) {
          this.router.navigate(['/auth/login']).then(async () => {
            const toast = await this.utilService.createToast(
              'Antes de continuar, primero accede a la aplicacion'
            );
            toast.present();
          });
        }
      })
    );
  }
  canLoad() {
    return this.authService.isAuth().pipe(
      tap((success) => {
        if (!success) {
          this.router.navigate(['/auth/login']).then(async () => {
            const toast = await this.utilService.createToast(
              'Antes de continuar, primero accede a la aplicacion'
            );
            toast.present();
          });
        }
      }),
      take(1)
    );
  }
}
