/**
 * Tooltip
 */

import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper/Popper';
import css from './Tooltip.css';

// Elements that typically uses 'aria-describedby' and not 'aria-labelledby'
// because they most likely will have an associated label alreaady
const DESCRIBED_BY_ELEMENTS = ['input', 'textarea', 'select'];

const SHOW_EVENT_LISTENERS = ['mouseover', 'focus'];
const HIDE_EVENT_LISTENERS = ['mouseout', 'focusout'];

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.func,
    id: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
    sub: PropTypes.string,
    text: PropTypes.string,
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

      SHOW_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.addEventListener(listener, this.show, true);
      });

      HIDE_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.addEventListener(listener, this.hide, true);
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    if (this.triggerEl) {
      SHOW_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.removeEventListener(listener, this.show, true);
      });

      HIDE_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.removeEventListener(listener, this.hide, true);
      });
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
    // A small delay ensures that the tooltip doesn't pop up unnecessarily
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
   * Elements like input, textarea and select usually already have a label
   * so they should use 'aria-describedby'
   */
  setAssistiveAriaAttribute = () => {
    const hasInnerText = !!this.triggerEl.innerText;
    const tagName = this.triggerEl.tagName.toLowerCase();
    const shouldUseDescribedBy = hasInnerText || DESCRIBED_BY_ELEMENTS.indexOf(tagName) >= 0;

    this.setState({
      assistiveAttribute: shouldUseDescribedBy ? 'aria-describedby' : 'aria-labelledby',
    }, this.validateTriggerElement);
  }

  /**
   * Render proximity element – only available for screen readers
   */
  renderProximityElement = () => {
    const { id, text, sub } = this.props;
    return (
      <span className="sr-only">
        { text && <span role="tooltip" id={`${id}-text`}>{text}</span> }
        { sub && <span role="tooltip" id={`${id}-sub`}>({sub})</span> }
      </span>
    );
  }

  /**
   * Get assistive ID's used for aria-labelledby/aria-describedby
   */
  getAssistiveIds = () => {
    const { id, text, sub } = this.props;
    const ids = [];

    if (text) {
      ids.push(`${id}-text`);
    }

    if (sub) {
      ids.push(`${id}-sub`);
    }

    return ids;
  }

  /**
   * Validate the trigger element
   * Here we validate that the correct assitive ID's are present
   */
  validateTriggerElement = () => {
    const { assistiveAttribute } = this.state;
    const triggerAriaIds = get(this.triggerEl, `attributes.[${assistiveAttribute}].value`, '').split(' ');
    const hasCorrectIds = !!(this.getAssistiveIds().filter(id => triggerAriaIds.indexOf(id) >= 0).length);

    // Make it clear for the developer that something is wrong
    if (!hasCorrectIds) {
      this.triggerEl.style.backgroundColor = 'red';
    }
  }

  /**
   * Get the props for the trigger element
   * Note: These props will be spread onto the trigger element
   */
  getRenderProps = () => ({
    ref: this.triggerRef,
    [this.state.assistiveAttribute]: this.getAssistiveIds().join(' '),
  })

  render() {
    const { text, placement, sub, children } = this.props;
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
            {text && (
              <div className={css.text}>
                {text}
              </div>
            )}
            {sub && (
              <div className={css.sub}>
                {sub}
              </div>
            )}
          </div>
        </Popper>
        {typeof children === 'function' ? children(renderProps) : null}
        {this.renderProximityElement()}
      </Fragment>
    );
  }
}
