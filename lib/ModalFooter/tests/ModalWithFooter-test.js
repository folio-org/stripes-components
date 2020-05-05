import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { mount } from '../../../tests/helpers';

import ModalWithFooterInteractor from '../../Modal/tests/interactor';
import ModalFooterExample from '../examples/ModalFooterExample';

describe('Modal with footer', () => {
  const modalWithFooter = new ModalWithFooterInteractor();

  beforeEach(async () => {
    await mount(<ModalFooterExample />);
  });

  it('renders modal with footer', () => {
    expect(modalWithFooter.hasFooter).to.be.true;
  });
});
