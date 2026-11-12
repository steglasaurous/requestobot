import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SongPlayerComponent } from './song-player.component';

describe('SongPlayerComponent', () => {
  let component: SongPlayerComponent;
  let fixture: ComponentFixture<SongPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongPlayerComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(SongPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
