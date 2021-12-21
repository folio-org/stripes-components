import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Field } from 'redux-form';
import { Row, Col } from '../../LayoutGrid/index';

import TestForm from '../../../tests/TestForm';
import PasswordStrength from '../PasswordStrength';
import PasswordStrengthInteractor from './interactor';
import { mountWithContext } from '../../../tests/helpers';

import translation from '../../../translations/stripes-components/en';

describe('password strength', () => {
  beforeEach(async () => {
    await mountWithContext(
      <Row>
        <Col xs={12}>
          <div data-test-password-strength>
            <TestForm>
              <Field
                component={PasswordStrength}
                type="password"
                id="current-password"
                name="currentPassword"
                label="test"
                autoFocus
              />
            </TestForm>
          </div>
        </Col>
      </Row>
    );
  });

  it('component should be presented', () => {
    expect(PasswordStrengthInteractor.isPresent).to.be.true;
  });

  it('textInput should be presented', () => {
    expect(PasswordStrengthInteractor.textInput.isPresent).to.be.true;
  });

  it('password strength meter should not be presented', () => {
    expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.false;
  });

  describe('very week password', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('1');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.true;
    });

    it('password strength meter should have proper text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.text.text).to.equal(translation['passwordStrength.veryWeak']);
    });

    it('password strength meter should have label', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.isPresent).to.be.true;
    });

    it('password strength meter should have proper label text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.text).to.be.equal(translation['passwordStrength.label']);
    });

    it('password strength meter should have proper indicator', () => {
      expect(PasswordStrengthInteractor.passwordStrength.veryWeakIndicator.isPresent).to.be.true;
    });
  });

  describe('week password', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.true;
    });

    it('password strength meter should have proper text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.text.text).to.equal(translation['passwordStrength.weak']);
    });

    it('password strength meter should have label', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.isPresent).to.be.true;
    });

    it('password strength meter should have proper label text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.text).to.be.equal(translation['passwordStrength.label']);
    });

    it('password strength meter should have proper indicator', () => {
      expect(PasswordStrengthInteractor.passwordStrength.weakIndicator.isPresent).to.be.true;
    });
  });

  describe('reasonable password', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test1');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.true;
    });

    it('password strength meter should have proper text', () => {
      expect(
        PasswordStrengthInteractor.passwordStrength.text.text
      ).to.equal(translation['passwordStrength.reasonable']);
    });

    it('password strength meter should have label', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.isPresent).to.be.true;
    });

    it('password strength meter should have proper label text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.text).to.be.equal(translation['passwordStrength.label']);
    });

    it('password strength meter should have proper indicator', () => {
      expect(PasswordStrengthInteractor.passwordStrength.reasonableIndicator.isPresent).to.be.true;
    });
  });

  describe('strong password', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test1test');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.true;
    });

    it('password strength meter should have proper text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.text.text).to.equal(translation['passwordStrength.strong']);
    });

    it('password strength meter should have label', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.isPresent).to.be.true;
    });

    it('password strength meter should have proper label text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.text).to.be.equal(translation['passwordStrength.label']);
    });

    it('password strength meter should have proper indicator', () => {
      expect(PasswordStrengthInteractor.passwordStrength.strongIndicator.isPresent).to.be.true;
    });
  });

  describe('very strong password', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test1test@test1test1test');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.true;
    });

    it('password strength meter should have proper text', () => {
      expect(
        PasswordStrengthInteractor.passwordStrength.text.text
      ).to.equal(translation['passwordStrength.veryStrong']);
    });

    it('password strength meter should have label', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.isPresent).to.be.true;
    });

    it('password strength meter should have proper label text', () => {
      expect(PasswordStrengthInteractor.passwordStrength.label.text).to.be.equal(translation['passwordStrength.label']);
    });

    it('password strength meter should have proper indicator', () => {
      expect(PasswordStrengthInteractor.passwordStrength.veryStrongIndicator.isPresent).to.be.true;
    });
  });

  describe('password deletion', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test1test@test1test1test');
      await PasswordStrengthInteractor.textInput.fillInput('');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('password strength meter should not be presented', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.false;
    });
  });
});

describe('password strength hidden', () => {
  beforeEach(async () => {
    await mountWithContext(
      <Row>
        <Col xs={12}>
          <div data-test-password-strength>
            <TestForm>
              <Field
                component={PasswordStrength}
                type="password"
                id="current-password"
                name="currentPassword"
                label="test"
                autoFocus
                inputColProps={{ xs: 6 }}
                passwordStrengthHidden
              />
            </TestForm>
          </div>
        </Col>
      </Row>
    );
  });

  it('component should be presented', () => {
    expect(PasswordStrengthInteractor.isPresent).to.be.true;
  });

  it('textInput should be presented', () => {
    expect(PasswordStrengthInteractor.textInput.isPresent).to.be.true;
  });

  it('password strength meter should not be presented', () => {
    expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.false;
  });

  describe('password insertion', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('textInput should be presented', () => {
      expect(PasswordStrengthInteractor.textInput.isPresent).to.be.true;
    });

    it('password strength meter should not be presented through password insertion', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.false;
    });
  });

  describe('password deletion', () => {
    beforeEach(async () => {
      await PasswordStrengthInteractor.textInput.focusInput();
      await PasswordStrengthInteractor.textInput.fillInput('test1test1test@test1test1test');
      await PasswordStrengthInteractor.textInput.fillInput('');
      await PasswordStrengthInteractor.textInput.blurInput();
    });

    it('textInput should be presented', () => {
      expect(PasswordStrengthInteractor.textInput.isPresent).to.be.true;
    });

    it('password strength meter should not be presented', () => {
      expect(PasswordStrengthInteractor.passwordStrength.isPresent).to.be.false;
    });
  });
});
