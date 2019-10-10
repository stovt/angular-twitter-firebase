import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninSocialComponent } from './signin-social.component';

describe('SigninSocialComponent', () => {
  let component: SigninSocialComponent;
  let fixture: ComponentFixture<SigninSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SigninSocialComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
