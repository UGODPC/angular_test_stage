import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../book-service';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  loading = false;
  currentPage = 0;
  livreCompteur: number = 0;

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(() => {
      this.loadBooks();
    });
  }

  handlePageEvent(pageEvent: PageEvent)
  {
    console.log('handlePageEvent', pageEvent);
    this.currentPage = pageEvent.pageIndex;
  }

  loadBooks() {
    this.loading = true;
    this.cdr.detectChanges();
    this.bookService.getListeLivre().subscribe({
      next: (books) => {
        this.books = books;
        this.livreCompteur = books.length; //Pour le nombre total de livres
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Livres chargés :', this.books.length);
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateBook(id: number)
  {
    this.router.navigate(['update-book', id]);
  }

  deleteBook(id: number)
  {
    if(!confirm('Voulez-vous vraiment supprimer ce livre ?')) //Confirm() permet de poser une question avec deux boutons.
    {
      return; //Si la confirmation est annulé, on ne fait rien.
    }

    this.bookService.deleteLivre(id).subscribe({
      next: (data) => {
        console.log('Livre supprimé :', data);
        this.loadBooks();        
      },
      error: (error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression du livre.');
      }
    });
  }
}