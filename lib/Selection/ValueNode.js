import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import uniqueId from 'lodash/uniqueId';
import css from './Selection.css';

const ValueNode = props => (
  <li tabIndex="-1" className={props.className} id={`${props.id}-selected-${props.label}-${props.value}`}>
    <IconButton icon="closeX" size="small" tabIndex="-1" onClick={(e) => { props.onRemoveValue(props.value, e); }} />
    <div className={css.ValueNodeValue}>
      {props.label}
    </div>
  </li>
);

ValueNode.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
}

export default ValueNode;
