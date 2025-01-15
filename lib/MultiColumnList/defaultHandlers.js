import { getNextFocusable } from '../util/getFocusableElements';

export function selectPreviousRow(e, focusedRow, selectHandler, contentData) {
  if (focusedRow !== null && focusedRow !== 0) {
    const nextFocused = focusedRow - 1;
    selectHandler(e, contentData[nextFocused]);
  }
}

export function selectNextRow(e, focusedRow, selectHandler, contentData) {
  if (focusedRow !== null && focusedRow !== contentData.length - 1) {
    const nextFocused = focusedRow + 1;
    selectHandler(e, contentData[nextFocused]);
  }
}

export function unfocusRow(focusedRow, container) {
  if (focusedRow !== null) {
    container.focus();
  }
}

export function focusBeyond(container) {
  const elem = getNextFocusable(container, false);
  elem.focus();
}
