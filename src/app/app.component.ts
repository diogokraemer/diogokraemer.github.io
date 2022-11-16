import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  mensagem: string = 'hello world';
  todos: Todo[] = [];
  form: FormGroup = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(
    private service: TodoService
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }
  
  listarTodos() {
    this.service.listar().subscribe(todoList => this.todos = todoList);
  }

  submit() {
    console.log(this.form.value);
    const todo: Todo = { ...this.form.value };
    this.service.salvar(todo)
       .subscribe(savedTodo => {
          console.log(savedTodo);
          this.todos.push(savedTodo);
          this.form.reset();
      });
  }

  delete(todo: Todo) {
    this.service.deletar(todo.id).subscribe({
      next: (response) => this.listarTodos()
    });
  }

  done(todo: Todo) {
    this.service.marcarComoConcluido(todo.id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done;
        todo.doneDate = todoAtualizado.doneDate;
      }
    });
  }
}
