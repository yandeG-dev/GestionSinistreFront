import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRemboursementComponent } from './liste-remboursement.component';

describe('ListeRemboursementComponent', () => {
  let component: ListeRemboursementComponent;
  let fixture: ComponentFixture<ListeRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeRemboursementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
