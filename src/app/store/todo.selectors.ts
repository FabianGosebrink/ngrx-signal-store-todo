import { computed } from '@angular/core';

export function todoSelectors() {
  return (state) => ({
    doneCount: computed(() => state.items().filter((x) => x.done).length),
    undoneCount: computed(() => state.items().filter((x) => !x.done).length),
    percentageDone: computed(() => {
      const done = state.items().filter((x) => x.done).length;
      const total = state.items().length;

      if (total === 0) {
        return 0;
      }

      return (done / total) * 100;
    }),
    isLoading: computed(() => state.loading),
  });
}
