import {
  TASK_LIST_TITLE,
  INPUT_PLACEHOLDER_TEXT,
  INPUT_LABLE,
  INPUT_ADD_BUTTON_TEXT,
} from './constants.js';

export class ToDoList {
  tasks = [];
  #placeForBord;

  constructor() {
    this.#placeForBord = document.querySelector('#toDoBoard');
    this.render();
  }

  getTasks() {
    return this.tasks;
  }

  setTasks(tasksArray) {
    this.tasks = [...tasksArray];
  }

  addTask(taskItem) {
    this.tasks = [...this.tasks, taskItem];
  }

  removeTask(index) {
    this.tasks = [
      ...this.tasks.slice(0, index),
      ...this.tasks.slice(index + 1),
    ];
  }

  render() {
    const list = this.makeTitledListMarkUpWithClass(
      TASK_LIST_TITLE,
      this.getTasks(),
      'toDo'
    );
    const inputTask = this.makeInputMarkUpWithPlaceholderWithClass(
      INPUT_PLACEHOLDER_TEXT,
      'newTaskForm',
      INPUT_LABLE
    );
    this.#placeForBord.innerHTML = '';

    this.#placeForBord.insertAdjacentHTML('beforeend', list);
    this.#placeForBord.insertAdjacentHTML('beforeend', inputTask);
  }

  makeTitledListMarkUpWithClass(title, array, className = '') {
    if (!array) console.error('wait for array');
    if (!array.length) {
      return `<h2 class='${
        className && className + '__title'
      }'>${title}</h2><p>SuperMan hasn't tasks.</p>`;
    }

    const items = array
      .map(
        (item) =>
          `<li class='${className && className + '__item'}'>${item.task}</li>`
      )
      .join('');

    return `<h2 class='${className && className + '__title'}'>${title}</h2>
    <ul class='${className && className + '__list'}'>${items}</ul>`;
  }

  makeInputMarkUpWithPlaceholderWithClass(placeholder, className = '', lable) {
    return `
    <form class='${className}' >
      <label class='${className && className + '__lable'}' >
      ${lable}
      <input  class='${
        className && className + '__input'
      }' type="text" name="newTaskText" placeholder='${placeholder}'/>
      </label>
    
      <button  class='${
        className && className + '__button'
      }' type="button">${INPUT_ADD_BUTTON_TEXT}</button>
    </form>`;
  }
}
