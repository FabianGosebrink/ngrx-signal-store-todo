import { Type, computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { BaseEntity } from '../models/base-entitiy';
import { CrudService } from '../todo.service';

export function withCrudOperations<Entitiy extends BaseEntity>(
  dataServiceType: Type<CrudService<Entitiy>>
) {
  return signalStoreFeature(
    {
      state: type<{
        items: Entitiy[];
        loading: boolean;
      }>(),
    },
    withMethods((store) => {
      const service = inject(dataServiceType);

      return {
        addItem: rxMethod<string>(
          pipe(
            switchMap((value) => {
              patchState(store, { loading: true });

              return service.addItem(value).pipe(
                tapResponse({
                  next: (addedItem) => {
                    patchState(store, {
                      items: [...store.items(), addedItem],
                    });
                  },
                  error: console.error,
                  finalize: () => patchState(store, { loading: false }),
                })
              );
            })
          )
        ),

        async loadAllItemsByPromise() {
          patchState(store, { loading: true });

          const items = await service.getItemsAsPromise();

          patchState(store, { items, loading: false });
        },

        deleteItem: rxMethod<Entitiy>(
          pipe(
            switchMap((item) => {
              patchState(store, { loading: true });

              return service.deleteItem(item).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, {
                      items: [...store.items().filter((x) => x.id !== item.id)],
                    });
                  },
                  error: console.error,
                  finalize: () => patchState(store, { loading: false }),
                })
              );
            })
          )
        ),

        update: rxMethod<Entitiy>(
          pipe(
            switchMap((item) => {
              patchState(store, { loading: true });

              return service.updateItem(item).pipe(
                tapResponse({
                  next: (updatedItem) => {
                    const allItems = [...store.items()];
                    const index = allItems.findIndex((x) => x.id === item.id);

                    allItems[index] = updatedItem;

                    patchState(store, {
                      items: allItems,
                    });
                  },
                  error: console.error,
                  finalize: () => patchState(store, { loading: false }),
                })
              );
            })
          )
        ),
      };
    }),

    withComputed(({ items }) => ({
      allItems: computed(() => items()),
      allItemsCount: computed(() => items().length),
    }))
  );
}
