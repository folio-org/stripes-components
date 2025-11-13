/**
 * Callout tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Callout as CalloutInteractor, calloutTypes } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Callout from '../Callout';

describe('Callout', () => {
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
    return CalloutInteractor('Success').has({ type: calloutTypes.success });
  });

  it('Should display a callout after sendCallout() has been called with a type of "error"', () => {
    return CalloutInteractor('Error').has({ type: calloutTypes.error });
  });

  it('Should display a callout after sendCallout() has been called with a type of "info"', () => {
    return CalloutInteractor('Info').exists();
  });

  it('Should display a callout after sendCallout() has been called with a type of "warning"', () => {
    return CalloutInteractor('Warning').has({ type: calloutTypes.warning });
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
      return dismissCallout.exists();
    });

    describe('clicking dismiss X', () => {
      beforeEach(async () => {
        await dismissCallout.dismiss();
      });

      it('hides the callout', () => {
        return dismissCallout.absent();
      });
    });
  });

  describe('dedupe functionality', () => {
    const dedupeRef = React.createRef();

    beforeEach(async () => {
      await mount(
        <div id="OverlayContainer">
          <Callout ref={dedupeRef} />
        </div>
      );
    });

    describe('when dedupe is false (default)', () => {
      beforeEach(async () => {
        dedupeRef.current.sendCallout({ message: 'Duplicate message', timeout: 999999, type: 'success' });
        dedupeRef.current.sendCallout({ message: 'Duplicate message', timeout: 999999, type: 'success' });
        dedupeRef.current.sendCallout({ message: 'Duplicate message', timeout: 999999, type: 'success' });
      });

      it('displays multiple callouts with the same message', () => {
        return CalloutInteractor().has({ count: 3 });
      });
    });

    describe('when dedupe is true', () => {
      beforeEach(async () => {
        dedupeRef.current.sendCallout({ message: 'Deduped message', timeout: 999999, type: 'success', dedupe: true });
        dedupeRef.current.sendCallout({ message: 'Deduped message', timeout: 999999, type: 'success', dedupe: true });
        dedupeRef.current.sendCallout({ message: 'Deduped message', timeout: 999999, type: 'success', dedupe: true });
      });

      it('displays only one callout', () => {
        return CalloutInteractor().has({ count: 1 });
      });
    });

    describe('when dedupe is true with different types', () => {
      beforeEach(async () => {
        dedupeRef.current.sendCallout({ message: 'Same text', timeout: 999999, type: 'success', dedupe: true });
        dedupeRef.current.sendCallout({ message: 'Same text', timeout: 999999, type: 'error', dedupe: true });
        dedupeRef.current.sendCallout({ message: 'Same text', timeout: 999999, type: 'warning', dedupe: true });
      });

      it('displays separate callouts for different types', () => {
        return CalloutInteractor().has({ count: 3 });
      });
    });

    describe('when callout is removed', () => {
      let calloutId;

      beforeEach(async () => {
        calloutId = dedupeRef.current.sendCallout({ message: 'Removable', timeout: 999999, type: 'info', dedupe: true });
        dedupeRef.current.removeCallout(calloutId);
      });

      it('allows the same message to be displayed again', async () => {
        dedupeRef.current.sendCallout({ message: 'Removable', timeout: 999999, type: 'info', dedupe: true });
        return CalloutInteractor('Removable').exists();
      });
    });
  });
});
