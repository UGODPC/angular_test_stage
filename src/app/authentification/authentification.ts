import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css',
})
export class Authentification implements OnInit {
  data: string[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // ✅ Syntaxe HttpClient (Observable)
    this.http.get<string[]>('http://localhost:8080/messages')
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('✅ Données reçues :', this.data);
        },
        error: (error) => {
          console.error('❌ Erreur :', error);
          this.errorMessage = 'Erreur lors du chargement des messages.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}