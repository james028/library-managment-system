import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Basedashboard } from './basedashboard';

describe('Basedashboard', () => {
  let component: Basedashboard;
  let fixture: ComponentFixture<Basedashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Basedashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Basedashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
