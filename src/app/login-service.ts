import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from './login';
import { Register } from './register';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private baseURL = "http://localhost:8080";
    
    constructor(private httpClient: HttpClient) { }

    onLogin(login: Login): Observable<any> {
        // ✅ Le backend attend CredentialsDTO avec "login" et "password"
        const payload = {
            login: login.loginName,   // ← "login" pas "loginName"
            password: login.password  // ← "password" pas "loginPassword"
        };

        return this.httpClient.post<any>(`${this.baseURL}/login`, payload);
    }

    onRegister(register: Register): Observable<any> {
        const payload = {
            firstName: register.firstName,
            lastName: register.lastName,
            login: register.login,
            password: register.password
        };

        // ✅ Correction : l'URL doit être /register, pas /login
        return this.httpClient.post<any>(`${this.baseURL}/register`, payload);
    }
}