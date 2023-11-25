import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Todo } from '../models/todo';
import { todoHooks } from './todo.hooks';
import { todoMethods } from './todo.methods';
import { todoSelectors } from './todo.selectors';

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
  withComputed(todoSelectors()),
  withMethods(todoMethods()),
  withHooks(todoHooks())
);
