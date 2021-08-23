import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AppState } from '../state/app.reducer';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class OrderNewGuard implements CanActivate {
  cartEmpty = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private utilService: UtilsService
  ) {}

  canActivate() {
    return this.store.select('cart').pipe(
      map(({ cant }) => cant > 0),
      tap((res) => {
        if (!res) {
          this.router.navigate(['/home']).then(async () => {
            const toast = await this.utilService.createToast(
              'No hay nada en su carrito!'
            );
            toast.present();
          });
        }
      })
    );
  }
}
