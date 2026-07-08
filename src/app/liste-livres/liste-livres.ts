import { Component, OnInit, inject, ChangeDetectorRef, AfterViewInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, SchemaMetadata } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../book-service';
import { Router } from '@angular/router';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatFormField } from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-liste-livres',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatFormField, MatInputModule],
  templateUrl: './liste-livres.html',
  styleUrl: './liste-livres.css',
})
export class ListeLivres implements OnInit, AfterViewInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  dataSource = new MatTableDataSource<Book>();

  displayedColumns: string[] = ['id', 'name', 'pages', 'actions'];

  books: Book[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 5; //Toujours 5 au départ
  livreCompteur: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(() => {
      this.loadBooks();
    });
  }


  ngAfterViewInit() {
    if(this.paginator)
    {
      this.dataSource.paginator = this.paginator;
    }
    console.log("Paginator connecté.");
  }

  loadBooks() {
    this.loading = true;
    this.cdr.detectChanges();

    this.bookService.getListeLivre().subscribe({
      next: (books) => {
        this.dataSource.data = books;
        this.livreCompteur = books.length; //Pour le nombre total de livres
        //console.log(this.dataSource);
        this.loading = false;
        this.cdr.detectChanges(); //à modifier avec un timeout si jamais ??
        console.log('Livres chargés :', this.livreCompteur);
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.loading = false;
        this.dataSource.data = [];
        this.livreCompteur = 0;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return(data.name.toLowerCase().startsWith(filter));
          //En gros pour filtrer sur les noms seulement et qui commencent par ce que je rentre dans la recherche de filtre
        }
        console.log("Data loadé dans le bon !");
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent)
  {
    console.log('handlePageEvent', pageEvent);
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}