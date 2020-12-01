import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import Select from '../Select';
// import SelectInteractor from './interactor';
import { Select as Interactor, Label as LabelInteractor } from '@folio/stripes-testing';

const testOptions = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' }
];

describe.only('Select', () => {
  let select = Interactor('select');
  let label = LabelInteractor('Test-select');
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
    it('renders no label tag by default', () => !label.exists());
    it('applies the id to the select', () => select.has({id: 'test'}));
  });

  describe('selecting an option', async () => {
    beforeEach(async () => {
      await select.choose('Option 1');
    });

    it('updates the value', () => select.has({ value: 'Option 1' }));
  });

  describe('supplying label and id', () => {
    label = LabelInteractor('my test label');
    beforeEach(async () => {
      await mount(
        <Select label="my test label" id="myTestInput" />
      );
    });

    it('renders a label element', () => label.exists());
    it('with a filled htmlFor attribute', () => label.has({for: 'myTestInput' }));
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <Select error="This is an error." />
      );
    });

    it('renders an error element', () => {
      expect(select.errorText).to.equal('This is an error.');
    });

    it('applies an error style', () => {
      expect(select.hasErrorStyle).to.be.true;
    });
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
        <Select warning="This is a warning." />
      );
    });

    it('renders a warning element', () => {
      expect(select.warningText).to.equal('This is a warning.');
    });

    it('applies a warning style', () => {
      expect(select.hasWarningStyle).to.be.true;
    });
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
        await select.selectOption('Option 1');
      });

      it('Updates the value', () => {
        expect(select.val).to.equal('value1');
      });
    });
  });

  describe('Passing aria-labelledby prop', () => {
    beforeEach(async () => {
      await mount(
        <Select aria-labelledby="testlabel" dataOptions={testOptions} />
      );
    });

    it('applies the custom aria-labelledby', () => {
      expect(select.ariaLabelledby).to.equal('testlabel');
    });
  });

  describe('Passing aria-label prop', () => {
    beforeEach(async () => {
      await mount(
        <Select aria-label="testAriaLabel" dataOptions={testOptions} />
      );
    });

    it('visibly hides the label', () => {
      expect(select.labelHidden).to.be.true;
    });

    it('applies the custom aria-label in the aria-labelledby', () => {
      expect(select.label).to.equal('testAriaLabel');
    });
  });
});
