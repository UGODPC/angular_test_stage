import { Component, signal, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from './paginator-intl';
import { LoginService } from './login-service'; // ← IMPORTER LE SERVICE
import { Router } from '@angular/router'; // ← POUR LA REDIRECTION
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}]
})
export class App implements OnInit, OnDestroy {
  public loginService = inject(LoginService);
  private router = inject(Router);
  private platformID = inject(PLATFORM_ID);

  protected readonly isLoggedIn = this.loginService.isLoggedIn;
  protected readonly title = signal('Ma bibliothèque');

  ngOnInit(): void
  {
    if(isPlatformBrowser(this.platformID))
    {
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }
  }

  ngOnDestroy(): void
  {
    if(isPlatformBrowser(this.platformID))
    {
      window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }
  }

  //Méthode de déconnexion
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/authentification']);
  }

  //Vérifier si l'utilisateur est connecté (pour afficher/masquer le bouton)
  isAuthenticated(): boolean {
    return this.loginService.isAuthenticated();
  }

  getUserData(): any
  {
    return this.loginService.getUserData(); //Un objet ou rien.
  }

  getAuthToken(): any
  {
    return this.loginService.getAuthToken();
  }

  isTokenValide()
  {
    return this.loginService.isTokenValid();
  }

  handleBeforeUnload(event: BeforeUnloadEvent)
  {
    if(this.isTokenValide())
    {
      return;
    }
    else
    {
      this.logout();
    }
  }
}