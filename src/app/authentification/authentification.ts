import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginForm } from '../login-form/login-form';
import { LoginService } from '../login-service'; // ← On garde LoginService
import { Register } from '../register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [CommonModule, LoginForm],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css',
})
export class Authentification {
  private loginService = inject(LoginService);
  private router = inject(Router);

  protected isLoggedIn = this.loginService.isLoggedIn;

  message: string = '';
  errorMessage: string = '';

  handleLogin(credentials: { login: string, password: string }) {
    this.message = '';
    this.errorMessage = '';
    
    this.loginService.onLogin(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        this.message = `Bienvenue ${response.firstName || 'utilisateur'} !`;
        setTimeout(() => this.router.navigate(['/livres']), 500); //Si la connexion réussie, envoyer l'utilisateur vers la liste des livres.
      },
      error: (error) => {
        console.error('Erreur :', error);
        if(error.status === 403 || error.status === 401) //Interdit ou Pas Authorisé
        {
          this.errorMessage = 'Identifiants incorrects.';
        }
        else
        {
          this.errorMessage = 'Erreur de connexion.';
        }
      }
    });
  }

  handleRegister(userData: { firstName: string, lastName: string, login: string, password: string })
  {
    this.message = '';
    this.errorMessage = '';
    
    const registerData = new Register(
      userData.firstName,
      userData.lastName,
      userData.login,
      userData.password
    );
    
    this.loginService.onRegister(registerData).subscribe({
      next: (response) => {
        this.message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        console.log('Inscription réussie :', response);
      },
      error: (error) => {
        console.error('Erreur d\'inscription :', error);
        this.errorMessage = 'Ce login est peut-être déjà utilisé.';
      }
    });
  }

  logout()
  {
    this.loginService.logout();
    this.router.navigate(['/authentification']);
  }

  isAuthenticated(): boolean
  {
    return this.loginService.isAuthenticated();
  }
  
  getUserData(): any
  {
    return this.loginService.getUserData();//Un objet ou rien.
  }
}