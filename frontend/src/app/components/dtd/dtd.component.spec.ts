import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtdComponent } from './dtd.component';

describe('DtdComponent', () => {
  let component: DtdComponent;
  let fixture: ComponentFixture<DtdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
