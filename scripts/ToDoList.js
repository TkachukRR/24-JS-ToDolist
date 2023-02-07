const TASK_LIST_TITLE = 'Tasks';
const PLACEHOLDER_TEXT = 'add task';

export class ToDoList {
  #tasks = ['1', '2', '3'];
  placeForBord;

  constructor() {
    this.placeForBord = document.querySelector('#toDoBoard');
    this.render();
    this.addListeners();
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

  render() {
    const list = this.makeTitledListMarkUpWithClass(
      TASK_LIST_TITLE,
      this.getTasks(),
      'toDo'
    );
    const input = this.makeInputWithPlaceholder(PLACEHOLDER_TEXT);

    this.placeForBord.insertAdjacentHTML('beforeend', list);
    this.placeForBord.insertAdjacentHTML('beforeend', input);
  }

  addListeners() {
    this.placeForBord.addEventListener('click', (event) => {
      event.preventDefault();
      console.log(event.target);
    });
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

  makeInputWithPlaceholder(placeholder) {
    return `
    <form>
      <label>
      New task
      <input type="text" name="task" placeholder='${placeholder}'/>
      </label>
    
      <button type="submit">+</button>
    </form>`;
  }
}
