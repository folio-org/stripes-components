import React from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';
import Icon from '../../Icon';
import Button from '../../Button';
import css from '../Accordion.css';

class FilterAccordionHeader extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    contentId: PropTypes.string,
    onToggle: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    open: PropTypes.bool,
    displayWhenOpen: PropTypes.element,
    displayWhenClosed: PropTypes.element,
    displayClearButton: PropTypes.bool,
    onClearFilters: PropTypes.func,
  };

  static defaultProps = {
    displayClearButton: true,
  };

<<<<<<< HEAD
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
=======
  handleHeaderClick = (e) => {
    if (contains(this.clearElem, e.target)) {
      this.props.onClearFilters(e);
      e.stopPropagation();
    } else if (contains(this.toggleElem, e.target) ||
      e.target === this.labelElem ||
      e.target === this.containerElem ||
      e.target === this.iconElem) {
      const { id, label } = this.props;
      this.props.onToggle({ id, label });
>>>>>>> filters: added clear-all button to headers
      e.stopPropagation();
    }
  }

  handleKeyPress = (e) => {
    e.preventDefault();
    if (e.charCode === 13 || e.charCode === 32) { // enter key or space key...
      if (e.target === this.clearElem) {
        this.props.onClearFilters(e);
        e.stopPropagation();
      } else if (e.target === this.toggleElem || e.target === this.labelElem || e.target === this.containerElem) {
        const { id, label } = this.props;
        this.props.onToggle({ id, label });
      }
    }
  }

  render() {
    const { label, open, displayWhenOpen, displayWhenClosed, displayClearButton, contentId } = this.props;

    return (
      <div role="heading" aria-level="2" className={css.headerWrapper} ref={(ref) => { this.containerElem = ref; }} >
        <Button
          buttonStyle="transparent"
          type="button"
          tabIndex="0"
          onClick={this.handleHeaderClick}
          onKeyPress={this.handleKeyPress}
          aria-label={`${label} filter list`}
          aria-controls={contentId}
          aria-expanded={open}
          className={css.filterSetHeader}
          role="tab"
          buttonRef={(ref) => { this.toggleElem = ref; }}
        >
          <Icon size="small" icon={`${open ? 'up' : 'down'}-caret`} ref={(r) => { this.iconElem = r; }} />
          <div className={css.labelArea} ref={(ref) => { this.labelElem = ref; }}>
            <div className={css.filterSetlabel} >{label}</div>
          </div>
          { displayClearButton ?
            <span ref={(r) => { this.clearElem = r; }}>
              <Icon size="small" icon="clearX" />
            </span>
            :
            null
          }
        </Button>
        {open ? displayWhenOpen : displayWhenClosed}
      </div>
    );
  }
}

export default FilterAccordionHeader;
