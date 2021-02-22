/**
 * Callout tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';
import Callout from '../Callout';
import CalloutInteractor from './interactor';

describe('Callout', () => {
  const callout = new CalloutInteractor();
  const ref = React.createRef();

  beforeEach(async () => {
    await mount(
      <div id="OverlayContainer">
        <Callout ref={ref} />
      </div>
    );

    ref.current.sendCallout({ message: 'Error', timeout: 999999, type: 'error' });
    ref.current.sendCallout({ message: 'Success', timeout: 999999, type: 'success' });
    ref.current.sendCallout({ message: 'Info', timeout: 999999, type: 'info' });
    ref.current.sendCallout({ message: 'Warning', timeout: 999999, type: 'warning' });
  });

  it('Should display a callout after sendCallout() has been called with a type of "success"', () => {
    expect(callout.successCalloutIsPresent).to.be.true;
  });

  it('Should display a callout after sendCallout() has been called with a type of "error"', () => {
    expect(callout.errorCalloutIsPresent).to.be.true;
  });

  it('Should display a callout after sendCallout() has been called with a type of "info"', () => {
    expect(callout.infoCalloutIsPresent).to.be.true;
  });

  it('Should display a callout after sendCallout() has been called with a type of "warning"', () => {
    expect(callout.warningCalloutIsPresent).to.be.true;
  });
});
