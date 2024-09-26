import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddQuizeComponent } from './admin-add-quize.component';

describe('AdminAddQuizeComponent', () => {
  let component: AdminAddQuizeComponent;
  let fixture: ComponentFixture<AdminAddQuizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddQuizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
