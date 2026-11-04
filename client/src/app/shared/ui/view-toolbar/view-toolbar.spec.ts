import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewToolbar } from './view-toolbar';

describe('ViewToolbar', () => {
  let component: ViewToolbar;
  let fixture: ComponentFixture<ViewToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
