import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from './login';
import { Register } from './register';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private baseURL = "http://localhost:8080";
    constructor(private httpClient: HttpClient)
    {

    }

    onLogin(login: Login): Observable<any> {
        const payload = {
            loginName: login.loginName,
            loginPassword: login.password
        };

        return this.httpClient.post<string>(`${this.baseURL}/login`, payload, {
            responseType: 'text' as 'json' // <-- Indique que la réponse est du texte
        });
    }

    onRegister(register: Register): Observable<any> {
        const payload = {
            firstName: register.firstName,
            lastName: register.lastName,
            login: register.login,
            password: register.password

        };

        return this.httpClient.post<string>(`${this.baseURL}/login`, payload, {
            responseType: 'text' as 'json' // <-- Indique que la réponse est du texte
        });
    }
}