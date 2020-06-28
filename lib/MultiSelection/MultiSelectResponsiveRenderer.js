import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import MultiSelectOptionsList from './MultiSelectOptionsList';
import css from './MultiSelect.css';

const MultiSelectResponsiveRenderer = (props) => {
  const elem = document.getElementById('OverlayContainer');

  if (props.atSmallMedia && elem) {
    return (
      ReactDOM.createPortal(
        (
          <div className={css.mobileBackdrop} data-open={props.isOpen} hidden={!props.isOpen}>
            <div className={css.mobileContainer}>
              <MultiSelectOptionsList {...props} />
            </div>
          </div>
        ),
        elem
      )
    );
  }
  return <MultiSelectOptionsList {...props} />;
};

MultiSelectResponsiveRenderer.propTypes = {
  atSmallMedia: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default MultiSelectResponsiveRenderer;
