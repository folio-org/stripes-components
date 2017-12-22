import React from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';
import Icon from '../../Icon';
import Button from '../../Button';
import css from '../Accordion.css';

const propTypes = {
  contentId: PropTypes.string,
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  open: PropTypes.bool,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
};

const FilterAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let iconElem = null;
  let containerElem = null;

  let openIcon = (<Icon size="small" icon="down-caret" ref={(r) => { iconElem = r; }} />);
  if (props.open) {
    openIcon = (<Icon size="small" icon="up-caret" ref={(r) => { iconElem = r; }} />);
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
      <Button
        buttonStyle="transparent"
        type="button"
        tabIndex="0"
        onClick={handleHeaderClick}
        onKeyPress={handleKeyPress}
        aria-label={`${label} filter list`}
        aria-controls={contentId}
        aria-expanded={open}
        className={css.filterSetHeader}
        role="tab"
        buttonRef={(ref) => { toggleElem = ref; }}
      >
        {openIcon}
        <div className={css.labelArea} ref={(ref) => { labelElem = ref; }}>
          <div className={css.filterSetlabel} >{label}</div>
        </div>
      </Button>
      {open ? displayWhenOpen : displayWhenClosed}
    </div>
  );
};

FilterAccordionHeader.propTypes = propTypes;

export default FilterAccordionHeader;
