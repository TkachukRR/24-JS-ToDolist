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
    const cultivationButtons = this.makeCultivationButtonsMarkup(
      this.getTasks()
    );

    this.#placeForBord.innerHTML = '';

    this.#placeForBord.insertAdjacentHTML('beforeend', list);
    this.#placeForBord.insertAdjacentHTML('beforeend', cultivationButtons);
    this.#placeForBord.insertAdjacentHTML('beforeend', inputTask);
  }

  addEventListeners() {
    const input = this.#placeForBord.querySelector('[name="newTaskText"]');
    const addBtn = this.#placeForBord.querySelector(
      '[data-action="addDatedTask"]'
    );
    const sortBtn = this.#placeForBord.querySelector(
      '[data-action="sortTasks"]'
    );
    const sortPopup = this.#placeForBord.querySelector('.newTaskForm__popup');
    const taskList = this.#placeForBord.querySelector('.toDo__list');
    const cultivationButtons = this.#placeForBord.querySelector('.cultivation');

    input.addEventListener('input', this.onInputChange.bind(this));
    input.addEventListener('keydown', this.onEnterBtn.bind(this));
    sortBtn.addEventListener('click', this.onSortBtn.bind(this));
    sortPopup.addEventListener('click', this.onByTextSort.bind(this));
    sortPopup.addEventListener('click', this.onByDateSort.bind(this));
    addBtn.addEventListener('click', this.onAddBtn.bind(this));
    taskList.addEventListener('click', this.onCheckbox.bind(this));
    taskList.addEventListener('click', this.onDeleteBtn.bind(this));
    taskList.addEventListener('click', this.onEditBtn.bind(this));
    cultivationButtons.addEventListener('click', this.onAll.bind(this));
    cultivationButtons.addEventListener('click', this.onActive.bind(this));
    cultivationButtons.addEventListener('click', this.onCompleted.bind(this));
    cultivationButtons.addEventListener(
      'click',
      this.onClearCompleted.bind(this)
    );
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
            <span class='${className && className + '__textC'}'>
              <input type="checkbox" name="itemStatus" data-inputid="${
                item.id
              }" ${item.done ? 'checked' : ''}
              }/>
                ${item.task}
                ${new Date(item.date.created).toLocaleString()}
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
    <input  class='${
      className && className + '__input__filter'
    }' type="text" name="newTaskText" placeholder='filer tasks'/>
      <label class='${className && className + '__lable'}' >
      <button type="button" class='${
        className && className + '__button'
      }' data-action="sortTasks"> ⇳</button>
      <div  class='${className && className + '__popup hide'}'>
        <button  type="button" data-action="sortByText">Text</button>
        <button type="button" data-action="sortByDate">Date</button>
      </div>
      <input  class='${
        className && className + '__input'
      }' type="text" name="newTaskText" placeholder='${placeholder}'/>
      </label>
    
      <button  class='${
        className && className + '__button'
      }' type="button" data-action="addDatedTask">${INPUT_ADD_BUTTON_TEXT}</button>
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
    let newTasks = null;

    const isShowAllActive = this.hasElementClass(
      '[data-action="showAll"]',
      'active'
    );
    const isShowActiveActive = this.hasElementClass(
      '[data-action="showActive"]',
      'active'
    );

    const isShowCompletedActive = this.hasElementClass(
      '[data-action="showCompleted"]',
      'active'
    );

    (isShowAllActive || (isShowActiveActive && isShowCompletedActive)) &&
      (newTasks = this.makeListMarkUpWithClass(this.getTasks(), 'toDo'));
    isShowActiveActive &&
      !isShowCompletedActive &&
      (newTasks = this.makeListMarkUpWithClass(
        this.getTasks().filter((item) => item.done == false),
        'toDo'
      ));
    isShowCompletedActive &&
      !isShowActiveActive &&
      (newTasks = this.makeListMarkUpWithClass(
        this.getTasks().filter((item) => item.done == true),
        'toDo'
      ));

    const taskList = this.#placeForBord.querySelector('.toDo__list');

    taskList.innerHTML = newTasks;
    this.setItemsLeft();
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
    const taskText = this.getTasks()[taskIndex].task;

    this.showEditModal(taskText, taskIndex);
  }

  showEditModal(taskText, taskIndex) {
    const modal = this.makeModalMarkUp(this.makeEditMarkUp('editor', taskText));

    this.#placeForBord.innerHTML = '';
    this.#placeForBord.insertAdjacentHTML('beforeend', modal);

    const input = this.#placeForBord.querySelector('[name="editTaskText"]');
    input.focus();

    this.addEditModalListeners(taskIndex);
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

  addEditModalListeners(taskIndex) {
    const modal = this.#placeForBord.querySelector('.modal');
    const modalClose = modal.querySelector('.modal__closed');
    const modalSaveBtn = modal.querySelector('[data-action="saveChanges"]');
    const modalCancelBtn = modal.querySelector('[data-action="cancelChanges"]');
    const previosTaskText = modal.querySelector('[name="editTaskText"]').value;

    modalClose.addEventListener('click', this.onModalClose.bind(this));
    modalSaveBtn.addEventListener(
      'click',
      this.onModalEditSave.bind(this, taskIndex)
    );
    modalCancelBtn.addEventListener(
      'click',
      this.onModalEditCancel.bind(this, previosTaskText)
    );
  }

  onModalEditSave(taskIndex) {
    const newTaskText = this.#placeForBord.querySelector(
      '[name="editTaskText"]'
    ).value;
    this.getTasks()[taskIndex].task = newTaskText;
    this.onModalClose();
  }

  onModalEditCancel(previosTaskText) {
    this.#placeForBord.querySelector('[name="editTaskText"]').value =
      previosTaskText;
  }

  makeCultivationButtonsMarkup(tasks) {
    return `
      <div class="cultivation">
        <h3 class="cultivation__title">Items left: <span data-val="itemsLeft">${tasks.length}</span></h3>
        <ul class="cultivation__list">
          <li class="cultivation__item"><button type="button" class="cultivation__btn active" data-action="showAll">All</button></li>
          <li class="cultivation__item"><button type="button" class="cultivation__btn" data-action="showActive">Active</button></li>
          <li class="cultivation__item"><button type="button" class="cultivation__btn" data-action="showCompleted">Completed</button></li>
          <li class="cultivation__item"><button type="button" class="cultivation__btn" data-action="clearCompleted">Clear completed</button></li>
        </ul>
      </div>`;
  }

  onAll() {
    event.preventDefault();
    if (event.target.textContent !== 'All') return;

    const isShowAllActive = this.hasElementClass(
      '[data-action="showAll"]',
      'active'
    );
    if (isShowAllActive) return;

    const isShowActiveActive = this.hasElementClass(
      '[data-action="showActive"]',
      'active'
    );
    const isShowCompletedActive = this.hasElementClass(
      '[data-action="showCompleted"]',
      'active'
    );

    isShowActiveActive &&
      this.removeElementClass('[data-action="showActive"]', 'active');

    isShowCompletedActive &&
      this.removeElementClass('[data-action="showCompleted"]', 'active');

    this.addElementClass('[data-action="showAll"]', 'active');
    this.rerenderTaskList();
  }

  onActive() {
    event.preventDefault();
    if (event.target.textContent !== 'Active') return;

    const isShowActiveActive = this.hasElementClass(
      '[data-action="showActive"]',
      'active'
    );
    const isShowAllActive = this.hasElementClass(
      '[data-action="showAll"]',
      'active'
    );
    const isShowCompletedActive = this.hasElementClass(
      '[data-action="showCompleted"]',
      'active'
    );

    switch (isShowActiveActive) {
      case false:
        this.addElementClass('[data-action="showActive"]', 'active');

        isShowAllActive &&
          this.removeElementClass('[data-action="showAll"]', 'active');
        break;

      case true:
        this.removeElementClass('[data-action="showActive"]', 'active');

        !isShowCompletedActive &&
          this.addElementClass('[data-action="showAll"]', 'active');
        break;
    }
    this.rerenderTaskList();
  }

  onCompleted() {
    event.preventDefault();
    if (event.target.textContent !== 'Completed') return;

    const isShowActiveActive = this.hasElementClass(
      '[data-action="showActive"]',
      'active'
    );
    const isShowAllActive = this.hasElementClass(
      '[data-action="showAll"]',
      'active'
    );
    const isShowCompletedActive = this.hasElementClass(
      '[data-action="showCompleted"]',
      'active'
    );

    switch (isShowCompletedActive) {
      case false:
        this.addElementClass('[data-action="showCompleted"]', 'active');

        isShowAllActive &&
          this.removeElementClass('[data-action="showAll"]', 'active');
        break;

      case true:
        this.removeElementClass('[data-action="showCompleted"]', 'active');

        !isShowActiveActive &&
          this.addElementClass('[data-action="showAll"]', 'active');
        break;
    }
    this.rerenderTaskList();
  }

  onClearCompleted() {
    event.preventDefault();
    if (event.target.textContent !== 'Clear completed') return;

    this.setTasks(this.getTasks().filter((item) => item.done == false));

    this.rerenderTaskList();
  }

  setItemsLeft() {
    this.#placeForBord.querySelector('[data-val="itemsLeft"]').textContent =
      this.getTasks().filter((item) => item.done == false).length;
  }

  findElementBy(param) {
    return this.#placeForBord.querySelector(param);
  }

  hasElementClass(element, className) {
    const el = this.findElementBy(element);
    return el.classList.contains(className);
  }

  addElementClass(element, className) {
    const el = this.findElementBy(element);
    el.classList.add(className);
  }

  removeElementClass(element, className) {
    const el = this.findElementBy(element);
    el.classList.remove(className);
  }

  onSortBtn() {
    this.#placeForBord
      .querySelector('.newTaskForm__popup')
      .classList.remove('hide');
  }

  onByTextSort() {
    if (event.target.textContent !== 'Text') return;
    this.setTasks(this.getTasks().sort((a, b) => a.task - b.task));
    this.rerenderTaskList();
    this.#placeForBord
      .querySelector('.newTaskForm__popup')
      .classList.add('hide');
  }

  onByDateSort() {
    if (event.target.textContent !== 'Date') return;
    this.setTasks(
      this.getTasks().sort((a, b) => a.date.created - b.date.created)
    );
    this.rerenderTaskList();
    this.#placeForBord
      .querySelector('.newTaskForm__popup')
      .classList.add('hide');
  }
}
