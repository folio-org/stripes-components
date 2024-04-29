/* insert by clientRect */
import cloneDeep from 'lodash/cloneDeep';

export default (prevArray, newItem) => {
  let nextIndex = -1;
  if (newItem.getRef().current) {
    const newClientRect = newItem.getRef().current.getBoundingClientRect();
    nextIndex = prevArray.findIndex((p) => {
      return (p.getRef().current.getBoundingClientRect().left > newClientRect.left);
    });
  }

  let newArray;
  if (nextIndex === -1) {
    newArray = [...prevArray, newItem];
  } else if (nextIndex === 0) {
    newArray = [newItem, ...prevArray];
  } else {
    const tempPanes = cloneDeep(prevArray);
    tempPanes.splice(nextIndex, 0, newItem);
    newArray = tempPanes;
  }
  return newArray;
};
