/**
 * Tooltip
 */

import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper/Popper';
import css from './Tooltip.css';

const PORTAL_ELEMENT = 'OverlayContainer';
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

  static defaultProps = {
    placement: 'bottom',
  }

  constructor(props) {
    super(props);
    this.triggerRef = props.triggerRef || createRef(null);
  }

  state = {
    open: false,
  }

  componentDidMount() {
    this.portal = document.getElementById(PORTAL_ELEMENT);

    if (this.triggerRef && this.triggerRef.current) {
      this.triggerEl = this.triggerRef.current;

      SHOW_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.addEventListener(listener, this.show, true);
      });

      HIDE_EVENT_LISTENERS.forEach(listener => {
        this.triggerEl.addEventListener(listener, this.hide, true);
      });

      this.validateTriggerElement();
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
   * Render proximity element – only available for screen readers
   */
  renderProximityElement = () => {
    const { text, sub } = this.props;
    const ariaIds = this.getAriaIds();

    return (
      <span className="sr-only" data-test-tooltip-proximity-element>
        { text && <span role="tooltip" id={ariaIds.text}>{text}</span> }
        { sub && <span role="tooltip" id={ariaIds.sub}>{sub}</span> }
      </span>
    );
  }

  /**
   * Get assistive ID's used for aria-labelledby/aria-describedby
   */
  getAriaIds = () => {
    const { id, text, sub } = this.props;
    const ids = {};

    if (text) {
      ids.text = `${id}-text`;
    }

    if (sub) {
      ids.sub = `${id}-sub`;
    }

    return ids;
  }

  /**
   * Validate the trigger element
   * Here we validate that the correct assitive ID's are present
   */
  validateTriggerElement = () => {
    // Get array of aria IDs we expect to be present on the trigger element
    const ariaIds = Object.keys(this.getAriaIds()).map(key => this.getAriaIds()[key]);

    // Get list of all aria values on the trigger as a string
    const triggerAriaValues = Array.from(get(this.triggerEl, 'attributes', []))
      .filter(attr => attr.name.indexOf('aria') >= 0)
      .map(attr => attr.value)
      .join(' ');

    // Check if the correct ID's are present
    const hasCorrectIds = ariaIds.filter(id => triggerAriaValues.indexOf(id) >= 0).length === ariaIds.length;

    // // Make it clear for the developer that something is wrong
    if (!hasCorrectIds) {
      this.triggerEl.style.backgroundColor = 'red';
    }
  }

  /**
   * Get the props for the trigger element
   * Note: These props will be spread onto the trigger element
   */
  getRenderProps = () => {
    return {
      ref: this.triggerRef,
      ariaIds: this.getAriaIds(),
    };
  }

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
          <div className={css.tooltip} aria-hidden data-test-tooltip>
            {text && (
              <div className={css.text} data-test-tooltip-text>
                {text}
              </div>
            )}
            {sub && (
              <div className={css.sub} data-test-tooltip-sub>
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
