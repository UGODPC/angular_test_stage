import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';


@Injectable({ providedIn: 'root' })
export class BookService {

    private baseURL = "http://localhost:8080/book";

    constructor(private httpClient: HttpClient) {}

    getListeLivre(): Observable<Book[]>{
        return this.httpClient.get<Book[]>(`${this.baseURL}/liste`);
    }

    getBookById(id: number): Observable<Book>
    {
        return this.httpClient.get<Book>(`${this.baseURL}/${id}`);
    }

    createLivre(book: Book): Observable<any>
    {
        const payload = {
            bookName: book.name,
            bookPages: book.pages
        };
        return this.httpClient.post<string>(`${this.baseURL}`, payload, {
            responseType: 'text' as 'json' // <-- Indique que la réponse est du texte
        });
    }

    updateLivre(id: number, book: Book): Observable<any>
    {
        const payload = {
            bookName: book.name,
            bookPages: book.pages
        };

        return this.httpClient.put(`${this.baseURL}/update/${id}`, payload, {
            responseType: 'text' as 'json'
        });
    }

    deleteLivre(id: number): Observable<any>
    {
        return this.httpClient.delete(`${this.baseURL}/delete/${id}`, {
            responseType: 'text' as 'json'
        });
    }
}
