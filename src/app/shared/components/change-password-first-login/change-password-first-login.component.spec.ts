import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordFirstLoginComponent } from './change-password-first-login.component';

describe('ChangePasswordFirstLoginComponent', () => {
  let component: ChangePasswordFirstLoginComponent;
  let fixture: ComponentFixture<ChangePasswordFirstLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordFirstLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
