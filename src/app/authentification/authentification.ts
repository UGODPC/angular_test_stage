import { Component, inject, OnInit } from '@angular/core';
import { Axios } from '../axios';
import { response } from 'express';

@Component({
  selector: 'app-authentification',
  imports: [],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css',
})
export class Authentification implements OnInit {
  data: string[] = [];

  axiosService = inject(Axios);

  ngOnInit(): void {
    this.axiosService.request("GET", "/messages", "").then((response) => this.data = response.data) //à voir si besoin de modifier !
  }
}
