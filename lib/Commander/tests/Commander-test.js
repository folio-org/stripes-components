import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { Interactor } from '@bigtest/interactor';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import CommandList from '../CommandList';
import HasCommand from '../HasCommand';

let newHandled = false;
let innerHandled = false;
let innerSaveHandled = false;
let scopedHandled = false;

const commands = [
  {
    name: 'save',
    label: 'save and close',
    shortcut: 'mod+s',
  },
  {
    name: 'new',
    label: 'make new thing',
    shortcut: 'alt+n',
    handler: () => { newHandled = true; }
  },
];

const innerHandler = () => { innerHandled = true; };
const innerSaveHandler = () => { innerSaveHandled = true; };
const scopedHandler = () => { scopedHandled = true; };

describe('CommandList, HasCommand', () => {
  const focusableInteractor = new Interactor('[data-test-focusable]');
  const innerInteractor = new Interactor('[data-test-inner-focusable]');

  newHandled = false;
  innerHandled = false;
  innerSaveHandled = false;
  scopedHandled = false;

  describe('Rendering', () => {
    beforeEach(async () => {
      await mount(
        <CommandList
          commands={commands}
        >
          <div data-test-module-outer>
            <button type="button" data-test-focusable>Test</button>
            <HasCommand
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
                <button type="button" data-test-inner-focusable>Test</button>
              </div>
            </HasCommand>
            <HasCommand
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
                <button type="button">scoped</button>
              </div>
            </HasCommand>
          </div>
        </CommandList>
      );
    });

    it('renders children', () => {
      expect(focusableInteractor.isPresent).to.be.true;
    });

    describe('Globally scoped handler is effective', () => {
      beforeEach(async () => {
        scopedHandled = false;
        await focusableInteractor.focus();
        await focusableInteractor.trigger('keydown', { ctrlKey: true, char: 'i', keyCode: 73 });
        // Safari equivalent for the "mod+i" shortcut
        await focusableInteractor.trigger('keydown', { metaKey: true, char: 'i', keyCode: 73 });
      });

      it('calls the globally scoped handler', () => {
        expect(scopedHandled).to.be.true;
      });
    });

    describe('Handler active within outer layer', () => {
      beforeEach(async () => {
        await focusableInteractor.focus();
        await focusableInteractor.trigger('keydown', { altKey: true, char: 'n', keyCode: 78 });
      });

      it('calls the top level handler', () => {
        expect(newHandled).to.be.true;
      });

      describe('Override Handler active within tree', () => {
        beforeEach(async () => {
          await innerInteractor.focus();
          await innerInteractor.trigger('keydown', { altKey: true, char: 'n', keyCode: 78 });
        });

        it('calls the override handler', () => {
          expect(innerHandled).to.be.true;
        });
      });

      describe('Newly assigned Handler active within tree', () => {
        beforeEach(async () => {
          await innerInteractor.focus();
          await innerInteractor.trigger('keydown', { ctrlKey: true, char: 's', keyCode: 83 });
          // Safari equivalent with Mac's Command Key used by the "mod+s" shortcut
          await innerInteractor.trigger('keydown', { metaKey: true, char: 's', keyCode: 83 });
        });

        it('calls the assigned handler', () => {
          expect(innerSaveHandled).to.be.true;
        });

        describe('Newly assigned Handler inactive at outer layer', () => {
          beforeEach(async () => {
            innerSaveHandled = false;
            await focusableInteractor.focus();
            await focusableInteractor.trigger('keydown', { ctrlKey: true, char: 's', keyCode: 83 });
            // Safari equivalent with Mac's Command Key used by the "mod+s" shortcut
            await focusableInteractor.trigger('keydown', { metaKey: true, char: 's', keyCode: 83 });
          });

          it('does not call the assigned handler', () => {
            expect(innerSaveHandled).to.be.false;
          });
        });
      });
    });
  });
});
