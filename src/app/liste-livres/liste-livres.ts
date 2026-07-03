import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Book } from '../book';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit {

  books: Book[] = [];

  ngOnInit(): void {
    this.books = [
      {
        "id": 1,
        "name": "Harry Potter à l'École des Sorciers",
        "pages": 223
      },
      {
        "id": 2,
        "name": "Harry Potter et la Chambre des Secrets",
        "pages": 364
      },
      {
        "id": 3,
        "name": "Harry Potter et le Prisonnier d'Azkaban",
        "pages": 474
      }
    ];
  }
}