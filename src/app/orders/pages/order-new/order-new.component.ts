import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OrderPopoverComponent } from '../../components/order-popover/order-popover.component';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent implements OnInit {
  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  openPopover() {
    console.log('abriendo popover');
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: OrderPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios',
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }
}
