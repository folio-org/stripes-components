/**
 * Modal tests
 */

import React, { useState } from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Modal as ModalInteractor, Button as ButtonInteractor, converge, including, Keyboard } from '@folio/stripes-testing';

import { RoledHTML } from '../../../tests/helpers/localInteractors';
import { mountWithContext } from '../../../tests/helpers';
import Button from '../../Button';

import Modal from '../Modal';
// import ModalInteractor from './interactor';

import {
  OVERLAY_CONTAINER_ID,
  MODULE_CONTAINER_ID,
  MAIN_NAVIGATION_ID,
} from '../../util/consts';

const triggerId = 'modal_trigger';
const ModalHarness = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div id={MAIN_NAVIGATION_ID}><span>Navigation</span></div>
      <div id={OVERLAY_CONTAINER_ID} />
      <div id={MODULE_CONTAINER_ID}>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          dismissible
          label="Test modal"
        >
          <Button>Hello Modal!</Button>
        </Modal>
        <Button id={triggerId} onClick={() => setIsOpen(true)}>Open Modal</Button>
      </div>
    </>
  );
}


const interactor = ModalInteractor.extend('modal')
  .selector('[class^=modalRoot---]')
  .filters({
    footerPresent: (el) => !!el.querySelector('[class*=modalFooter---]'),
    headerPresent: (el) => !!el.querySelector('[class*=modalHeader---]'),
    ariaLabel: (el) => el.getAttribute('aria-label'),
    ariaLabelledBy: (el) => el.getAttribute('aria-labelledby')
  });

describe('Modal', () => {
  const modal = interactor();
  const label = 'My Modal';
  const ariaLabel = 'My Modal ARIA Label';
  let onCloseFired;

  describe('rendering', () => {
    beforeEach(async () => {
      onCloseFired = false;
      await mountWithContext(
        <Modal
          open
          dismissible
          closeOnBackgroundClick
          wrappingElement="form"
          label={label}
          ariaLabel={ariaLabel}
          onClose={() => { onCloseFired = true; }}
          footer={<div>Test</div>}
        >
          Test
        </Modal>
      );
    });

    it('Should render a form element if "wrappingElement" is set to "form"', () => RoledHTML({ tagName: 'FORM' }).exists());

    it('Should render a modal footer if an element is passed to the "footer"-prop', () => modal.has({ footerPresent: true }));

    it('Should render a close button when the "dismissible"-prop is true', () => ButtonInteractor().exists());

    it('It should render a modal header', () => interactor(label).exists());

    it(`It should have an aria-label of "${ariaLabel}"`, () => modal.has({ ariaLabel }));

    describe('When clicking the close button', () => {
      beforeEach(async () => {
        await modal.dismiss();
      });
      it('The onClose callback should be fired', () => converge(() => onCloseFired));
    });

    describe('When setting "closeOnBackgroundClick" to true', () => {
      beforeEach(async () => {
        await RoledHTML({ className: including('backdrop') }).click();
      });
      it('The onClose callback should be fired when clicking on the backdrop overlay', () => converge(() => { if (!onCloseFired) { throw Error('expected close handler to be called.') } }));
    });
  });

  describe('When the "closeOnBackgroundClick"-prop is false or undefined', () => {
    beforeEach(async () => {
      onCloseFired = false;
      await mountWithContext(
        <>
          <div id="OverlayContainer" />
          <Modal
            open
            closeOnBackgroundClick={false}
            label={label}
            onClose={() => { onCloseFired = true; }}
          >
            Test
            <button type="button">test</button>
          </Modal>
        </>
      );
      await RoledHTML({ className: including('backdrop') }).click();
    });

    it('The onClose callback should not be fired when clicking on the backdrop', () => converge(() => { if (onCloseFired) { throw Error('Expected close handler not to be fired.'); } }));

    describe('When pressing the escape key', () => {
      beforeEach(async () => {
        await Keyboard.escape();
      });

      it('The onCancel callback should be fired', () => converge(() => { if (!onCloseFired) { throw Error('Expected close handler to be fired.'); } }));
    });
  });

  describe('When setting the "open"-prop to true', () => {
    it('Modal should be present', () => modal.exists());
    it('Modal backdrop should be present', () => RoledHTML({ className: including('backdrop') }).exists());
  });

  describe('When the "showHeader"-prop is set to false', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Modal
          open
          label={label}
          showHeader={false}
        >
          Test
        </Modal>
      );
    });
    it('The modal Header should not be present', () => modal.has({ headerPresent: false }));
  });

  describe('If both aria-label and aria-labelledby props are provided', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Modal
          open
          label={label}
          showHeader={false}
          ariaLabel="testAriaLabel"
          ariaLabelledBy="testAriaLabelledBy"
        >
          Test
        </Modal>
      );
    });

    it('aria-label should not be applied', () => modal.has({ ariaLabel: null }));

    it('aria-labelledby should be applied', () => modal.has({ ariaLabelledBy: including('testAriaLabelledBy') }));
  });
});

describe('useAssistiveTechTrap tests', () => {
  const modal = interactor();
  beforeEach(async () => {
    await mountWithContext(<ModalHarness />);
  })

  it('modal is closed', () => modal.absent());
  it('no elements have inert', () => RoledHTML({ inert: true }).absent());

  describe('opening modal', () => {
    beforeEach(async () => {
      await ButtonInteractor('Open Modal').click();
    });

    it('modal is open', () => modal.exists());

    it('assigns inert elements to elements in the document', () => RoledHTML({ inert: true }).exists());

    describe('closing the modal', () => {
      beforeEach(async () => modal.dismiss());

      it('no elements have inert', () => RoledHTML({ inert: true }).absent());
      it('focuses trigger element', () => ButtonInteractor('Open Modal').is({ focused: true }));
    })
  });
});
