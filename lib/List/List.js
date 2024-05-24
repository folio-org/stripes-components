import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import css from './List.css';

const propTypes = {
  id: PropTypes.string,
  isEmptyMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  itemFormatter: PropTypes.func,
  items: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  listClass: PropTypes.string,
  listStyle: PropTypes.oneOf(['default', 'bullets']),
  marginBottom0: PropTypes.bool,
};

const List = ({
  id,
  itemFormatter = (item, i) => (<li key={i}>{item}</li>),
  listClass,
  marginBottom0 = false,
  listStyle = 'default',
  items,
  isEmptyMessage
}) => {
  /**
   * Get list classes
   */
  const getListClass = () => classNames(
    css.list,
    listClass,
    { [css.marginBottom0]: marginBottom0 },
    { [css[camelCase(`list style ${listStyle}`)]]: listStyle }
  );

  /**
   * Return empty message if we have one
   * and there is no visible items
   */
  if (!items.length && isEmptyMessage) {
    return (<p className={css.isEmptyMessage}>{isEmptyMessage}</p>);
  }

  return (
    <ul className={getListClass()} id={id}>
      {items.map(itemFormatter, this)}
    </ul>
  );
};

List.propTypes = propTypes;

export default List;
