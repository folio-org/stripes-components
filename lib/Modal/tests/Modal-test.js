/**
 * Modal tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Modal from '../Modal';
import ModalInteractor from './interactor';

describe('Modal', () => {
  const modal = new ModalInteractor();
  const label = 'My Modal';
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
        onClose={() => { onCloseFired = true; }}
        footer={<div>Test</div>}
      >
        Test
      </Modal>
    );
  });

  it('Should render a form element if "wrappingElement" is set to "form"', () => {
    expect(modal.isForm).to.be.true;
  });

  it('Should render a modal footer if an element is passed to the "footer"-prop', () => {
    expect(modal.hasFooter).to.be.true;
  });

  it('Should render a close button when the "dismissible"-prop is true', () => {
    expect(modal.hasCloseButton).to.be.true;
  });

  describe('When clicking the close button', () => {
    beforeEach(async () => {
      await modal.clickCloseButton();
    });
    it('The onClose callback should be fired', () => {
      expect(onCloseFired).to.be.true;
    });
  });

  describe('When setting "closeOnBackgroundClick" to true', () => {
    beforeEach(async () => {
      await modal.backdrop.click();
    });
    it('The onClose callback should be fired when clicking on the backdrop overlay', () => {
      expect(onCloseFired).to.be.true;
    });
  });

  describe(`When passing a label of "${label}" to a modal`, () => {
    it('It should render a modal header', () => {
      expect(modal.hasHeader).to.be.true;
    });

    it(`It should have an aria-label of "${label}"`, () => {
      expect(modal.ariaLabel).to.equal(label);
    });

    it(`It should render with a label of "${label}"`, () => {
      expect(modal.label).to.equal(label);
    });
  });

  describe('When setting the "open"-prop to true', () => {
    it('Modal should be present', () => {
      expect(modal.isPresent).to.be.true;
    });
    it('Modal backdrop should be present', () => {
      expect(modal.backdrop.isPresent).to.be.true;
    });
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
    it('The modal Header should not be present', () => {
      expect(modal.hasHeader).to.be.false;
    });
  });
});
