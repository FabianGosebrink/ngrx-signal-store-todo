import { Observable } from 'rxjs';

export interface CrudService<T> {
  getItems(): Observable<T[]>;

  getItemsAsPromise(): Promise<T[]>;

  getItem(id: string): Observable<T>;

  addItem(value: string): Observable<T>;

  updateItem(value: T): Observable<T>;

  deleteItem(value: T): Observable<any>;
}
