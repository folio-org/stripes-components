import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Select as Interactor } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Select from '../Select';

const testOptions = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' }
];

describe('Select', () => {
  const select = Interactor();
  describe('rendering a basic Select', async () => {
    beforeEach(async () => {
      await mount(
        <Select
          id="test"
          placeholder="Choose an option"
          aria-label="select"
          dataOptions={testOptions}
        />
      );
    });

    it('renders a select element', () => select.exists());
    it('renders no label tag by default', () => select.has({ label: 'select' }));
    it('applies the id to the select', () => select.has({ id: 'test' }));

    describe('selecting an option', async () => {
      beforeEach(async () => {
        await select.choose('Option 1');
      });

      it('updates the value', () => select.has({ value: 'test1' }));
    });
  });


  describe('supplying label and id', () => {
    beforeEach(async () => {
      await mount(
        <Select label="my test label" id="myTestInput" />
      );
    });

    it('renders a label element', () => select.has({ label: 'my test label' }));
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <Select error="This is an error." />
      );
    });

    it('renders an error element', () => select.has({ error: 'This is an error.' }));
    it('is labeled as invalid', () => select.is({ valid: false }));
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
        <Select warning="This is a warning." />
      );
    });

    it('renders a warning element', () => select.has({ warning: 'This is a warning.' }));
  });

  describe('Passing options as children to <Select>', () => {
    beforeEach(async () => {
      await mount(
        <Select>
          <optgroup>My group</optgroup>
          <option value="value1">Option 1</option>
        </Select>
      );
    });

    describe('Selecting first option', async () => {
      beforeEach(async () => {
        await select.choose('Option 1');
      });

      it('Updates the value', () => select.has({ value: 'value1' }));
    });
  });

  describe('Passing aria-labelledby prop', () => {
    beforeEach(async () => {
      await mount(
        <Select aria-labelledby="testlabel" dataOptions={testOptions} />
      );
    });

    it('applies the custom aria-labelledby', () => select.is({ ariaLabelledBy: 'testlabel' }));
  });

  describe('Passing aria-label prop', () => {
    beforeEach(async () => {
      await mount(
        <Select aria-label="testAriaLabel" dataOptions={testOptions} />
      );
    });

    it('visibly hides the label', () => select.perform(el => {
      expect(el.querySelector('label').className).to.contain('sr-only');
    }));

    it('applies the custom aria-label in the aria-labelledby', () => select.has({ label: 'testAriaLabel' }));
  });
});
