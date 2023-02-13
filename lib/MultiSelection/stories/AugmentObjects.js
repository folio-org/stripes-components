import React, { useReducer } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import MultiSelection from '../MultiSelection';
import Headline from '../../Headline';
import { Grid, Row, Col } from '../../LayoutGrid';

const optionList = [
  { value: 'test0', label: 'Option 0', character: 'Darth Vader', actor: 'James Earl Jones' },
  { value: 'test1', label: 'Option 1', character: 'Luke Skywalker', actor: 'Mark Hamill' },
  { value: 'test2', label: 'Option 2', character: 'Leia Organa', actor: 'Carrie Fisher' },
];

function reducer(state, action) {
  const curClone = cloneDeep(state?.options);
  const index = curClone.findIndex(o => action?.payload.value === o.value);

  switch (action?.type) {
    case 'removed':
      curClone[index]._delete = true;
      delete curClone[index]._added
      return {
        options: curClone,
        value: curClone.filter((v) => v._added)
      };
    case 'added':
      curClone[index]._added = true;
      delete curClone[index]._delete
      return {
        options: curClone,
        value: curClone.filter((v) => v._added)
      };
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
        onRemove={(r) => dispatch({ type: 'removed', payload: r })}
        onAdd={(a) => dispatch({ type: 'added', payload: a })}
        label="Selected items"
      />
      <Grid>
        <Row>
          <Col xs={6}>
            <Headline size="small" tag="h4">
              Possible options:
            </Headline>
            <ul>
              {state.options.map((o) => <li key={o.label}>{JSON.stringify(o)}</li>)}
            </ul>
          </Col>
          <Col xs={6}>
            <Headline size="small" tag="h4">
              Selected options:
            </Headline>
            <ul>
              {state.value.map((o) => <li key={o.label}>{JSON.stringify(o)}</li>)}
            </ul>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default AugmentObjects;
