import { Component, OnInit, inject, ChangeDetectorRef, AfterViewInit, ViewChild, SchemaMetadata } from '@angular/core';
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
import { LoginService } from '../login-service';

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
  public loginService = inject(LoginService);
  
  dataSource = new MatTableDataSource<Book>();
  displayedColumns: string[] = ['id', 'name', 'pages', 'actions'];

  filterName: string = '';
  filterMinPages: number | null = null;
  filterMaxPages: number | null = null;

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
      this.dataSource.paginator = this.paginator; //paginator vient avec dataSource du MatTableDataSource
    }
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this); //filterPredicate vient du MatTableDataSource
    
    console.log("Paginator connecté.");
  }

  loadBooks() {
    this.loading = true;
    this.cdr.detectChanges();

    this.bookService.getListeLivre().subscribe({
      next: (books) => {
        this.dataSource.data = books; //data vient du MatTableDataSource
        this.livreCompteur = books.length; //Pour le nombre total de livres
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
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent)
  {
    //console.log('handlePageEvent', pageEvent);
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
  }

  updateBook(id: number)
  {
    this.router.navigate(['update-book', id]);
  }

  deleteBook(id: number)
  {
    //VÉRIFIER LA PERMISSION À L'INITIALISATION
    if(!this.loginService.hasPermission('BOOK_UPDATE'))
    {
        alert("Vous n'avez pas les droits pour supprimer un livre !");
        this.router.navigate(['/livres']);
        return;
    }
    else if(!confirm('Voulez-vous vraiment supprimer ce livre ?'))
    {
      return;
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

  customFilterPredicate(data: Book, filter: string): boolean
  {
    let matches = true;

    //Filtre par nom
    if(this.filterName && this.filterName.trim())
    {
      const searchTerm = this.filterName.toLowerCase().trim(); //On assigne une variable au nom que l'on tappe dans le filtrage.
      matches = matches && data.name.toLowerCase().includes(searchTerm); //C'est la qu'on assigne plus ou moins le filtre à un champs exacte dans la table.
    }

    //Filtre par pages minimum
    if(this.filterMinPages !== null && this.filterMinPages > 0)
    {
      matches = matches && data.pages >= this.filterMinPages;
    }

    //Filtre par pages maximum
    if(this.filterMaxPages !== null && this.filterMaxPages > 0)
    {
      matches = matches && data.pages <= this.filterMaxPages;
    }

    return matches;
  }

  private applyFilters(): void {
    //Déclencher le filtrage (le filterPredicate utilise les variables de classe)
    this.dataSource.filter = 'trigger'; //N'importe quelle valeur non vide pour déclencher et filter vient du MatTableDataSource
  }

  //Filtre par nom
  applyNameFilter(event: Event)
  {
    const value = (event.target as HTMLInputElement).value;
    this.filterName = value;
    this.applyFilters();

    if(this.paginator)
    {
      this.paginator.firstPage();
    }
  }

  //Filtre par pages minimum
  applyMinPagesFilter(event: Event)
  {
    const value = (event.target as HTMLInputElement).value;
    this.filterMinPages = value ? parseInt(value, 10) : null;
    //Le parseInt(value, 10) c'est pour passer la string "value" à un int et 10 c'est pour la base (en l'occurence base 10 pour les entiers)
    this.applyFilters();

    if(this.paginator)
    {
      this.paginator.firstPage(); //En gros, retourner à la page 1 si on est pas déjà dessus.
    }
  }

  //Filtre par pages maximum
  applyMaxPagesFilter(event: Event)
  {
    const value = (event.target as HTMLInputElement).value;
    this.filterMaxPages = value ? parseInt(value, 10) : null;
    this.applyFilters();

    if(this.paginator)
    {
      this.paginator.firstPage();
    }
  }

  exportToExcel()
  {
    //1. Construire le contenu HTML du fichier Excel
    //filterData vinet du MatTableData
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Livres</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            th { 
              background-color: #4472C4; 
              color: #FFFFFF; 
              font-weight: bold;
              padding: 8px;
              text-align: center;
            }
            td { 
              padding: 8px;
              border: 1px solid #CCCCCC;
            }
            .number { 
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h2>Liste des livres</h2>
          <p><strong>Exporté le :</strong> ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Pages</th>
              </tr>
            </thead>
            <tbody>
              ${this.dataSource.filteredData.map(book => `
                <tr>
                  <td class="number">${book.id}</td>
                  <td>${this.escapeHtml(book.name)}</td>
                  <td class="number">${book.pages}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>Total : ${this.dataSource.filteredData.length} livre(s)</strong></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    //2. Créer le Blob
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });

    //3. Télécharger le fichier
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `livres_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  //Sécuriser les caractères HTML
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}