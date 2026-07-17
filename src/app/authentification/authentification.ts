import { Component, inject, signal } from '@angular/core';
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

  protected message = signal<string>('');
  protected errorMessage = signal<string>('');

  handleLogin(credentials: { login: string, password: string }) {
    this.message.set('');
    this.errorMessage.set('');
    
    this.loginService.onLogin(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        this.message.set(`Bienvenue ${response.firstName || 'utilisateur'}, redirection...`);
        setTimeout(() => this.router.navigate(['/livres']), 1500); //Si la connexion réussie, envoyer l'utilisateur vers la liste des livres.
      },
      error: (error) => {
        console.error('Erreur :', error);
        if(error.status === 403 || error.status === 401) //Interdit ou Pas Authorisé
        {
          this.errorMessage.set('Identifiants incorrects.');
        }
        else
        {
          setTimeout(() => this.errorMessage.set('Erreur de connexion.'), 200);
        }
      }
    });
  }

  handleRegister(userData: { firstName: string, lastName: string, login: string, password: string })
  {
    this.message.set('');
    this.errorMessage.set('');
    
    const registerData = new Register(
      userData.firstName,
      userData.lastName,
      userData.login,
      userData.password
    );
    
    this.loginService.onRegister(registerData).subscribe({
      next: (response) => {
        this.message.set('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        console.log('Inscription réussie :', response);
      },
      error: (error) => {
        console.error('Erreur d\'inscription :', error);
        this.errorMessage.set('Ce login est peut-être déjà utilisé.');
      }
    });
  }

  logout()
  {
    this.loginService.logout();
    this.errorMessage.set('');
    this.message.set('');
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