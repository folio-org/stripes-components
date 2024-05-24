import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import css from './MultiSelect.css';

const MultiSelectResponsiveRenderer = ({atSmallMedia, children}) => {
  const elem = document.getElementById('OverlayContainer');

  if (atSmallMedia && elem) {
    return (
      ReactDOM.createPortal(
        (
          <div className={css.mobileBackdrop} data-open={props.isOpen} hidden={!props.isOpen}>
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
};

export default MultiSelectResponsiveRenderer;
