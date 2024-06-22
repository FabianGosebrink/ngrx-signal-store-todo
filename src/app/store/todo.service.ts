import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Todo } from './todo';

const apiUrl = `https://sampletodobackend.azurewebsites.net/api/v1/`;

@Injectable({
  providedIn: 'root',
})
export class TodoService{
  private readonly http = inject(HttpClient);

  private url = `${apiUrl}todos`;

  getItems(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url);
  }

  getItemsAsPromise() {
    return lastValueFrom(this.http.get<Todo[]>(this.url));
  }

  getItem(id: string) {
    return this.http.get<Todo>(`${this.url}/${id}`);
  }

  addItem(value: string) {
    return this.http.post<Todo>(this.url, { value });
  }

  updateItem(value: Todo) {
    return this.http.put<Todo>(`${this.url}/${value.id}`, value);
  }

  deleteItem(value: Todo) {
    return this.http.delete(`${this.url}/${value.id}`);
  }
}
