import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginForm } from '../login-form/login-form';
import { LoginService } from '../login-service';
import { Login } from '../login';
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
  
  message: string = '';
  errorMessage: string = '';

  handleLogin(credentials: { login: string, password: string }) {
    this.message = '';
    this.errorMessage = '';
    
    const loginData = new Login(credentials.login, credentials.password);
    
    this.loginService.onLogin(loginData).subscribe({
      next: (response) => {
        // Si le backend renvoie un token ou des données utilisateur
        this.message = 'Connexion réussie !';
        console.log('✅ Connexion réussie :', response);
        
        // Rediriger vers la liste des livres après connexion
        setTimeout(() => this.router.navigate(['/livres']), 1000);
      },
      error: (error) => {
        console.error('❌ Erreur de connexion :', error);
        this.errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
      }
    });
  }

  handleRegister(userData: { firstName: string, lastName: string, login: string, password: string }) {
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
        console.log('✅ Inscription réussie :', response);
      },
      error: (error) => {
        console.error('❌ Erreur d\'inscription :', error);
        this.errorMessage = 'Échec de l\'inscription. Ce login est peut-être déjà utilisé.';
      }
    });
  }
}