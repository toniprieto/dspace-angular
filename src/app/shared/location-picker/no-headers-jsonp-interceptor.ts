import { HttpEvent, HttpHandler, HttpHeaders, HttpRequest, JsonpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
/**
 * Interceptor para eliminar el header para las llamadas JsonP
 * (si no existe este interceptor se produce un error al cargar el script de google maps)
 * Se debe declarar al final
 */
export class NoHeadersJsonpInterceptor extends JsonpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.method === 'JSONP') {

          req = req.clone({
              headers: new HttpHeaders()
          });
        }

        return next.handle(req);
    }
}
