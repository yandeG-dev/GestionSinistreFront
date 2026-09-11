import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesJustificativesComponent } from './pieces-justificatives.component';

describe('PiecesJustificativesComponent', () => {
  let component: PiecesJustificativesComponent;
  let fixture: ComponentFixture<PiecesJustificativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiecesJustificativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiecesJustificativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
