import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import css from './List.css';

const propTypes = {
  listStyle: PropTypes.oneOf(['default', 'bullets']),
  itemFormatter: PropTypes.func,
  items: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  listClass: PropTypes.string,
  marginBottom0: PropTypes.bool,
  isEmptyMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const defaultProps = {
  listStyle: 'default',
  marginBottom0: false,
};

const List = (props) => {
  /**
   * Warn the developer if the list is empty
   */
  if (!props.items) {
    console.warn('stripes-components/List: items is null and/or has no children');
    return false;
  }

  /**
   * Get list classes
   */
  const getListClass = () => classNames(
    css.root,
    props.listClass,
    { [css.marginBottom0]: props.marginBottom0 },
    [css[camelCase(`list style ${props.listStyle}`)]]: props.listStyle,
  );

  /**
   * Return empty message if we have one
   * and there is no visible items
   */
  if (!props.items.length && props.isEmptyMessage) {
    return (<p className={css.isEmptyMessage}>{props.isEmptyMessage}</p>);
  }

  return (
    <ul className={getListClass()}>
      {props.items.map(props.itemFormatter, this)}
    </ul>
  );
};

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
