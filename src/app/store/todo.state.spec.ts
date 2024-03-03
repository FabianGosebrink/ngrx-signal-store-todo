import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMock } from '../../../testing/auto-mock';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { TodoStore } from './todo.state';

describe('TodoStore', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoStore, provideMock(TodoService)],
    });

    service = TestBed.inject(TodoService);
  });

  describe('with Methods', () => {
    it('should update store when item is moved to done', waitForAsync(() => {
      // arrange
      const store = TestBed.inject(TodoStore);
      const item = { id: '1', value: 'test', done: false } as Todo;
      jest.spyOn(service, 'updateItem').mockReturnValue(of(item));
      const spy = jest.spyOn(store, 'update');

      // act
      store.moveToDone(item);

      // assert
      expect(spy).toHaveBeenCalledWith({ ...item, done: true });
    }));
  });
});
