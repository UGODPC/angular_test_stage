import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListeLivres } from './liste-livres/liste-livres';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListeLivres],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-frontend');
}
