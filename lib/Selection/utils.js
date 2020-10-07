// eslint-disable-next-line import/prefer-default-export
export const getSelectedObject = (value, dataOptions = []) => {
  const selectedObject = { selectedValue: undefined, selectedIndex: -1, selectedLabel: undefined };
  let valueIndex;

  if (dataOptions.length > 0) {
    if (typeof value !== 'undefined') { // in the case of RF, nothing selected, so cursor the 1st...
      valueIndex = dataOptions.findIndex(o => o.value === value);

      if (valueIndex !== -1) {
        selectedObject.selectedValue = value;
        selectedObject.selectedIndex = valueIndex;
        selectedObject.selectedLabel = dataOptions[valueIndex].label;
      }
    }
  }

  return selectedObject;
};
