import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Login } from './login';
import { Register } from './register';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private baseURL = "http://localhost:8080";
    private TOKEN_KEY = 'jwt_token';
    private USER_KEY = 'user_data';


    constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

    // ========== GESTION DU TOKEN ==========

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
    
    getAuthToken(): string | null {
        // ✅ Vérifier si on est dans le navigateur
        if(this.isBrowser())
        {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null; // Retourne null côté serveur
    }

    setAuthToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeAuthToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }

    getUserData(): any {
        const data = localStorage.getItem(this.USER_KEY);
        return data ? JSON.parse(data) : null; //Un objet ou rien.
    }

    setUserData(user: any): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user)); //stringify transforme la valeur user en un JSON
    }

    // ========== APPELS HTTP ==========

    /* Connexion - avec stockage automatique du token */
    onLogin(credentials: { login: string, password: string }): Observable<any> {
        //Le backend attend CredentialsDTO avec "login" et "password"
        return this.httpClient.post<any>(`${this.baseURL}/login`, {
            login: credentials.login,
            password: credentials.password
        }).pipe(
            tap((response: any) => {
                //Si le backend renvoie un token, on le stocke
                if(response && response.token) //Si y'a une réponse et un token donné
                {
                    this.setAuthToken(response.token);
                    this.setUserData(response);
                    console.log('Token JWT stocké');
                }
            })
        );
    }

    onRegister(register: Register): Observable<any> {
        return this.httpClient.post<any>(`${this.baseURL}/register`, {
            firstName: register.firstName,
            lastName: register.lastName,
            login: register.login,
            password: register.password
        });
    }

    /* Déconnexion*/
    logout(): void {
        this.removeAuthToken();
        console.log('👋 Déconnexion - Token supprimé');
    }
}