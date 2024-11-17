import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { LoadingInterceptor } from "./_interceptors/loading.interceptor";
import { SharedModule } from "./_modules/shared.module";
import { routes } from "./app.routes";
import { provideRouter } from "@angular/router";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideToastr({
            positionClass: 'toast-botton-right'
        }),
        importProvidersFrom(BrowserModule, FormsModule, SharedModule),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
}