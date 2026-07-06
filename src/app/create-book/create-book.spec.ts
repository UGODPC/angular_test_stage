import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBook } from './create-book';

describe('CreateBook', () => {
  let component: CreateBook;
  let fixture: ComponentFixture<CreateBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBook],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
