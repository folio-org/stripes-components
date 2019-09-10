import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './DefaultPaneFooter.css';

const DefaultPaneFooter = ({ renderStart, renderEnd, className }) => (
  <div className={classNames(css.paneFooterContent, className)}>
    <span
      data-test-pane-footer-start
      className={css.renderStart}
    >
      {renderStart}
    </span>
    {renderEnd && <span data-test-pane-footer-end>{renderEnd}</span>}
  </div>
);

DefaultPaneFooter.propTypes = {
  className: PropTypes.string,
  renderEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  renderStart: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default DefaultPaneFooter;
