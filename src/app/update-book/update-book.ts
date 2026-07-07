import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../book-service';
import { inject } from '@angular/core';
import { error } from 'console';

@Component({
  selector: 'app-update-book',
  imports: [FormsModule],
  templateUrl: './update-book.html',
  styleUrl: './update-book.css',
})
export class UpdateBook implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number = 0;
  book: Book = new Book();

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.bookService.getBookById(this.id).subscribe({
      next: (data) => {
        this.book = data;
      },
      error: (error) => {
        console.log(error);
      } 
    });
  }

  goToListeLivre()
  {
    this.router.navigate(['/livres']);
  }

  onSubmit()
  {
    this.bookService.updateLivre(this.id, this.book).subscribe({
      next: (data) => {
        console.log('Livre mis à jour :', data);
        this.goToListeLivre();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour :', error);
      }
    });
  }
}