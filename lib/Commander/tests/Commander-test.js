import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Interactor } from '@bigtest/interactor';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from '../../../tests/helpers';

import CommandList from '../CommandList';
import HasCommand from '../HasCommand';
import CommanderTestHarness from './Commander-test-harness';
import { defaultKeyboardShortcuts } from '../keyboardShortcuts';

const newHandler = sinon.spy();
const innerHandler = sinon.spy();
const innerSaveHandler = sinon.spy();
const scopedHandler = sinon.spy();

const testShortcuts = defaultKeyboardShortcuts.filter((f) => f.name !== 'new');

const commands = [...testShortcuts,
  {
    name: 'new',
    label: 'make new thing',
    shortcut: 'alt+n',
    handler: newHandler
  },
];

const resetCounts = () => {
  newHandler.resetHistory();
  innerSaveHandler.resetHistory();
  innerHandler.resetHistory();
  scopedHandler.resetHistory();
};

describe('CommandList, HasCommand', () => {
  const outerInteractor = new Interactor('[data-test-focusable]');
  const innerInteractor = new Interactor('[data-test-inner-focusable]');

  describe('Rendering', () => {
    beforeEach(async () => {
      resetCounts();
      await mount(
        <CommandList
          id="test-ComList"
          commands={commands}
        >
          <div data-test-module-outer>
            <fieldset style={{ border: '1px solid #666', padding:'12px' }}>
              <legend> Outer level</legend>
              <button type="button" data-test-focusable>Outer focusable (button)</button>
              <HasCommand
                id="test-HComm-inner"
                commands={[
                  {
                    name: 'new',
                    handler: innerHandler
                  },
                  {
                    name: 'save',
                    handler: innerSaveHandler
                  }
                ]}
              >
                <div data-test-module-inner>
                  <fieldset style={{ border: '1px solid #600', padding:'12px' }}>
                    <legend> Inner level (unscoped HasCommand)</legend>
                    <button type="button" data-test-inner-focusable>Inner focusable (button)</button>
                  </fieldset>
                </div>
              </HasCommand>
              <HasCommand
                id="test-HComm-scoped"
                commands={[
                  {
                    name: 'edit',
                    shortcut: 'mod+i',
                    handler: scopedHandler
                  },
                ]}
                scope={document.body}
                isWithinScope={() => true}
              >
                <div data-test-module-sibling>
                  <fieldset style={{ border: '1px solid #E0E', padding:'12px' }}>
                    <legend> Scoped HasCommand</legend>
                    <button type="button">Scoped focusable (button)</button>
                  </fieldset>
                </div>
              </HasCommand>
            </fieldset>
          </div>
        </CommandList>
      );
    });

    it('renders children', () => {
      expect(outerInteractor.isPresent).to.be.true;
    });

    describe('Globally scoped handler is effective', () => {
      beforeEach(async () => {
        await outerInteractor.focus();
        await outerInteractor.trigger('keydown', { keyCode: 17, key: 'Control' });
        await outerInteractor.trigger('keydown', { ctrlKey: true, char: 'i', keyCode: 73 });
        // Safari equivalent for the "mod+i" shortcut
        await outerInteractor.trigger('keydown', { keyCode: 91 }); // leftCommand
        await outerInteractor.trigger('keydown', { metaKey: true, char: 'i', keyCode: 73 });
      });

      it('calls the globally scoped handler', () => {
        expect(scopedHandler.called).to.be.true;
      });
    });

    describe('Handler active within outer layer', () => {
      beforeEach(async () => {
        await outerInteractor.focus();
        await outerInteractor.trigger('keydown', { keyCode: 18, key: 'Alt' });
        await outerInteractor.trigger('keydown', { altKey: true, char: 'n', keyCode: 78 });
        await outerInteractor.blur();
      });

      it('calls the top level handler', () => {
        expect(newHandler.calledOnce).to.be.true;
      });
    });

    describe('Override Handler active within tree', () => {
      beforeEach(async () => {
        await innerInteractor.focus();
        await innerInteractor.trigger('keydown', { keyCode: 18, key: 'Alt' });
        await innerInteractor.trigger('keydown', { altKey: true, char: 'n', keyCode: 78 });
      });

      it('calls the override handler', () => {
        expect(innerHandler.calledOnce).to.be.true;
      });
    });

    describe('Newly assigned Handler active within tree', () => {
      beforeEach(async () => {
        await innerInteractor.focus();
        await innerInteractor.trigger('keydown', { keyCode: 17, key: 'Control' });
        await innerInteractor.trigger('keydown', { ctrlKey: true, char: 's', keyCode: 83 });
        // Safari equivalent with Mac's Command Key used by the "mod+s" shortcut
        await innerInteractor.trigger('keydown', { keyCode: 91 }); // leftCommand
        await innerInteractor.trigger('keydown', { metaKey: true, char: 's', keyCode: 83 });
      });

      it('calls the assigned handler (save)', () => {
        expect(innerSaveHandler.called).to.be.true;
      });
    });

    describe('Newly assigned Handler inactive at outer layer', () => {
      beforeEach(async () => {
        await outerInteractor.focus();
        await outerInteractor.trigger('keydown', { keyCode: 17, key: 'Control' });
        await outerInteractor.trigger('keydown', { ctrlKey: true, char: 's', keyCode: 83 });
        // Safari equivalent with Mac's Command Key used by the "mod+s" shortcut
        await outerInteractor.trigger('keydown', { keyCode: 91 }); // leftCommand
        await outerInteractor.trigger('keydown', { metaKey: true, char: 's', keyCode: 83 });
      });

      it('does not call the assigned handler', () => {
        expect(innerSaveHandler.notCalled).to.be.true;
      });
    });
  });

  describe('Changing handlers, functional component usage', () => {
    const formInput = new Interactor('input');
    beforeEach(async () => {
      await resetCounts();
      await mount(
        <CommanderTestHarness commands={{ save: innerSaveHandler }} />
      );
    });

    describe('Changing the field, executing command', () => {
      beforeEach(async () => {
        await formInput.$root.focus();
        await formInput.fill('test');
        await formInput.trigger('keydown', { keyCode: 17, key: 'Control' });
        await formInput.trigger('keydown', { ctrlKey: true, char: 's', keyCode: 83 });
        // Safari equivalent with Mac's Command Key used by the "mod+s" shortcut
        await formInput.trigger('keydown', { keyCode: 91 }); // leftCommand
        await formInput.trigger('keydown', { metaKey: true, char: 's', keyCode: 83 });
      });

      it('calls the assigned handler (save)', () => {
        expect(innerSaveHandler.called).to.be.true;
      });
    });
  });
});
