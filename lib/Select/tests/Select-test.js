import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import Select from '../Select';
import SelectInteractor from './interactor';

const testOptions = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' }
];

describe.only('Select', () => {
  const select = new SelectInteractor();

  describe('rendering a basic Select', async () => {
    beforeEach(async () => {
      await mount(
        <Select
          id="test"
          placeholder="Choose an option"
          dataOptions={testOptions}
        />
      );
    });

    it('renders a select element', () => {
      expect(select.hasSelect).to.be.true;
    });

    it('renders no label tag by default', () => {
      expect(select.hasLabel).to.be.false;
    });

    it('applies the id to the select', () => {
      expect(select.id).to.equal('test');
    });
  });

  describe('entering text', async () => {
    beforeEach(async () => {
      await select.selectOption('Option 1');
    });

    it('updates the value', () => {
      expect(select.val).to.equal('test1');
    });
  });

  describe('supplying label and id', () => {
    beforeEach(async () => {
      await mount(
        <Select label="my test label" id="myTestInput" />
      );
    });

    it('renders a label element', () => {
      expect(select.label).to.equal('my test label');
    });

    it('with a filled htmlFor attribute', () => {
      expect(select.labelFor).to.equal('myTestInput');
    });
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
