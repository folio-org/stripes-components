import React, { useReducer } from 'react';
import MultiSelection from '../MultiSelection';
import Headline from '../../Headline';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

function reducer(state, action) {
  const curClone = state?.options;
  const index = state?.options.findIndex(o => action?.payload.value === o.value);

  switch (action?.type) {
    case 'removed':
      curClone[index]._delete = true;
      delete curClone[index]._added
      return {
        options: curClone,
        value: curClone.filter((v) => v._added)
      };
    case 'added':
      action.payload.forEach(i => {
        const toAdd = state?.options.findIndex(o => i.value === o.value);
        curClone[toAdd]._added = true;
        if (curClone[toAdd]._deleted) {
          delete curClone[index]._deleted
        }
      });
      return { options: curClone, value: curClone.filter((v) => v._added) }
    default:
      throw new Error();
  }
}

const AugmentObjects = () => {
  const [state, dispatch] = useReducer(reducer, { options: optionList, value: [] });

  return (
    <div>
      <Headline size="large">
        Multiselect to augment objects on removal.
      </Headline>
      <MultiSelection
        id="my-multiselect"
        dataOptions={state.options}
        value={state.value}
        onChange={(v) => dispatch({ type: 'added', payload: v })}
        onRemove={(r) => dispatch({ type: 'removed', payload: r })}
        label="Selected items"
      />
    </div>
  );
};

export default AugmentObjects;
