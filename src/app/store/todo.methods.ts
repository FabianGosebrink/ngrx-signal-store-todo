import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { TodoState } from './todo.state';

export function withTodosMethods() {
  return signalStoreFeature(
    { state: type<TodoState>() },
    withMethods((store, todoService = inject(TodoService)) => ({
      loadAllTodos: rxMethod<void>(
        switchMap(() => {
          patchState(store, { loading: true });

          return todoService.getItems().pipe(
            tapResponse({
              next: (items) => patchState(store, { items }),
              error: console.error,
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
      async loadAllTodosByPromise() {
        patchState(store, { loading: true });

        const items = await todoService.getItemsAsPromise();

        patchState(store, { items, loading: false });
      },
      addTodo: rxMethod<string>(
        switchMap((value) => {
          patchState(store, { loading: true });

          return todoService.addItem(value).pipe(
            tapResponse({
              next: (item) =>
                patchState(store, { items: [...store.items(), item] }),
              error: console.error,
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
      moveToDone: rxMethod<Todo>(
        switchMap((todo) => {
          patchState(store, { loading: true });

          const toSend = { ...todo, done: !todo.done };

          return todoService.updateItem(toSend).pipe(
            tapResponse({
              next: (updatedTodo) => {
                const allItems = [...store.items()];
                const index = allItems.findIndex((x) => x.id === todo.id);

                allItems[index] = updatedTodo;

                patchState(store, {
                  items: allItems,
                });
              },
              error: console.error,
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),

      deleteTodo: rxMethod<Todo>(
        switchMap((todo) => {
          patchState(store, { loading: true });

          return todoService.deleteItem(todo).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  items: [...store.items().filter((x) => x.id !== todo.id)],
                });
              },
              error: console.error,
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
    })),
  );
}
