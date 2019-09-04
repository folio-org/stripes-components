/**
 * Tooltip
 */

import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper/Popper';
import css from './Tooltip.css';

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.func,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
    shortcut: PropTypes.string,
    triggerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.elementType })
    ]),
  }

  constructor(props) {
    super(props);
    this.triggerRef = props.triggerRef || createRef(null);
    this.portal = document.getElementById('OverlayContainer');
  }

  state = {
    open: false,
    assistiveAttribute: 'aria-labelledby',
  }

  componentDidMount() {
    if (this.triggerRef && this.triggerRef.current) {
      this.triggerEl = this.triggerRef.current;
      this.setAssistiveAriaAttribute();
      this.triggerEl.addEventListener('mouseover', this.show, true);
      this.triggerEl.addEventListener('mouseout', this.hide, true);
      this.triggerEl.addEventListener('focus', this.show, true);
      this.triggerEl.addEventListener('focusout', this.hide, true);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    if (this.triggerEl) {
      this.triggerEl.removeEventListener('mouseover', this.show, true);
      this.triggerEl.removeEventListener('mouseout', this.hide, true);
      this.triggerEl.removeEventListener('focus', this.show, true);
      this.triggerEl.removeEventListener('focusout', this.hide, true);
    }
  }

  toggle = (bool) => {
    const { open } = this.state;
    if (bool !== open) {
      this.setState({
        open: bool,
      });
    }
  }

  show = () => {
    this.timeout = setTimeout(() => this.toggle(true), 70);
  }

  hide = () => {
    clearTimeout(this.timeout);
    this.toggle(false);
  }

  /**
   * Set assistive aria attribute
   * 'aria-labelledby' will overwrite the label of a button
   * while 'aria-describedby' will append an additional description
   * Elements like input, textaera and select usually already have a label so
   * they should use 'aria-describedby'
   */
  setAssistiveAriaAttribute = () => {
    const hasInnerText = !!this.triggerEl.innerText;
    const tagName = this.triggerEl.tagName.toLowerCase();
    const shouldUseDescribedBy = hasInnerText || ['input', 'textarea', 'select'].indexOf(tagName) >= 0;

    this.setState({
      assistiveAttribute: shouldUseDescribedBy ? 'aria-describedby' : 'aria-labelledby',
    }, () => this.validateTriggerElement);
  }

  /**
   * Render proximity element for screen readers
   */
  renderProximityElement = () => {
    const { id, label, shortcut } = this.props;
    return (
      <span className="sr-only">
        { label && <span role="tooltip" id={`${id}-label`}>{label}</span> }
        { shortcut && <span role="tooltip" id={`${id}-shortcut`}>({shortcut})</span> }
      </span>
    );
  }

  /**
   * Validate the trigger element
   */
  validateTriggerElement = () => {
    const { assistiveAttribute } = this.state;
    const triggerAriaIds = get(this.triggerEl, `attributes.[${assistiveAttribute}].value`, '').split(' ');
    const hasCorrectIds = !!this.getAssistiveIds().filter(id => triggerAriaIds.indexOf(id) >= 0).length;

    if (!hasCorrectIds) {
      this.triggerEl.style.backgroundColor = 'red';
    }
  }

  /**
   * Get assistive ID's used for aria-labelledby/aria-describedby
   */
  getAssistiveIds = () => {
    const { id, label, shortcut } = this.props;
    const ids = [];

    if (label) {
      ids.push(`${id}-label`);
    }

    if (shortcut) {
      ids.push(`${id}-shortcut`);
    }

    return ids;
  }

  /**
   * Get the props for the trigger element
   */
  getRenderProps = () => ({
    ref: this.triggerRef,
    [this.state.assistiveAttribute]: this.getAssistiveIds().join(' '),
  })

  render() {
    const { label, placement, shortcut, children } = this.props;
    const { open } = this.state;
    const renderProps = this.getRenderProps();

    return (
      <Fragment>
        <Popper
          isOpen={open}
          anchorRef={this.triggerRef}
          portal={this.portal}
          placement={placement}
        >
          <div className={css.tooltip} aria-hidden>
            <div className={css.label}>
              {label}
            </div>
            <div className={css.shortcut}>
              {shortcut}
            </div>
          </div>
        </Popper>
        {typeof children === 'function' ? children(renderProps) : null}
        {this.renderProximityElement()}
      </Fragment>
    );
  }
}
