/**
 * FocusLink: Basic Usage
 */

import React, { Component } from 'react';
import FocusLink from '../FocusLink';
import Icon from '../../Icon';
import css from './FocusLinkExample.css';

export default class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.skippableArea1Ref = React.createRef();
    this.skippableArea2Ref = React.createRef();
    this.skippableArea3Ref = React.createRef();
  }

  componentDidMount() {
    this.skippableArea1Ref.current.focus();
  }

  render() {
    return (
      <div>
        <div className={css.skippableArea} tabIndex="-1" ref={this.skippableArea1Ref}>
          <FocusLink targetNextAfter={this.skippableArea2Ref.current}>
            <Icon icon="arrow-right" iconPosition="end">
              Skip this content
            </Icon>
          </FocusLink>
          <div className={css.skippableContent}>Skippable content</div>
        </div>
        <div className={css.skippableArea} tabIndex="-1" ref={this.skippableArea2Ref}>
          <FocusLink targetNextAfter={this.skippableArea3Ref.current}>
            <Icon icon="arrow-right" iconPosition="end">
              Skip this content
            </Icon>
          </FocusLink>
          <div className={css.skippableContent}>Skippable content</div>
        </div>
        <div className={css.skippableArea} tabIndex="-1" ref={this.skippableArea3Ref}>
          <div className={css.skippableContent}>Skippable content</div>
          <FocusLink targetNextAfter={this.skippableArea1Ref.current}>
            <Icon icon="arrow-up">
              Go to top
            </Icon>
          </FocusLink>
        </div>
      </div>
    );
  }
}
