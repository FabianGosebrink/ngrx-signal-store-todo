import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoService } from '../todo.service';

function loadAllTodos(state: any, todoService: TodoService) {
  return rxMethod<void>(
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
  );
}

async function loadAllTodosByPromise(state: any, todoService: TodoService) {
  patchState(state, { loading: true });

  const items = await todoService.getItemsAsPromise();

  patchState(state, { items, loading: true });
}

function addTodo(state: any, todoService: TodoService) {
  return rxMethod<string>(
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
  );
}

function moveToDone(state: any, todoService: TodoService) {
  return rxMethod<Todo>(
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
                ...state,
                items: allItems,
              });
            },
            error: console.error,
            finalize: () => patchState(state, { loading: false }),
          })
        );
      })
    )
  );
}

function deleteTodo(state: any, todoService: TodoService) {
  return rxMethod<Todo>(
    pipe(
      switchMap((todo) => {
        patchState(state, { loading: true });

        return todoService.deleteItem(todo).pipe(
          tapResponse({
            next: () => {
              patchState(state, {
                ...state,
                items: [...state.items().filter((x) => x.id !== todo.id)],
              });
            },
            error: console.error,
            finalize: () => patchState(state, { loading: false }),
          })
        );
      })
    )
  );
}

export function todoMethods() {
  return (state: any, todoService = inject(TodoService)) => ({
    loadAllTodos: loadAllTodos(state, todoService),
    loadAllTodosByPromise: () => loadAllTodosByPromise(state, todoService),
    addTodo: addTodo(state, todoService),
    moveToDone: moveToDone(state, todoService),
    deleteTodo: deleteTodo(state, todoService),
  });
}