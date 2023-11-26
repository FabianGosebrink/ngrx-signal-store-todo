import { signalStore, withState } from '@ngrx/signals';
import { Todo } from '../models/todo';
import { withTodoHooks } from './todo.hooks';
import { withTodosMethods } from './todo.methods';
import { withTodosSelectors } from './todo.selectors';

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
  withTodosSelectors(),
  withTodosMethods(),
  withTodoHooks()
);
