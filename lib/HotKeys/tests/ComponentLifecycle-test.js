import React, { createRef, useState } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;
const Button = Bigtest.Button;

describe('Component lifecycle:', () => {
  const keyMap = {
    'ENTER': 'enter',
    'TAB': 'tab',
  };

  describe('when component mounts', () => {
    let handler;

    beforeEach(async () => {
      handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();

      await mount(
        <HotKeys keyMap={keyMap} handlers={handlers} attach={el}>
          <input aria-label="childElement" ref={el} />
        </HotKeys>
      );
    });

    it('then none of the handlers are called', async () => {
      await converge(() => handler.notCalled);
    });

    describe('and focused', () => {
      beforeEach(async () => {
        await Input('childElement').focus();
      });

      it('then none of the handlers are called', async () => {
        await converge(() => handler.notCalled);
      });

      describe('and a key matching a hot key is pressed', () => {
        beforeEach(async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });
        });

        it('then calls the correct handler', async () => {
          await converge(() => handler.called);
        });
      });
    });
  });

  describe('when the component has been unmounted', () => {
    let handler;

    const Wrapper = () => {
      const [mounted, setMounted] = useState(true);
      const elRef = createRef();

      return (
        <div>
          <button type="button" onClick={() => setMounted(false)}>Unmount HotKeys</button>
          {mounted ? (
            <HotKeys keyMap={keyMap} handlers={{ 'ENTER': handler }} attach={elRef}>
              <input aria-label="childElement" ref={elRef} />
            </HotKeys>
          ) : (
            <input aria-label="childElement" ref={elRef} />
          )}
        </div>
      );
    };

    beforeEach(async () => {
      handler = sinon.spy();

      await mount(<Wrapper />);

      await Input('childElement').focus();
      await Button('Unmount HotKeys').click();
      await Input('childElement').focus();
    });

    it('then does not call the handler when a key matching a hot key is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => handler.notCalled);
    });
  });
});
