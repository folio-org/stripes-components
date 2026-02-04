import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { NumberField as Interactor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import NumberField from '../NumberField';

const Field = ({ children, rest }) => <div {...rest}>{children}</div>;

describe.only('NumberField', () => {
  const numberField = Interactor();

  describe('Native JS locale, i.e. format matches JS (en-US)', () => {
    beforeEach(async () => {
      await mountWithContext(
        <NumberField
          field={Field}
          id="nfTest"
          name="nf"
          label="number-field"
        />,
        [],
        'en-US'
      );
    });

    it('renders an input type="number" by default', () => {
      console.log()
      numberField.has({ type: 'nuasdfasdfmber' });
    });

    it('applies the supplied id prop to the input', () => textField.has({ id: 'nfTest' }));

    describe('entering numbers into the field', () => {
      beforeEach(() => numberField.fillIn('1,234.56'));

      it('updates the value', () => numberField.has({ value: 1234.56 }));
    });
  });

  describe('Non-native JS locale, i.e. format does NOT match JS (de-DE)', () => {
    beforeEach(async () => {
      await mountWithContext(
        <NumberField
          id="nfTest"
          field={Field}
        />,
        [],
        'de-DE'
      );
    });

    it('renders an input type="number" by default', () => {
      numberField.has({ type: 'number' });
    });

    describe('entering numbers into the field', () => {
      beforeEach(() => numberField.fillIn('1.234,56'));

      it('updates the value', () => numberField.has({ value: 1234.56 }));
    });
  });
});
