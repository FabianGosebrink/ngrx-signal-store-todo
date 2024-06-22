import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { TodoState } from './todo.state';

export function withTodosSelectors() {
  return signalStoreFeature(
    {
      state: type<TodoState>(),
    },
    withComputed(({ items }) => ({
      doneCount: computed(() => items().filter((x) => x.done).length),
      undoneCount: computed(() => items().filter((x) => !x.done).length),
      percentageDone: computed(() => {
        const done = items().filter((x) => x.done).length;
        const total = items().length;

        if (total === 0) {
          return 0;
        }

        return (done / total) * 100;
      }),
    }))
  );
}
