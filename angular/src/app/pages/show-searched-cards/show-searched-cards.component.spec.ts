import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSearchedCardsComponent } from './show-searched-cards.component';

describe('ShowSearchedCardsComponent', () => {
  let component: ShowSearchedCardsComponent;
  let fixture: ComponentFixture<ShowSearchedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSearchedCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSearchedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
