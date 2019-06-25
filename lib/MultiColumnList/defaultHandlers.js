import getNextFocusable from '../../util/getNextFocusable';

export function selectPreviousRow(e, focusedRow, selectHandler, contentData) {
  if (focusedRow !== null && focusedRow !== 0) {
    const nextFocused = focusedRow - 1;
    selectHandler(e, contentData[nextFocused]);
  }
}

export function selectNextRow(e, focusedRow, selectHandler, contentData) {
  if (focusedRow !== null && focusedRow !== contentData.length - 1) {
    const nextFocused = (focusedRow === null) ? 0 : focusedRow + 1;
    selectHandler(e, contentData[nextFocused]);
  }
}

export function unfocusRow(container) {
  if (this.focusedRow !== null) {
    container.focus();
  }
}

export function focusBeyond(container) {
  const elem = getNextFocusable(container, false);
  elem.focus();
}
