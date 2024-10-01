import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import css from './MultiSelect.css';

/**
 * MultiSelectResponsiveRenderer -
 *  Small screens - renders children to a portal to the div#OverlayContainer along with
 *    a darkened backdrop.
 *  Larger-than-small - renders standard Multiselect dropdown.
 * @param {*} param0
 * @returns
 */
const MultiSelectResponsiveRenderer = ({ atSmallMedia, children, isOpen }) => {
  const elem = document.getElementById('OverlayContainer');

  if (atSmallMedia && elem) {
    return (
      ReactDOM.createPortal(
        (
          <div className={css.mobileBackdrop} data-open={isOpen} hidden={!isOpen}>
            <div className={css.mobileContainer}>
              {children}
            </div>
          </div>
        ),
        elem
      )
    );
  }
  return children;
};

MultiSelectResponsiveRenderer.propTypes = {
  atSmallMedia: PropTypes.bool,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
};

export default MultiSelectResponsiveRenderer;
