import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmimQuizeComponent } from './admim-quize.component';

describe('AdmimQuizeComponent', () => {
  let component: AdmimQuizeComponent;
  let fixture: ComponentFixture<AdmimQuizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmimQuizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmimQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
