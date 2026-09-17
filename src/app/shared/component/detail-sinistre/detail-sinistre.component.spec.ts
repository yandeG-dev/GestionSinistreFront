import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSinistreComponent } from './detail-sinistre.component';

describe('DetailSinistreComponent', () => {
  let component: DetailSinistreComponent;
  let fixture: ComponentFixture<DetailSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
