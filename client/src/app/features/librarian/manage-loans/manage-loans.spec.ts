import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoans } from './manage-loans';

describe('ManageLoans', () => {
  let component: ManageLoans;
  let fixture: ComponentFixture<ManageLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLoans],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageLoans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
