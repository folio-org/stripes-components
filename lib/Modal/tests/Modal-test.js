/**
 * Modal tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Modal as ModalInteractor, Button, converge, including, Keyboard } from '@folio/stripes-testing';

import { RoledHTML } from '../../../tests/helpers/localInteractors';
import { mountWithContext } from '../../../tests/helpers';

import Modal from '../Modal';
// import ModalInteractor from './interactor';

const interactor = ModalInteractor.extend('modal')
  .selector('[class^=modalRoot---]')
  .filters({
    footerPresent: (el) => !!el.querySelector('[class*=modalFooter---]'),
    headerPresent: (el) => !!el.querySelector('[class*=modalHeader---]'),
    ariaLabel: (el) => el.getAttribute('aria-label'),
  });

describe('Modal', () => {
  const modal = interactor();
  const label = 'My Modal';
  const ariaLabel = 'My Modal ARIA Label';
  let onCloseFired;

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

  it('Should render a close button when the "dismissible"-prop is true', () => Button().exists());

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
    it('The onClose callback should be fired when clicking on the backdrop overlay', () => converge(() => onCloseFired));
  });

  describe('When the "closeOnBackgroundClick"-prop is false or undefined', () => {
    beforeEach(async () => {
      onCloseFired = false;
      await mountWithContext(
        <Modal
          open
          closeOnBackgroundClick={false}
          label={label}
          onClose={() => { onCloseFired = true; }}
        >
          Test
        </Modal>
      );
      await RoledHTML({ className: including('backdrop') }).click();
    });
    it('The onClose callback should not be fired when clicking on the backdrop', () => {
      expect(onCloseFired).to.be.false;
    });

    describe('When pressing the escape key', () => {
      beforeEach(async () => {
        await Keyboard.escape();
      });

      it('The onCancel callback should be fired', () => {
        expect(onCloseFired).to.be.true;
      });
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
});
