/**
 * FocusLink: Basic Usage
 */

/* eslint-disable */

import React, { Component } from 'react';
import FocusLink from '../FocusLink';
import Icon from '../../Icon';
import Headline from '../../Headline';
import css from './FocusLinkExample.css';

export default class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.skippableArea1Ref = React.createRef();
    this.skippableArea2Ref = React.createRef();
    this.skippableArea3Ref = React.createRef();
  }

  componentDidMount() {
    this.forceUpdate(); // Only needed to make the example work
    this.skippableArea1Ref.current.focus();
  }

  render() {
    return (
      <div>
        <Headline size="large">Tab through this example</Headline>
        <Headline faded>And hit enter when FocusLink&apos;s are focused to skip content</Headline>
        <div className={css.skippableArea} tabIndex="0" ref={this.skippableArea1Ref}>
          <FocusLink targetNextAfter={this.skippableArea1Ref.current}>
            <Icon icon="arrow-right" iconPosition="end">
              Skip this content
            </Icon>
          </FocusLink>
          <div className={css.skippableContent}>
            The focus will skip the content of the node passed to the <i>targetNextAfter</i>-prop
            and move focus to the next focusable element on the page
          </div>
        </div>
        <div className={css.skippableArea} tabIndex="0" ref={this.skippableArea2Ref}>
          <FocusLink target={this.skippableArea3Ref.current}>
            <Icon icon="arrow-right" iconPosition="end">
              Skip this content
            </Icon>
          </FocusLink>
          <div className={css.skippableContent}>
            The focus will move directly to the node passed to the <i>target</i>-prop
          </div>
        </div>
        <div className={css.skippableArea} tabIndex="0" ref={this.skippableArea3Ref}>
          <div className={css.skippableContent}>
            The hidden <i>FocusLink</i> below will reveal itself when focused.
            Pressing enter will move the focus to the first container using the <i>target</i>-prop
          </div>
          <FocusLink target={this.skippableArea1Ref.current} showOnFocus>
            <Icon icon="arrow-up">
              Go to top
            </Icon>
          </FocusLink>
        </div>
      </div>
    );
  }
}
