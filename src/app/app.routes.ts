import { Routes, RouterModule } from '@angular/router';
import { ListeLivres } from './liste-livres/liste-livres';
import { Router } from 'express';

export const routes: Routes = [
    {path: 'livres', component: ListeLivres}, //livres pour l'URL et component qui sera affiché
    {path: '', redirectTo: 'livres', pathMatch: 'full'} //Si le lien c'est juste localhost:4200, on renvoie vers /livres et le chemin match à 100%
];