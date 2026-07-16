import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from './paginator-intl';
import { LoginService } from './login-service'; // ← IMPORTER LE SERVICE
import { Router } from '@angular/router'; // ← POUR LA REDIRECTION

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}]
})
export class App {
  private loginService = inject(LoginService);
  private router = inject(Router);

  private USER_KEY = 'user_data';

  protected readonly title = signal('Ma bibliothèque');

  //Méthode de déconnexion
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/authentification']);
  }

  //Vérifier si l'utilisateur est connecté (pour afficher/masquer le bouton)
  isAuthenticated(): boolean {
    return this.loginService.isAuthenticated();
  }

  getUserData(): any {
        const data = localStorage.getItem(this.USER_KEY);
        return data ? JSON.parse(data) : null; //Un objet ou rien.
    }
}