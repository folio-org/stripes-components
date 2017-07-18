import React from 'react';
import PropTypes from 'prop-types';
import css from './List.css';

const propTypes = {
  itemFormatter: PropTypes.func,
  items: PropTypes.array.isRequired,
  listClass: PropTypes.string,
  marginBottom0: PropTypes.bool,
  isEmptyMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

function List(props) {
  function getListClass() {
    const rootClass = props.listClass ? props.listClass : css.root;
    const marginBot0 = props.marginBottom0 ? css.marginBottom0 : '';
    return `${rootClass} ${marginBot0}`;
  }

  if (!props.items) {
    console.log('stripes-components/List: items is null');
  }
  if (props.items.length === 0 && props.isEmptyMessage) {
    return <p style={{ color: '#c80', padding: '8px', marginBottom: '1rem' }}>{props.isEmptyMessage}</p>;
  }

  return (
    <ul className={getListClass()}>
      {props.items.map(props.itemFormatter, this)}
    </ul>
  );
}

List.propTypes = propTypes;

export default List;
