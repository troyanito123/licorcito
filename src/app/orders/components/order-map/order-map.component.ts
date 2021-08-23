import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as L from 'leaflet';

import { Subscription } from 'rxjs';
import { Location } from 'src/app/interfaces/order';
import {
  setLocation,
  unsetLocation,
} from 'src/app/state/actions/location.action';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-order-map',
  templateUrl: './order-map.component.html',
  styleUrls: ['./order-map.component.scss'],
})
export class OrderMapComponent implements OnInit, OnDestroy {
  orderMapLeaf: L.Map;

  @Input() location: Location = { lng: null, lat: null };

  private defaultLocation: Location = {
    lng: -66.15689346418048,
    lat: -17.393779843949304,
  };

  currentLocation: Location = {
    lng: null,
    lat: null,
  };

  locationSubs: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.createMapLeaf();
    this.locationSubs = this.store
      .select('location')
      .subscribe(({ lng, lat }) => {
        this.currentLocation.lng = lng;
        this.currentLocation.lat = lat;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(unsetLocation());
    this.locationSubs?.unsubscribe();
  }

  private createMapLeaf() {
    this.orderMapLeaf = L.map('orderMap', {
      center: this.location.lat
        ? [this.location.lat, this.location.lng]
        : [this.defaultLocation.lat, this.defaultLocation.lng],
      zoom: 16,
      renderer: L.canvas(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.orderMapLeaf
    );

    if (this.location.lat) {
      this.createMarkFixedLeafLet();
    } else {
      this.createMarkWithDragLeafLet();
    }

    setTimeout(() => {
      this.orderMapLeaf.invalidateSize();
    }, 100);
  }

  private createMarkWithDragLeafLet() {
    const marker = L.marker(
      [this.defaultLocation.lat, this.defaultLocation.lng],
      {
        draggable: true,
        icon: L.icon({ iconUrl: 'assets/icon-mark.png', iconSize: [60, 60] }),
      }
    )
      .addEventListener('dragend', (e) => {
        this.store.dispatch(
          setLocation({
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
          })
        );
      })
      .addTo(this.orderMapLeaf);
  }

  private createMarkFixedLeafLet() {
    const { lat, lng } = this.location;
    L.marker([lat, lng], {
      icon: L.icon({ iconUrl: 'assets/icon-mark.png', iconSize: [60, 60] }),
    }).addTo(this.orderMapLeaf);
  }

  flyToCenter() {
    if (this.location.lat) {
      this.orderMapLeaf.flyTo([this.location.lat, this.location.lng]);
    } else {
      this.orderMapLeaf.flyTo([
        this.defaultLocation.lat,
        this.defaultLocation.lng,
      ]);
    }
  }
}
