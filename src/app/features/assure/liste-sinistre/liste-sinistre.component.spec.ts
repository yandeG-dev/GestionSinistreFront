import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSinistreComponent } from './liste-sinistre.component';

describe('ListeSinistreComponent', () => {
  let component: ListeSinistreComponent;
  let fixture: ComponentFixture<ListeSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
