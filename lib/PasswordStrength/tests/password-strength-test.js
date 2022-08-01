import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Field } from 'redux-form';
import { runAxeTest, TextField, HTML, including } from '@folio/stripes-testing';
import { Row, Col } from '../../LayoutGrid/index';

import TestForm from '../../../tests/TestForm';
import PasswordStrength from '../PasswordStrength';
import { mountWithContext } from '../../../tests/helpers';

import translation from '../../../translations/stripes-components/en';

const statusArray = [
  'veryWeak',
  'weak',
  'reasonable',
  'strong',
  'veryStrong'
];

const PasswordStrengthInteractor = HTML.extend('password strength indicator')
  .selector('.password-strength')
  .filters({
    status: (el) => {
      const statusIndex = statusArray.findIndex((i) => {
        return el.querySelector('[class^=indicator__container---]')
          .className.includes(i);
      });
      return statusArray[statusIndex];
    },
    statusText: (el) => el.querySelector('[class^="password-strength-text__wrapper--"]').textContent,
  });

const PasswordStengthWrappingElement = HTML.extend('password strength wrapping element')
  .selector('[data-test-password-strength]');


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

  it('contains no axe errors - PasswordStrength', runAxeTest);

  it('component should be presented', () => {
    return Promise.all([
      PasswordStengthWrappingElement().exists(),
      TextField('test').exists()
    ]);
  });

  it('password strength meter should not be presented', () => PasswordStrengthInteractor().absent());

  describe('very week password', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('1');
    });

    it('password strength meter should be presented through password insertion', () => PasswordStrengthInteractor().exists());

    it('password strength meter should have proper text', () => PasswordStrengthInteractor().has({ statusText: translation['passwordStrength.veryWeak'] }));

    it('password strength meter should have label', () => HTML({ className: including('password-strength__label') }).exists());

    it('password strength meter should have proper label text', () => HTML(translation['passwordStrength.label']).exists());

    it('password strength meter should have proper indicator', () => PasswordStrengthInteractor().has({ status: 'veryWeak' }));
  });

  describe('weak password', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test1test');
    });

    it('password strength meter should be presented through password insertion', () => PasswordStrengthInteractor().exists());

    it('password strength meter should have proper text', () => PasswordStrengthInteractor().has({ statusText: translation['passwordStrength.weak'] }));

    it('password strength meter should have label', () => HTML({ className: including('password-strength__label') }).exists());

    it('password strength meter should have proper label text', () => HTML(translation['passwordStrength.label']).exists());

    it('password strength meter should have proper indicator', () => PasswordStrengthInteractor().has({ status: 'weak' }));
  });

  describe('reasonable password', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test1test1');
    });

    it('password strength meter should be presented through password insertion', () => PasswordStrengthInteractor().exists());

    it('password strength meter should have proper text', () => PasswordStrengthInteractor().has({ statusText: translation['passwordStrength.reasonable'] }));

    it('password strength meter should have label', () => HTML({ className: including('password-strength__label') }).exists());

    it('password strength meter should have proper label text', () => HTML(translation['passwordStrength.label']).exists());

    it('password strength meter should have proper indicator', () => PasswordStrengthInteractor().has({ status: 'reasonable' }));
  });

  describe('strong password', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test1test1test');
    });

    it('password strength meter should be presented through password insertion', () => PasswordStrengthInteractor().exists());

    it('password strength meter should have proper text', () => PasswordStrengthInteractor().has({ statusText: translation['passwordStrength.strong'] }));

    it('password strength meter should have label', () => HTML({ className: including('password-strength__label') }).exists());

    it('password strength meter should have proper label text', () => HTML(translation['passwordStrength.label']).exists());

    it('password strength meter should have proper indicator', () => PasswordStrengthInteractor().has({ status: 'strong' }));
  });

  describe('very strong password', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test1test1test@test1test1test');
    });

    it('password strength meter should be presented through password insertion', () => PasswordStrengthInteractor().exists());

    it('password strength meter should have proper text', () => PasswordStrengthInteractor().has({ statusText: translation['passwordStrength.veryStrong'] }));

    it('password strength meter should have label', () => HTML({ className: including('password-strength__label') }).exists());

    it('password strength meter should have proper label text', () => HTML(translation['passwordStrength.label']).exists());

    it('password strength meter should have proper indicator', () => PasswordStrengthInteractor().has({ status: 'veryStrong' }));
  });

  describe('password deletion', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test1test1test@test1test1test');
    });

    it('password strength meter should not be presented', () => PasswordStrengthInteractor().exists());

    describe('removing password', () => {
      beforeEach(async () => {
        await TextField('test').fillIn('');
      });

      it('meter is not displayed', () => PasswordStrengthInteractor().absent());
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

  it('component should be presented', () => PasswordStengthWrappingElement().exists());

  it('textInput should be presented', () => TextField('test').exists());

  it('password strength meter should not be presented', () => PasswordStrengthInteractor().absent());

  describe('password insertion', () => {
    beforeEach(async () => {
      await TextField('test').fillIn('test');
    });

    it('textInput should be presented', () => TextField().exists());

    it('password strength meter should not be presented through password insertion', () => PasswordStrengthInteractor().absent());

    describe('password deletion', () => {
      beforeEach(async () => {
        await TextField('test').fillIn('');
      });

      it('meter is still hidden', () => PasswordStrengthInteractor().absent());
    });
  });
});
