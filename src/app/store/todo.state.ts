import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { BaseState, withCrudOperations } from './crud.state';
import { Todo } from './todo';
import { withTodoSelectors } from './todo.selectors';
import { TodoService } from './todo.service';

export interface TodoState extends BaseState<Todo> {}

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
      console.log('@@@@ before');
      store.update({ ...item, done: true });
      console.log('@@@@ after');
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
