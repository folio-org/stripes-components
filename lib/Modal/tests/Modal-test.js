/**
 * Modal tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount, mountWithContext } from '../../../tests/helpers';

import Modal from '../Modal';
import ModalInteractor from './interactor';

describe.only('Modal', () => {
  const modal = new ModalInteractor();
  let open = true;
  let showHeader = true;

  beforeEach(async () => {
    await mountWithContext(
      <Modal
        open={open}
      >
        Hello
      </Modal>
    );
  });

  it('should not have a header if "showHeader" is false', () => {
    beforeEach(async () => {
      await mountWithContext(<Modal open={open} showHeader={false}>Test</Modal>);
    });
    expect(modal.hasHeader).to.be.false;
  });
});
