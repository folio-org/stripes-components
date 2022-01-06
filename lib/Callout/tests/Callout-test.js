/**
 * Callout tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Callout as CalloutInteractor, calloutTypes } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Callout from '../Callout';

describe('Callout', () => {
  const callout = CalloutInteractor();
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
    callout.has({ type: calloutTypes.success });
  });

  it('Should display a callout after sendCallout() has been called with a type of "error"', () => {
    callout.has({ type: calloutTypes.error });
  });

  it('Should display a callout after sendCallout() has been called with a type of "info"', () => {
    CalloutInteractor('Info').exists();
  });

  it('Should display a callout after sendCallout() has been called with a type of "warning"', () => {
    callout.has({ type: calloutTypes.warning });
  });

  describe('dismissing the callout', () => {
    const dismissCallout = CalloutInteractor('Dismiss me');
    const dismissRef = React.createRef();

    beforeEach(async () => {
      await mount(
        <div id="OverlayContainer">
          <Callout ref={dismissRef} />
        </div>
      );

      dismissRef.current.sendCallout({ message: 'Dismiss me', timeout: 0, type: 'error' });
    });

    it('displays the callout', () => {
      dismissCallout.exists();
    });

    describe('clicking dismiss X', () => {
      beforeEach(async () => {
        await dismissCallout.dismiss();
      });

      it('hides the callout', () => {
        dismissCallout.absent();
      });
    });
  });
});
