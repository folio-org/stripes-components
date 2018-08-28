import React from 'react';
import PropTypes from 'prop-types';
import css from './Layout.css';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

function Layout(props) {
  function getClassName() {
    const classString = props.className;
    const classArray = classString.split(' ');
    const scopedArray = classArray.map(c => css[c]);
    return scopedArray.join(' ');
  }

  return (
    <div className={getClassName()}>{props.children}</div>
  );
}

Layout.propTypes = propTypes;

export default Layout;
