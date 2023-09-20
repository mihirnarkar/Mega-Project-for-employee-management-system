import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employee1Component } from './employee1.component';

describe('Employee1Component', () => {
  let component: Employee1Component;
  let fixture: ComponentFixture<Employee1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Employee1Component]
    });
    fixture = TestBed.createComponent(Employee1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
