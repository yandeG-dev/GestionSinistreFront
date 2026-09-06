import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssureComponent } from './create-assure.component';

describe('CreateAssureComponent', () => {
  let component: CreateAssureComponent;
  let fixture: ComponentFixture<CreateAssureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAssureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
