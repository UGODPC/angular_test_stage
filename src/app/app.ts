import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from './paginator-intl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}]
})
export class App {
  protected readonly title = signal('Ma bibliothèque');
}