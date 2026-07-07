// liste-livres.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../book-service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  // Observable pour les livres
  books$!: Observable<Book[]>;
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(() => {
      this.books$ = this.bookService.getListeLivre();
    });
  }


  updateBook(id: number)
  {
      this.router.navigate(['update-book', id]);
  }

  deleteBook(id: number)
  {
    this.bookService.deleteLivre(id).subscribe({
      next: (data) =>
      {
        this.cdr.detectChanges();
        console.log(data);
      },
      error: (error) =>
      {
        console.error('Erreur lors de la suppression du livre :', error);
      }
    });
  }
}