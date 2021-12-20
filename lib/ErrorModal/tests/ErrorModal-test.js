import React from 'react';

import { expect } from 'chai';
import sinon from 'sinon';
import { describe, beforeEach, it } from 'mocha';
import { mountWithContext } from '../../../tests/helpers';

import ErrorModal from '../ErrorModal';
import ErrorModalInteractor from './interactor';

describe('ErrorModal', () => {
  const errorModal = new ErrorModalInteractor();
  const onClose = sinon.spy();

  const label = 'Something went wrong';
  const content = 'Here is a detailed message that explains why the error occurred.';
  const buttonLabel = 'Close';

  beforeEach(async () => {
    await mountWithContext(
      <ErrorModal
        open
        label={label}
        content={content}
        onClose={onClose}
      />
    );
  });

  it('the label text should be correct', () => {
    expect(errorModal.label.text).to.equal(label);
  });

  it('the content text should be correct', () => {
    expect(errorModal.content.text).to.equal(content);
  });

  it('the content tagName should be div', () => {
    expect(errorModal.bodyTagName).to.equal('div');
  });

  it('shows correct button label', () => {
    expect(errorModal.closeButton.text).to.equal(buttonLabel);
  });

  describe('when clicking the close button', () => {
    beforeEach(async () => {
      await errorModal.closeButton.click();
    });

    it('the onClose callback should be fired', () => {
      expect(onClose.called).to.be.true;
    });
  });
});
