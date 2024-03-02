import { ComponentFixture, TestBed } from '@angular/core/testing';
import { overrideMock } from '../../testing/auto-mock';
import { AppComponent } from './app.component';
import { TodoStore } from './store/todo.state';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [],
    })
      .overrideProvider(TodoStore, overrideMock(TodoStore))
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
