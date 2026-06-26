import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SongDto } from '@requestobot/util-dto';
import { LocalSongStatusComponent } from './local-song-status.component';

describe('LocalSongStatusComponent', () => {
  let component: LocalSongStatusComponent;
  let fixture: ComponentFixture<LocalSongStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalSongStatusComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalSongStatusComponent);
    component = fixture.componentInstance;
    component.song = {
      id: 1,
      title: 'title',
      artist: 'artist',
      mapper: 'mapper',
      coverArtUrl: '',
    } as SongDto;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
