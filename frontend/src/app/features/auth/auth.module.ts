import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.modules';

@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, AuthRoutingModule, LoginComponent],
})
export class AuthModule {}
