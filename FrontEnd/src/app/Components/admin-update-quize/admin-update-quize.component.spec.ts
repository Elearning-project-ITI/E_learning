import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateQuizeComponent } from './admin-update-quize.component';

describe('AdminUpdateQuizeComponent', () => {
  let component: AdminUpdateQuizeComponent;
  let fixture: ComponentFixture<AdminUpdateQuizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateQuizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
