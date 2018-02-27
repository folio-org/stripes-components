import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './MetaSection.css';
import AccessibleFocus from '../AccessibleFocus';

const propTypes = {
  contentId: PropTypes.string,
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  open: PropTypes.bool,
  id: PropTypes.string,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
};

const MetaAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let iconElem = null; // eslint-disable-line
  let containerElem = null;

  let openIcon = (<Icon size="small" icon="up-caret" ref={(r) => { iconElem = r; }} />);
  if (props.open) {
    openIcon = (<Icon size="small" icon="down-caret" ref={(r) => { iconElem = r; }} />);
  }

  function handleHeaderClick(e) {
    const { id, label } = props;
    props.onToggle({ id, label });
    e.stopPropagation();
  }

  function handleKeyPress(e) {
    e.preventDefault();
    if (e.charCode === 13 || e.charCode === 32) { // enter key or space key...
      if (e.target === toggleElem || e.target === labelElem || e.target === containerElem) {
        const { id, label } = props;
        props.onToggle({ id, label });
      }
    }
  }

  const { label, open, displayWhenOpen, displayWhenClosed, contentId } = props;

  return (
    <div role="heading" aria-level="2" className={css.headerWrapper} ref={(ref) => { containerElem = ref; }} >
      <AccessibleFocus
        component="button"
        type="button"
        tabIndex="0"
        onClick={handleHeaderClick}
        onKeyPress={handleKeyPress}
        aria-controls={contentId}
        aria-expanded={open}
        role="tab"
        ref={(ref) => { toggleElem = ref; }}
      >
        <div className={css.metaHeader}>
          {openIcon}
          <div ref={(ref) => { labelElem = ref; }}>
            <div className={css.metaHeaderLabel} >{label}</div>
          </div>
        </div>
      </AccessibleFocus>
      {open ? displayWhenOpen : displayWhenClosed}
    </div>
  );
};

MetaAccordionHeader.propTypes = propTypes;

export default MetaAccordionHeader;
