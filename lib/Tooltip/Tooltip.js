/**
 * Tooltip
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import get from 'lodash/get';
import childrenOf from '../../util/childrenOf';
import Popper, { AVAILABLE_PLACEMENTS } from '../Popper';
import css from './Tooltip.css';

const PORTAL_ELEMENT = 'OverlayContainer';
const SHOW_EVENT_LISTENERS = ['mouseover', 'focus'];
const HIDE_EVENT_LISTENERS = ['mouseout', 'focusout'];

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.func,
    hideOnTouch: PropTypes.bool,
    id: PropTypes.string.isRequired,
    modifiers: PropTypes.object,
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
    sub: PropTypes.oneOfType([
      PropTypes.string,
      childrenOf(FormattedMessage)
    ]),
    text: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      childrenOf(FormattedMessage).isRequired
    ]).isRequired,
    triggerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.elementType }),
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
  }

  static defaultProps = {
    placement: 'bottom',
    modifiers: {
      flip: { boundariesElement: 'viewport', padding: 10 },
      preventOverflow: { boundariesElement: 'viewport', padding: 10 }
    }
  }

  constructor(props) {
    super(props);
    this.triggerRef = props.triggerRef || createRef(null);
    this.overlayRef = createRef(null);
  }

  state = {
    open: false,
  }

  componentDidMount() {
    this.portal = document.getElementById(PORTAL_ELEMENT);

    if (this.triggerRef && this.triggerRef.current) {
      this.triggerEl = this.triggerRef.current;

      this.triggerEl.addEventListener('keydown', this.handleKeyDown, true);

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

      this.triggerEl.removeEventListener('keydown', this.handleKeyDown, true);
    }
  }

  /**
   * Show, hide and toggle tooltip
   */
  toggle = (bool) => {
    const { hideOnTouch } = this.props;
    const { open } = this.state;
    const isTouch = matchMedia('(hover: none)').matches;
    const disable = hideOnTouch && isTouch;
    clearTimeout(this.timeout);

    // Accessibuilty - When hiding the tooltip, ensure that the mouse is not hovered over the tooltip
    // - for mouse readers (WCAG 2.1 - 1.4.13 )
    if (!bool) {
      if (!this.overlayRef?.current?.matches(':hover') &&
        !this.triggerRef?.current?.matches(':hover')
      ) {
        this.setState({
          open: bool,
        });
      }
    } else {
      if (bool !== open && !disable) {
        this.setState({
          open: bool,
        });
      }
    }
  }

  show = () => {
    clearTimeout(this.timeout);
    // A small delay ensures that the tooltip doesn't pop up unnecessarily
    this.timeout = setTimeout(() => this.toggle(true), 70);
  }

  hide = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.toggle(false), 150);
  }

  /**
   * Close tooltip on escape
   */
  handleKeyDown = ({ key }) => {
    if (key === 'Escape') {
      this.hide();
    }
  }

  /**
   * Render proximity element – only available for screen readers
   */
  renderProximityElement = () => {
    const { text, sub } = this.props;
    const ariaIds = this.getAriaIds();

    return (
      <span className="sr-only" data-test-tooltip-proximity-element>
        {text && <span role="tooltip" id={ariaIds.text}>{text}</span>}
        {sub && <span role="tooltip" id={ariaIds.sub}>{sub}</span>}
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
      .filter(attr => attr.name.includes('aria'))
      .map(attr => attr.value)
      .join(' ');

    // Check if the correct ID's are present
    const hasCorrectIds = ariaIds.filter(id => triggerAriaValues.includes(id)).length === ariaIds.length;

    // // Make it clear for the developer that something is wrong
    if (!hasCorrectIds) {
      console.warn(
        'For accessibility reasons, your <Tooltip> trigger element:', this.triggerEl,
        'should include one or both of the following attributes: aria-labelledby',
        'and/or aria-describedby with the relevant ID(s):', ariaIds, '.',
        'See the <Tooltip> readme for more information.'
      );
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
    const { text, placement, sub, children, modifiers } = this.props;
    const { open } = this.state;
    const renderProps = this.getRenderProps();

    return (
      <>
        <Popper
          isOpen={open}
          anchorRef={this.triggerRef}
          portal={this.portal}
          placement={placement}
          modifiers={modifiers}
        >
          <div className={css.tooltip} ref={this.overlayRef} onMouseLeave={()=>this.hide()} aria-hidden data-test-tooltip>
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
      </>
    );
  }
}
