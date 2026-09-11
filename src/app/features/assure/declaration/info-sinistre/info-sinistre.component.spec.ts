import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSinistreComponent } from './info-sinistre.component';

describe('InfoSinistreComponent', () => {
  let component: InfoSinistreComponent;
  let fixture: ComponentFixture<InfoSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
