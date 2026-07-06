// liste-livres.ts
import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // <-- Ajoute cet import

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit {
  books: Book[] = [];
  loading: boolean = false;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute // <-- Injecte ActivatedRoute
  ) { }

  ngOnInit(): void {
    // S'abonne aux changements de route
    this.route.params.subscribe(() => {
      this.getLivres(); // Recharge les données à chaque navigation
    });
  }

  private getLivres() {
    this.loading = true;
    this.bookService.getListeLivre().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
        console.log('Livres chargés :', this.books);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur :', err);
      }
    });
  }
}