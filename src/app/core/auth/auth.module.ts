import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'src/app/core/auth/guard/auth.guard';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MainGuard } from 'src/app/core/auth/guard/main.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/core/interceptor/token.interceptor';

@NgModule({
  declarations: [],
  providers: [
    AuthGuard,
    MainGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [

  ]
})
export class AuthModule { }
