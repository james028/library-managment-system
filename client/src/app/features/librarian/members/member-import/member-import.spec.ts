import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberImport } from './member-import';

describe('MemberImport', () => {
  let component: MemberImport;
  let fixture: ComponentFixture<MemberImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberImport],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberImport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
