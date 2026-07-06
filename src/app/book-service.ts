import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({ providedIn: 'root' })
export class BookService {

    private baseURL = "http://localhost:8080/book/liste";
    constructor(private httpClient: HttpClient)
    {

    }

    getListeLivre(): Observable<Book[]>{
        return this.httpClient.get<Book[]>(`${this.baseURL}`);
    }
}
