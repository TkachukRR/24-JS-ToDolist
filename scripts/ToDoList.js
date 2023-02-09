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
    const taskList = this.#placeForBord.querySelector('.toDo__list');

    input.addEventListener('input', this.onInputChange.bind(this));
    input.addEventListener('keydown', this.onEnterBtn.bind(this));
    addBtn.addEventListener('click', this.onAddBtn.bind(this));
    taskList.addEventListener('click', this.onCheckbox.bind(this));
    taskList.addEventListener('click', this.onDeleteBtn.bind(this));
    taskList.addEventListener('click', this.onEditBtn.bind(this));
  }

  makeTitledListMarkUpWithClass(title, array, className = '') {
    if (!array) console.error('wait for array');

    return `<h2 class='${className && className + '__title'}'>${title}
    </h2><ul class='${className && className + '__list'}'>
    ${this.makeListMarkUpWithClass(array, className)}
    </ul>`;
  }

  makeListMarkUpWithClass(array, className = '') {
    if (!array.length) {
      return `<li>SuperMan hasn't tasks.</li>`;
    }

    const items = array
      .map(
        (item) =>
          `<li class='${
            className && className + '__item' + (item.done ? '--checked' : '')
          }' data-itemid="${item.id}">
            <span>
              <input type="checkbox" name="itemStatus" data-inputid="${
                item.id
              }" ${item.done ? 'checked' : ''}
              }/>
              ${item.task}
            </span>
            <span>
              <button class="btn__edit" type="button" data-action="editItem">&#128393</button>
              <button class="btn__remove" type="button" data-action="removeItem">&#10006</button>
            </span>
          </li>`
      )
      .join('');
    return items;
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
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (
      !event.target.value ||
      !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;

    this.addTask({
      task: event.target.value,
      date: {
        created: Date.now(),
        expiration: Date.now() + BASE_DAYS_FOR_TASK * 24 * 3600 * 1000,
      },
      done: false,
      id: this.generateId(),
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
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (
      !event.target.value ||
      !this.validate(event.target.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;

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
      id: this.generateId(),
    });
    event.target.value = '';
  }

  onModalAddBtn(event) {
    if (
      event.target.textContent !== MODAL_ADD_BUTTON_TEXT &&
      event.target.tagName !== 'BUTTON'
    )
      return;
    event.preventDefault();
    const taskText = this.#placeForBord.querySelector('[name="newTaskText"]');

    if (
      !taskText.value ||
      !this.validate(taskText.value, INPUT_CHECK_RESTRICTED_CHARS)
    )
      return;

    const createdDate = this.#placeForBord.querySelector(
      '[name="createdDate"]'
    ).value;
    const expirationDate = this.#placeForBord.querySelector(
      '[name="expirationDate"]'
    ).value;

    this.addTask({
      task: taskText.value,
      date: {
        created: new Date(createdDate).getTime(),
        expiration: new Date(expirationDate).getTime(),
      },
      done: false,
      id: this.generateId(),
    });
    taskText.value = '';
  }

  onModalCancelBtn(event) {
    this.#placeForBord.querySelector('[name="newTaskText"]').value = '';
    this.#placeForBord.querySelector('[name="createdDate"]').value =
      MODAL_CREATED_DATE_DEF_VAL;
    this.#placeForBord.querySelector('[name="expirationDate"]').value =
      MODAL_EXPIRATION_DATE_DEF_VAL;
  }

  generateId() {
    return Math.floor(Math.random() * 100000);
  }

  onCheckbox(event) {
    if (!event.target.hasAttribute('data-inputid')) return;

    this.getTasks().map((task) => {
      if (task.id == event.target.dataset.inputid) {
        task.done = !task.done;
        this.rerenderTaskList();
      }
    });
  }

  onDeleteBtn(event) {
    if (event.target.getAttribute('data-action') !== 'removeItem') return;

    const itemId = event.target.parentNode.parentNode.dataset.itemid;
    this.setTasks(this.getTasks().filter((item) => item.id != itemId));
    this.rerenderTaskList();
  }

  onEditBtn(event) {
    if (event.target.getAttribute('data-action') !== 'editItem') return;

    const itemId = event.target.parentNode.parentNode.dataset.itemid;
    const taskIndex = this.getTasks().findIndex((item) => item.id == itemId);

    this.showEditModal(this.getTasks()[taskIndex].task);
  }

  showEditModal(itemID) {
    const modal = this.makeModalMarkUp(this.makeEditMarkUp('editor', itemID));

    this.#placeForBord.innerHTML = '';
    this.#placeForBord.insertAdjacentHTML('beforeend', modal);
  }

  makeEditMarkUp(className = '', innerText) {
    return `
    <form class='${className}' >
      <label class='${className && className + '__lable'}' >
        Edit task:
        <input  class='${
          className && className + '__input'
        }' type="text" name="editTaskText" value="${innerText}"/>
      </label>
      <span>
        <button  class='${
          className && className + '__button'
        }' type="button" data-action="saveChanges">save</button>
        <button  class='${
          className && className + '__button'
        }' type="button" data-action="cancelChanges">cancel</button>
      </span>
    </form>`;
  }
}
