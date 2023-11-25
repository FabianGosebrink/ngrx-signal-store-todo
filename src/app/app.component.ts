import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TodoStore } from './store/todo.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TodoStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly store = inject(TodoStore);

  private readonly formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    todoValue: ['', Validators.required],
    done: [false],
  });

  addTodo() {
    this.store.addTodo(this.form.value.todoValue);
    this.form.reset();
  }

  title = 'ngrx-signal-store-todo';
}
