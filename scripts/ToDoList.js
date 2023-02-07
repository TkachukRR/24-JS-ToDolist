import { TASK_LIST_TITLE } from './constants.js';

export class ToDoList {
  #tasks = [];
  #placeForBord;

  constructor() {
    this.#placeForBord = document.querySelector('#toDoBoard');
    this.render();
  }

  getTasks() {
    return this.#tasks;
  }

  setTasks(tasksArray) {
    this.#tasks = [...tasksArray];
  }

  addTask(taskItem) {
    this.#tasks = [...this.#tasks, taskItem];
  }

  removeTask(index) {
    this.#tasks = [
      ...this.#tasks.slice(0, index),
      ...this.#tasks.slice(index + 1),
    ];
  }

  render() {
    const list = this.makeTitledListMarkUpWithClass(
      TASK_LIST_TITLE,
      this.getTasks(),
      'toDo'
    );

    this.#placeForBord.insertAdjacentHTML('beforeend', list);
  }

  makeTitledListMarkUpWithClass(title, array, className = '') {
    if (!array) console.error('wait for array');

    const items = array
      .map(
        (item) =>
          `<li class='${className && className + '__item'}'>${item}</li>`
      )
      .join('');

    return `<h2 class='${className && className + '__title'}'>${title}</h2>
    <ul class='${className && className + '__list'}'>${items}</ul>`;
  }
}
