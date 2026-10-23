import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

const dispatchKeydown = (el, opts) => {
  el.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...opts,
  }));
};

describe('AltGraph short-circuit:', () => {
  let handler;

  beforeEach(async () => {
    handler = sinon.spy();
    const el = createRef();

    await mount(
      <HotKeys keyMap={{ save: 'ctrl + alt + e' }} handlers={{ save: handler }} id="outer" attach={el}>
        <input aria-label="childElement" ref={el} />
      </HotKeys>
    );

    await Input('childElement').focus();
  });

  describe('when AltGraph is active on the keydown that completes the combo', () => {
    beforeEach(async () => {
      await Input('childElement').perform((el) => {
        dispatchKeydown(el, { key: 'Control', keyCode: 17, ctrlKey: true });
        dispatchKeydown(el, { key: 'Alt', keyCode: 18, altKey: true, ctrlKey: true });
        dispatchKeydown(el, {
          key: 'e',
          keyCode: 69,
          ctrlKey: true,
          altKey: true,
          modifierAltGraph: true,
        });
      });
    });

    it('does not call the handler', async () => {
      await converge(() => handler.notCalled);
    });
  });

  describe('when the same combo is pressed without AltGraph', () => {
    beforeEach(async () => {
      await Input('childElement').perform((el) => {
        dispatchKeydown(el, { key: 'Control', keyCode: 17, ctrlKey: true });
        dispatchKeydown(el, { key: 'Alt', keyCode: 18, altKey: true, ctrlKey: true });
        dispatchKeydown(el, { key: 'e', keyCode: 69, ctrlKey: true, altKey: true });
      });
    });

    it('calls the handler as normal', async () => {
      await converge(() => handler.called);
    });
  });
});
