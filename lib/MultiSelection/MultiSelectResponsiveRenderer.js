import React from 'react';
import ReactDOM from 'react-dom';
import MultiSelectOptionsList from './MultiSelectOptionsList';
import css from './MultiSelect.css';

 const MultiSelectResponsiveRenderer = (props) => {
  
  const elem = document.getElementById('OverlayContainer');

  if (props.atSmallMedia && elem) {
    return (
      ReactDOM.createPortal(
        (<div className={css.mobileBackdrop} hidden={!props.isOpen}>
          <div className={css.mobileContainer}>
            <MultiSelectOptionsList {...props}/>
          </div>
        </div>),
        elem
      )
    );
  }
  return <MultiSelectOptionsList {...props}/>;
};

export default MultiSelectResponsiveRenderer;
