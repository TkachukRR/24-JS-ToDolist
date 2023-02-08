export const TASK_LIST_TITLE = 'Tasks:';
export const INPUT_PLACEHOLDER_TEXT = 'add task';
export const INPUT_LABLE = 'New task';
export const INPUT_ADD_BUTTON_TEXT = '+';
export const INPUT_CHECK_REGEXP = /[^A-za-z0-9]/;
export const BASE_DAYS_FOR_TASK = 1;
export const MODAL_ADD_BUTTON_TEXT = 'add';
export const MODAL_CANCEL_BUTTON_TEXT = 'cancel';
export const MODAL_CREATED_DATE_DEF_VAL = new Date(Date.now())
  .toISOString()
  .slice(0, 10);
export const MODAL_EXPIRATION_DATE_DEF_VAL = new Date(
  Date.now() + 24 * 3600 * 1000
)
  .toISOString()
  .slice(0, 10);
