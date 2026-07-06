import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book-service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  imports: [FormsModule],
  templateUrl: './create-book.html',
  styleUrl: './create-book.css',
})
export class CreateBook implements OnInit {

  book: Book = new Book();
  successMessage: string = '';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    
  }

  saveLivre() {
    this.bookService.createLivre(this.book).subscribe({
      next: (data) => {
        console.log('Livre créé :', data);
        this.successMessage = 'Livre créé avec succès !';
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
    this.goToListeLivre();
  }
}
