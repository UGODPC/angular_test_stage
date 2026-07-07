// liste-livres.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../book-service';
import { Router } from '@angular/router';

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
  
  // Observable pour les livres
  books$!: Observable<Book[]>;
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(() => {
      this.books$ = this.bookService.getListeLivre();
    });
  }

  updateBook(id: Number)
  {
      this.router.navigate(['update-book', id]);
  }
}