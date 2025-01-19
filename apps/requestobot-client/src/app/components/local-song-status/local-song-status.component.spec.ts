import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalSongStatusComponent } from './local-song-status.component';

describe('LocalSongStatusComponent', () => {
  let component: LocalSongStatusComponent;
  let fixture: ComponentFixture<LocalSongStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalSongStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalSongStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
