import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../user';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit
{
  private loginService = inject(LoginService);
  private userService = inject(UsersService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected isAdmin = this.loginService.isAdmin();

  //Colonnes affichées pour la table dans le html
  displayedColumns: string[] = ['login', 'firstName', 'roles', 'actions'];

  dataSource = new MatTableDataSource<User>();
  loading = false;
  userCompteur: number = 0;

  message = signal<string>('');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    //Vérifier que l'utilisateur est admin
    if(!this.loginService.isAdmin()) {
      this.router.navigate(['/livres']);
      return;
    }
    this.loadUsers();
  }

  loadUsers()
  {
    this.loading = true;
    this.cdr.detectChanges();

    this.userService.getListUser().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.userCompteur = users.length;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Utilisateurs chargés :', this.userCompteur);
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs :', error);
        this.loading = false;
        this.dataSource.data = [];
        this.userCompteur = 0;
        this.cdr.detectChanges();
        this.errorMessage.set('Erreur lors du chargement des utilisateurs.');
      }
    });
  }

  promoteUser(login: string, targetRole: string)
  {
    this.message.set('');
    this.errorMessage.set('');

    console.log(`Promotion de ${login} vers ${targetRole}`);

    this.loginService.promoteUser(login, targetRole).subscribe({
      next: (response) => {
        this.message.set(`${login} promu ${targetRole} avec succès !`);
        console.log('Promotion réussie :', response);
        
        //Recharger la liste des utilisateurs après la promotion
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur de promotion :', error);
        this.errorMessage.set('Erreur lors de la promotion.');
      }
    });
  }

  goToList(): void
  {
    this.router.navigate(['/livres']);
  }
}