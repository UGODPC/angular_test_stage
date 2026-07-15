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
        //Le backend attend CredentialsDTO avec "login" et "password"
        const payload = {
            login: login.loginName,
            password: login.password
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

        return this.httpClient.post<any>(`${this.baseURL}/register`, payload);
    }
}