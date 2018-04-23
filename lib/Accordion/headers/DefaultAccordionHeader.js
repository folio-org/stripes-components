import React from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';
import Headline from '../../Headline';
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
  autoFocus: PropTypes.bool,
};

const DefaultAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let containerElem = null;
  let iconElem = null;

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
    <div className={css.headerWrapper} ref={(ref) => { containerElem = ref; }} >
      <div className={`${css.header} ${css.default}`}>
        <Headline size="medium" tag="h3">
          <button
            title={open ? 'collapse section' : 'expand section'}
            type="button"
            onClick={handleHeaderClick}
            onKeyPress={handleKeyPress}
            onKeyUp={e => e.preventDefault()}
            ref={(ref) => { props.toggleRef(ref); toggleElem = ref; }}
            className={css.defaultCollapseButton}
            autoFocus={props.autoFocus}
          >
            <Icon size="medium" icon={props.open ? 'up-caret' : 'down-caret'} ref={(r) => { iconElem = r; }} />
            <div className={css.labelArea} ref={(ref) => { labelElem = ref; }}>
              {label}
            </div>
          </button>
        </Headline>
      </div>
      { headerRight }
    </div>
  );
};

DefaultAccordionHeader.propTypes = propTypes;

export default DefaultAccordionHeader;
