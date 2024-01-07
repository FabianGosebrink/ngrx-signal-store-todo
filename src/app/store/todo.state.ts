import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Todo } from '../models/todo';
import { TodoService } from '../todo.service';
import { withCrudOperations } from './crud.state';
import { withTodoSelectors } from './todo.selectors';

export interface TodoState {
  items: Todo[];
  loading: boolean;
}

export const initialState: TodoState = {
  items: [],
  loading: false,
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCrudOperations<Todo>(TodoService),
  withTodoSelectors(),
  withMethods((store) => ({
    moveToDone(item: Todo) {
      store.update({ ...item, done: true });
    },
  })),
  withHooks({
    onInit({ loadAllItemsByPromise }) {
      console.log('on init');
      loadAllItemsByPromise();
    },
    onDestroy() {
      console.log('on destroy');
    },
  })
);
