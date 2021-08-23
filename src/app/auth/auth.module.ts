import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthButtonsComponent } from './components/auth-buttons/auth-buttons.component';
import { AuthLogoComponent } from './components/auth-logo/auth-logo.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AuthButtonsComponent,
    AuthLogoComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, IonicModule, ReactiveFormsModule],
})
export class AuthModule {}
