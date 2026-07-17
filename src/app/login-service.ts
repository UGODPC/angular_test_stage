import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Register } from './register';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private baseURL = "http://localhost:8080";
    private TOKEN_KEY = 'jwt_token';
    private USER_KEY = 'user_data';
    private ROLES_KEY = 'user_roles';
    private PERMISSIONS_KEY = 'user_permissions';

    //SIGNAL POUR L'ÉTAT D'AUTHENTIFICATION
    private authStatus = signal<boolean>(false);
    public readonly isLoggedIn = this.authStatus.asReadonly();


    constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object)
    {
        this.authStatus.set(this.isAuthenticated());
    }

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

    setAuthToken(token: string): void
    {
        if(this.isBrowser())
        {
            localStorage.setItem(this.TOKEN_KEY, token);
            this.authStatus.set(true); //Met le signal à jour
        }
    }

    removeAuthToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.ROLES_KEY);
        localStorage.removeItem(this.PERMISSIONS_KEY);
        this.authStatus.set(false);
    }

    isAuthenticated(): boolean
    {
        return !!this.getAuthToken(); //L'inverse, non-nullable
    }

    getUserData(): any {
        const data = localStorage.getItem(this.USER_KEY);
        return data ? JSON.parse(data) : null; //Un objet ou rien.
    }

    setUserData(user: any): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user)); //stringify transforme la valeur user en un JSON

        if(user.roles)
        {
            localStorage.setItem(this.ROLES_KEY, JSON.stringify(user.roles));
        }
        if(user.permissions)
        {
            localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(user.permissions));
        }
    }

    // ========== MÉTHODES POUR LES RÔLES ET PERMISSIONS ==========

    getUserRoles(): string[] {
        if (!this.isBrowser()) return [];
        const roles = localStorage.getItem(this.ROLES_KEY);
        return roles ? JSON.parse(roles) : [];
    }

    getUserPermissions(): string[] {
        if (!this.isBrowser()) return [];
        const permissions = localStorage.getItem(this.PERMISSIONS_KEY);
        return permissions ? JSON.parse(permissions) : [];
    }

    hasRole(role: string): boolean {
        return this.getUserRoles().includes(role);
    }

    hasPermission(permission: string): boolean {
        return this.getUserPermissions().includes(permission);
    }

    isGuest(): boolean {
        return this.hasRole('ROLE_GUEST');
    }

    isUser(): boolean {
        return this.hasRole('ROLE_USER');
    }

    isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    promoteUser(login: string, targetRole: string): Observable<any>
    {
        return this.httpClient.post<any>(`${this.baseURL}/promote/${login}?targetRole=${targetRole}`, {})
        .pipe(tap((response: any) => {
                if(response && response.token)
                {
                    // ✅ Mettre à jour le token et les données
                    this.setAuthToken(response.token);
                    this.setUserData(response);
                    console.log(`✅ Utilisateur promu ${targetRole}`);
                }
            })
        );
    }

    // ========== APPELS HTTP ==========

    //Connexion - avec stockage automatique du token
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

    logout(): void {
        this.removeAuthToken();
        console.log('Déconnexion - Token supprimé');
    }
}