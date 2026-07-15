import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from './login-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const loginService = inject(LoginService);
    
    //Vérifier qu'on est dans le navigateur avant d'accéder au token
    if(typeof window !== 'undefined' && typeof localStorage !== 'undefined')
    {
        // Si la window et le localStorage ne sont pas de type undefined on appelle getAuthToken du loginService.
        const token = loginService.getAuthToken();
        
        if(token)
        {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next(cloned);
        }
    }
    return next(req);
};