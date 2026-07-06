import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListeLivres } from './liste-livres/liste-livres';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Ma bibliothèque');
}