
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { catchError, Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule, CommonModule, ProgressSpinnerModule, MessageModule],
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  errorMessage: string = '';
  email: string = '';
  password: string = '';

  constructor(public authService: AuthService) {
    this.authStatusSub = new Subscription();
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onLogin() {
    if (!this.email || !this.password) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    setTimeout(() => {
      this.authService.login(this.email, this.password)
      .pipe(
        catchError(error => {
          if (error.status === 0) {
            this.errorMessage = 'Fail to fetch server';
          } else {
            this.errorMessage = error.error.message;
          }
          throw error;
        })
      ).subscribe();
    }, 800);
  }
}
