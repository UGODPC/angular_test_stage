import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book-service';
import { error } from 'console';
import { Router } from '@angular/router';
import { LoginService } from '../login-service';

@Component({
  selector: 'app-create-book',
  imports: [FormsModule],
  templateUrl: './create-book.html',
  styleUrl: './create-book.css',
})
export class CreateBook implements OnInit {
  private loginService = inject(LoginService);
  private router = inject(Router);

  book: Book = new Book();
  successMessage: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    //VÉRIFIER LA PERMISSION À L'INITIALISATION
    if(!this.loginService.hasPermission('BOOK_CREATE'))
    {
      alert("Connectez-vous pour créer un livre !");
      this.router.navigate(['/livres']);
    }
  }

  saveLivre() {
    this.bookService.createLivre(this.book).subscribe({
      next: (data) => {
        console.log('Livre créé :', data);
        this.successMessage = 'Livre créé avec succès !';
        this.goToListeLivre();
      },
      error: (error) => {
        console.error('Erreur lors de la création :', error);
      }
    });
  }

  goToListeLivre()
  {
    this.router.navigate(['/livres']);
  }

  onSubmit()
  {
    console.log(this.book);
    this.saveLivre();
  }
}
