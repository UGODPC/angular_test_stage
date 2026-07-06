import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-book',
  imports: [FormsModule],
  templateUrl: './create-book.html',
  styleUrl: './create-book.css',
})
export class CreateBook implements OnInit {
  book: Book = new Book();
  constructor() {}

  ngOnInit(): void {
    
  }

  onSubmit()
  {
    console.log(this.book);
  }
}
