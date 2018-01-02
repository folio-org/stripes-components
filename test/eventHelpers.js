// keyboard event helper.
export const configKeyEvent = (keyCode) => {
  return {
    stopPropagation: () => {},
    preventDefault: () => {},
    keyCode
  }
}
