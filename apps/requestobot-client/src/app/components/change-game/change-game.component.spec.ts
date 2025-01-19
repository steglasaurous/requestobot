import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeGameComponent } from './change-game.component';

describe('ChangeGameComponent', () => {
  let component: ChangeGameComponent;
  let fixture: ComponentFixture<ChangeGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
