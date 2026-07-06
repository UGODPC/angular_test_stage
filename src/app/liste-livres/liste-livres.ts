import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book-service';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit {

  books: Book[] = [];

  constructor(private bookService: BookService)
  {

  }

  ngOnInit(): void {
    this.getLivres();
  }

  private getLivres()
  {
    this.bookService.getListeLivre().subscribe(data => { 
      this.books = data;
    });
  }
}

//S'abonne à l'Observable pour recevoir les données quand elles arrivent.
//data : Les données reçues de l'API (devrait être un tableau de Book).
//this.books = data : Met à jour la propriété books avec les données reçues.
//Angular détecte automatiquement ce changement et met à jour le template HTML.