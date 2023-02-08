import {
  TASK_LIST_TITLE,
  INPUT_PLACEHOLDER_TEXT,
  INPUT_LABLE,
  INPUT_ADD_BUTTON_TEXT,
  INPUT_CHECK_RESTRICTED_CHARS,
  BASE_DAYS_FOR_TASK,
  MODAL_ADD_BUTTON_TEXT,
  MODAL_CANCEL_BUTTON_TEXT,
  MODAL_CREATED_DATE_DEF_VAL,
  MODAL_EXPIRATION_DATE_DEF_VAL,
} from './constants.js';

export class ToDoList {
  tasks = [];
  #placeForBord;

  constructor() {
    this.#placeForBord = document.querySelector('#toDoBoard');

    this.render();
    this.addEventListeners();
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

  addEventListeners() {
    const input = this.#placeForBord.querySelector('[name="newTaskText"]');
    const addBtn = this.#placeForBord.querySelector(
      'button.newTaskForm__button'
    );

    input.addEventListener('input', this.onInputChange.bind(this));
    input.addEventListener('keydown', this.onEnterBtn.bind(this));
    addBtn.addEventListener('click', this.onAddBtn.bind(this));
  }

  makeTitledListMarkUpWithClass(title, array, className = '') {
    if (!array) console.error('wait for array');
    if (!array.length) {
      return `<h2 class='${className && className + '__title'}'>${title}</h2>
      <ul class='${
        className && className + '__list'
      }'><li>SuperMan hasn't tasks.</li></ul>`;
    }

    return `<h2 class='${className && className + '__title'}'>${title}</h2>
    ${this.makeListMarkUpWithClass(array, className)}`;
  }

  makeListMarkUpWithClass(array, className = '') {
    const items = array
      .map(
        (item) =>
          `<li class='${className && className + '__item'}'>
          <input type="checkbox" name="" value="" />
          ${item.task}
          </li>`
      )
      .join('');
    return `<ul class='${className && className + '__list'}'>${items}</ul>`;
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

  onInputChange(event) {
    !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
      ? event.target.classList.add('bordered--red')
      : event.target.classList.remove('bordered--red');
  }

  onEnterBtn(event) {
    if (
      event.key !== 'Enter' ||
      !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;
    event.preventDefault();

    this.addTask({
      task: event.target.value,
      date: {
        created: Date.now(),
        expiration: Date.now() + BASE_DAYS_FOR_TASK * 24 * 3600 * 1000,
      },
      done: false,
    });
    this.rerenderTaskList();
    event.target.value = '';
  }

  onAddBtn(event) {
    event.preventDefault();

    this.showModal();
  }

  validate(inputString, regExp) {
    return !inputString || inputString.replace(regExp, '') === inputString;
  }

  rerenderTaskList() {
    const newTasks = this.makeListMarkUpWithClass(this.getTasks(), 'toDo');
    const taskList = this.#placeForBord.querySelector('.toDo__list');
    taskList.innerHTML = newTasks;
  }

  makeModalMarkUp(innerMarkup) {
    return `
    <div class="backdrop">
      <div class="modal">
      <button class="modal__closed"></button>
      <div class="modal__content">
      ${innerMarkup}
      </div>
      </div>
    </div>
      `;
  }

  makeInnerModalMarkUp(
    placeholder,
    addBtnText,
    cancelBtnText,
    createdDate,
    expirationDate
  ) {
    return `
    <form >
      <label>
        Task
        <input type="text" name="newTaskText" data-action="newTaskText" placeholder='${placeholder}'/>
        <input type="date" name="createdDate" value='${createdDate}'/>
        <input type="date" name="expirationDate" value='${expirationDate}'/>
      </label>
    </form>
    <button class="add">${addBtnText}</button>
    <button class="cancel">${cancelBtnText}</button>`;
  }

  showModal() {
    const modal = this.makeModalMarkUp(
      this.makeInnerModalMarkUp(
        INPUT_PLACEHOLDER_TEXT,
        MODAL_ADD_BUTTON_TEXT,
        MODAL_CANCEL_BUTTON_TEXT,
        MODAL_CREATED_DATE_DEF_VAL,
        MODAL_EXPIRATION_DATE_DEF_VAL
      )
    );

    this.#placeForBord.innerHTML = '';
    this.#placeForBord.insertAdjacentHTML('beforeend', modal);

    this.addModalListeners();
  }

  addModalListeners() {
    const modal = this.#placeForBord.querySelector('.modal');
    const modalClose = modal.querySelector('.modal__closed');
    const modalInput = modal.querySelector('[data-action="newTaskText"]');
    const modalAddBtn = modal.querySelector('button.add');
    const modalCancelBtn = modal.querySelector('button.cancel');

    modalClose.addEventListener('click', this.onModalClose.bind(this));
    modalInput.addEventListener('input', this.onInputChange.bind(this));
    modalInput.addEventListener('keydown', this.onModalEnterBtn.bind(this));
    modalAddBtn.addEventListener('click', this.onModalAddBtn.bind(this));
    modalCancelBtn.addEventListener('click', this.onModalCancelBtn.bind(this));
  }

  onModalClose(event) {
    this.render();
    this.addEventListeners();
    return;
  }

  onModalEnterBtn(event) {
    if (
      event.key !== 'Enter' ||
      !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;

    event.preventDefault();

    const taskText = this.#placeForBord.querySelector(
      '[name="newTaskText"]'
    ).value;
    const createdDate = this.#placeForBord.querySelector(
      '[name="createdDate"]'
    ).value;
    const expirationDate = this.#placeForBord.querySelector(
      '[name="expirationDate"]'
    ).value;

    this.addTask({
      task: taskText,
      date: {
        created: new Date(createdDate).getTime(),
        expiration: new Date(expirationDate).getTime(),
      },
      done: false,
    });
    event.target.value = '';
  }

  onModalAddBtn(event) {
    if (
      (event.target.textContent !== MODAL_ADD_BUTTON_TEXT &&
        event.target.tagName !== 'BUTTON') ||
      !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;
    event.preventDefault();

    const taskText = this.#placeForBord.querySelector(
      '[name="newTaskText"]'
    ).value;
    const createdDate = this.#placeForBord.querySelector(
      '[name="createdDate"]'
    ).value;
    const expirationDate = this.#placeForBord.querySelector(
      '[name="expirationDate"]'
    ).value;

    this.addTask({
      task: taskText,
      date: {
        created: new Date(createdDate).getTime(),
        expiration: new Date(expirationDate).getTime(),
      },
      done: false,
    });
    this.#placeForBord.querySelector('[name="newTaskText"]').value = '';
  }

  onModalCancelBtn(event) {
    this.#placeForBord.querySelector('[name="newTaskText"]').value = '';
    this.#placeForBord.querySelector('[name="createdDate"]').value =
      MODAL_CREATED_DATE_DEF_VAL;
    this.#placeForBord.querySelector('[name="expirationDate"]').value =
      MODAL_EXPIRATION_DATE_DEF_VAL;
  }
}
