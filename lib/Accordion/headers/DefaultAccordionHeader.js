import React from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';
import Icon from '../../Icon';
import css from '../Accordion.css';

const propTypes = {
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  open: PropTypes.bool,
  id: PropTypes.string,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
  toggleRef: PropTypes.func,
};

const DefaultAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let containerElem = null;
  let iconElem = null;

  let openIcon = (<Icon size="small" icon="up-caret" ref={(r) => { iconElem = r; }} />);
  if (props.open) {
    openIcon = (<Icon size="small" icon="down-caret" ref={(r) => { iconElem = r; }} />);
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

  const { label, open, displayWhenOpen, displayWhenClosed } = props;

  // Content in the right side of the header
  let headerRight = null;
  const headerRightContent = open ? displayWhenOpen : displayWhenClosed;
  if (headerRightContent) {
    headerRight = <div className={css.headerDefaultContentRight}>{headerRightContent}</div>;
  }

  return (
    <div role="heading" aria-level="2" className={css.headerWrapper} ref={(ref) => { containerElem = ref; }} >
      <div className={`${css.header} ${css.default}`}>
        <button
          title={open ? 'collapse section' : 'expand section'}
          type="button"
          onClick={handleHeaderClick}
          onKeyPress={handleKeyPress}
          onKeyUp={e => e.preventDefault()}
          ref={(ref) => { props.toggleRef(ref); toggleElem = ref; }}
          className={css.defaultCollapseButton}
        >
          {openIcon}
          <div className={css.labelArea} ref={(ref) => { labelElem = ref; }}>
            {label}
          </div>
        </button>
      </div>
      { headerRight }
    </div>
  );
};

DefaultAccordionHeader.propTypes = propTypes;

export default DefaultAccordionHeader;
