import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';
import { withTodoSelectors } from './todo.selectors';
import { TodoState } from './todo.state';

describe('Todo Selectors', () => {
  const state = {
    items: [
      { id: '1', value: 'test', done: true },
      { id: '2', value: 'test', done: false },
    ],
    loading: false,
  } as TodoState;

  const TestStore = signalStore(withState(state), withTodoSelectors());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestStore],
    });
  });

  it('should return correct number of items', () => {
    // arrange
    const testStore = TestBed.inject(TestStore);

    // act
    const allItems = testStore.items().length;

    // assert
    expect(allItems).toEqual(2);
  });

  it('should return correct percentageDone', () => {
    // arrange
    const testStore = TestBed.inject(TestStore);

    // act
    const percentage = testStore.percentageDone();

    // assert
    expect(percentage).toEqual(50);
  });

  it('should return correct undoneCount', () => {
    // arrange
    const testStore = TestBed.inject(TestStore);

    // act
    const count = testStore.undoneCount();

    // assert
    expect(count).toEqual(1);
  });

  it('should return correct doneCount', () => {
    // arrange
    const testStore = TestBed.inject(TestStore);

    // act
    const count = testStore.doneCount();

    // assert
    expect(count).toEqual(1);
  });
});
