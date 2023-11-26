import { withHooks } from '@ngrx/signals';

export function withTodoHooks() {
  return withHooks({
    onInit({ loadAllTodos }) {
      console.log('on init');
      loadAllTodos();
    },
    onDestroy() {
      console.log('count on destroy');
    },
  });
}
