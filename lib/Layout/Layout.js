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

function Layout({ className, children, ...rest }) {
  function getClassName() {
    const classString = className;
    const classArray = classString.split(' ');
    const scopedArray = classArray.map(c => css[c]);
    return scopedArray.join(' ');
  }

  return (
    <div
      data-test-layout
      className={getClassName()}
      {...rest}
    >
      {children}
    </div>
  );
}

Layout.propTypes = propTypes;

export default Layout;
