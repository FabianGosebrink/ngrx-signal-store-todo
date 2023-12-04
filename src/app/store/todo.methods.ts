import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoService } from '../todo.service';
import { TodoState } from './todo.state';

export function withTodosMethods() {
  return signalStoreFeature(
    { state: type<TodoState>() },
    withMethods((state, todoService = inject(TodoService)) => ({
      loadAllTodos: rxMethod<void>(
        pipe(
          switchMap(() => {
            patchState(state, { loading: true });

            return todoService.getItems().pipe(
              tapResponse({
                next: (items) => patchState(state, { items }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              })
            );
          })
        )
      ),
      async loadAllTodosByPromise() {
        patchState(state, { loading: true });

        const items = await todoService.getItemsAsPromise();

        patchState(state, { items, loading: false });
      },
      addTodo: rxMethod<string>(
        pipe(
          switchMap((value) => {
            patchState(state, { loading: true });

            return todoService.addItem(value).pipe(
              tapResponse({
                next: (item) =>
                  patchState(state, { items: [...state.items(), item] }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              })
            );
          })
        )
      ),
      moveToDone: rxMethod<Todo>(
        pipe(
          switchMap((todo) => {
            patchState(state, { loading: true });

            const toSend = { ...todo, done: !todo.done };

            return todoService.updateItem(toSend).pipe(
              tapResponse({
                next: (updatedTodo) => {
                  const allItems = [...state.items()];
                  const index = allItems.findIndex((x) => x.id === todo.id);

                  allItems[index] = updatedTodo;

                  patchState(state, {
                    items: allItems,
                  });
                },
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              })
            );
          })
        )
      ),

      deleteTodo: rxMethod<Todo>(
        pipe(
          switchMap((todo) => {
            patchState(state, { loading: true });

            return todoService.deleteItem(todo).pipe(
              tapResponse({
                next: () => {
                  patchState(state, {
                    items: [...state.items().filter((x) => x.id !== todo.id)],
                  });
                },
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              })
            );
          })
        )
      ),
    }))
  );
}
