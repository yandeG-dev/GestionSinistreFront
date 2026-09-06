import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAssureComponent } from './liste-assure.component';

describe('ListeAssureComponent', () => {
  let component: ListeAssureComponent;
  let fixture: ComponentFixture<ListeAssureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAssureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAssureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
