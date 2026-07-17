import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { get } from 'http';

@Injectable({ providedIn: 'root' })
export class UsersService
{
    private baseURL = "http://localhost:8080";

    constructor(private httpClient: HttpClient) {

    }

    getListUser(): Observable<any>
    {
        return this.httpClient.get<User[]>(`${this.baseURL}/users`);
    }
}