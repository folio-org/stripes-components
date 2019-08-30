import React from 'react';
import PropTypes from 'prop-types';

import DefaultPaneFooter from './DefaultPaneFooter';

import css from './PaneFooter.css';

const PaneFooter = props => (
  <div className={css.paneFooter}>
    {props.children || <DefaultPaneFooter {...props} />}
  </div>
);

PaneFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
  ]),
};

export default PaneFooter;
