import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ProductCart } from 'src/app/models/product-cart';
import {
  decrementProduct,
  incrementProduct,
  removeProduct,
} from 'src/app/state/actions/cart.action';

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss'],
})
export class CartProductComponent implements OnInit {
  @Input() product: ProductCart;

  constructor(private store: Store, private alertController: AlertController) {}

  ngOnInit() {}

  incrementCant(product: ProductCart) {
    this.store.dispatch(incrementProduct({ product }));
  }

  decrementCant(product: ProductCart) {
    if (product.subtotal > product.price) {
      this.store.dispatch(decrementProduct({ product }));
    } else {
      this.removeFromCart(product);
    }
  }

  private async removeFromCart(product: ProductCart) {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Estás seguro que quieres eliminar este producto?',
      buttons: [
        {
          text: 'Si',
          handler: () => this.store.dispatch(removeProduct({ product })),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }
}
