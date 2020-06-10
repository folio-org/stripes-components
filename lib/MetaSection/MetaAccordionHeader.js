import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Headline from '../Headline';
import css from './MetaSection.css';

const propTypes = {
  contentId: PropTypes.string,
  displayWhenClosed: PropTypes.element,
  displayWhenOpen: PropTypes.element,
  headerElement: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

const defaultProps = {
  headerElement: 'h4'
};

const MetaAccordionHeader = (props) => {
  let toggleElem = null;
  let labelElem = null;
  let containerElem = null;

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
    <div className={css.headerWrapper} ref={(ref) => { containerElem = ref; }}>
      <Headline className="sr-only" size="small" margin="none" tag={props.headerElement}>Update information</Headline>
      <button
        className={css.metaHeaderButton}
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
          <Icon size="small" icon={props.open ? 'caret-up' : 'caret-down'} />
          <div ref={(ref) => { labelElem = ref; }}>
            <div className={css.metaHeaderLabel}>{label}</div>
          </div>
        </div>
      </button>
      {open ? displayWhenOpen : displayWhenClosed}
    </div>
  );
};

MetaAccordionHeader.propTypes = propTypes;
MetaAccordionHeader.defaultProps = defaultProps;

export default MetaAccordionHeader;
