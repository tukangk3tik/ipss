import { HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { AuthService } from "../../core/services/auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getAccessToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });

    return next.handle(authRequest);
  }
}
