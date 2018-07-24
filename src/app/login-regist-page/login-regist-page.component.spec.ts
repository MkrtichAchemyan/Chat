import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegistPageComponent } from './login-regist-page.component';

describe('LoginRegistPageComponent', () => {
  let component: LoginRegistPageComponent;
  let fixture: ComponentFixture<LoginRegistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRegistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
