import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOffersComponent } from './search-offers.component';

describe('SearchOffersComponent', () => {
  let component: SearchOffersComponent;
  let fixture: ComponentFixture<SearchOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
