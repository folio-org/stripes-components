import React from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';
import Icon from '../../Icon';
import css from '../Accordion.css';

const propTypes = {
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  open: PropTypes.bool,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
};

const DefaultAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let containerElem = null;
  let iconElem = null;

  let openIcon = (<Icon icon="down-caret" center ref={(r) => { iconElem = r; }} />);
  if (props.open) {
    openIcon = (<Icon icon="up-caret" center ref={(r) => { iconElem = r; }} />);
  }

  function handleHeaderClick(e) {
    if (contains(toggleElem, e.target) ||
      e.target === labelElem ||
      e.target === containerElem ||
      e.target === iconElem) {
      const { id, label } = props;
      props.onToggle({ id, label });
      e.stopPropagation();
    }
  }

  function handleKeyPress(e) {
    if (e.charCode === 13 || e.charCode === 32) { // enter key or space key...
      if (e.target === toggleElem || e.target === labelElem || e.target === containerElem) {
        const { id, label } = props;
        props.onToggle({ id, label });
      }
    }
  }

  const { label, open, displayWhenOpen, displayWhenClosed } = props;

  return (
    <div role="heading" aria-level="2" className={css.headerWrapper} ref={(ref) => { containerElem = ref; }} >
      <div className={`${css.header} ${css.default}`}>
        <button
          title={open ? 'collapse section' : 'expand section'}
          onClick={handleHeaderClick}
          onKeyPress={handleKeyPress}
          ref={(ref) => { toggleElem = ref; }}
          className={css.defaultCollapseButton}
        >
        {openIcon}
        </button>
        <div className={css.labelArea} ref={(ref) => { labelElem = ref; }}>
          {label}
        </div>
      </div>
      {open ? displayWhenOpen : displayWhenClosed}
    </div>
  );
};

DefaultAccordionHeader.propTypes = propTypes;

export default DefaultAccordionHeader;
