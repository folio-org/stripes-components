import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import KeyValueInteractor from '../../KeyValue/tests/interactor';
import { mountWithContext } from '../../../tests/helpers';
import TextField from '../TextField';
import TextFieldHarness from './TextFieldHarness';
import TextFieldInteractor from './interactor';

describe('TextField', () => {
  const textfield = new TextFieldInteractor();
  const fieldNonInteractive = new KeyValueInteractor();

  describe('simple render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField id="tfTest" clearFieldId="clearField" />
      );
    });

    it('renders an input type="text" by default', () => {
      expect(textfield.type).to.equal('text');
    });

    it('renders no label tag by default', () => {
      expect(textfield.labelRendered).to.be.false;
    });

    it('applies the supplied id prop to the input', () => {
      expect(textfield.id).to.equal('tfTest');
    });

    describe('entering text into the field', () => {
      beforeEach(async () => {
        await textfield.fillInput('test');
      });

      it('updates the value', () => {
        expect(textfield.val).to.equal('test');
      });

      describe('then clicking clear', () => {
        beforeEach(async () => {
          await textfield
            .focusInput() // clear is only visible when focused
            .when(() => !!textfield.val) // wait for a value
            .clickClearButton(); // click clear
        });

        it('clears the value', () => {
          expect(textfield.val).to.be.empty;
        });

        it('focuses the input', () => {
          expect(textfield.isFocused).to.be.true;
        });
      });
    });
  });

  describe('Supplying label and id props', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField label="my test label" id="myTestInput" />
      );
    });

    it('renders a proper label element', () => {
      expect(textfield.labelRendered).to.be.true;
      expect(textfield.label).to.equal('my test label');
    });

    it('with a filled htmlFor attribute', () => {
      expect(textfield.labelFor).to.equal('myTestInput');
    });
  });

  describe('supplying an endControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField endControl={<span>testEnd</span>} />
      );
    });

    it('renders the supplied element in the end-control container', () => {
      expect(textfield.endControl).to.be.true;
    });
  });

  describe('supplying a startControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField startControl={<span>testStart</span>} />
      );
    });

    it('renders the supplied element in the start-control container', () => {
      expect(textfield.startControl).to.be.true;
    });
  });

  describe('supplying a value prop with readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField value="test value prop" readOnly />
      );
    });

    it('displays a value in the textfield', () => {
      expect(textfield.val).to.equal('test value prop');
    });

    it('sets the readonly attribute', () => {
      expect(textfield.inputReadOnly).to.equal('');
    });
  });

  describe('supplying an onChange handler', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextFieldHarness />
      );
    });

    describe('changing the field', () => {
      beforeEach(async () => {
        await textfield.fillInput('testing text');
      });

      it('should update value', () => {
        expect(textfield.val).to.equal('testing text');
      });
    });
  });

  describe('supplying an onFocus handler', () => {
    let focusEventFired;

    beforeEach(async () => {
      focusEventFired = false;

      await mountWithContext(
        <TextField onFocus={() => { focusEventFired = true; }} />
      );
    });

    describe('focusing the field', () => {
      beforeEach(async () => {
        await textfield.focusInput();
      });

      it('focuses the field', () => {
        expect(textfield.isFocused).to.be.true;
      });

      it('fires the event', () => {
        expect(focusEventFired).to.be.true;
      });
    });
  });

  describe('supplying an onBlur handler', () => {
    let blurEventFired;

    beforeEach(async () => {
      blurEventFired = false;

      await mountWithContext(
        <TextField onBlur={() => { blurEventFired = true; }} />
      );
    });

    describe('blurring the field', () => {
      beforeEach(async () => {
        await textfield
          .focusInput()
          .blurInput();
      });

      it('fires the event', () => {
        expect(blurEventFired).to.be.true;
      });
    });
  });

  describe('focusInput()', () => {
    let textFieldComponent;

    beforeEach(async () => {
      await mountWithContext(
        <TextField ref={(ref) => { textFieldComponent = ref; }} />
      );
    });

    describe('focusing the field programmatically', () => {
      beforeEach(async () => {
        await textFieldComponent.focusInput();
      });

      it('focuses the input', () => {
        expect(textfield.isFocused).to.be.true;
      });
    });
  });

  describe('getInput()', () => {
    const textFieldComponent = React.createRef();

    beforeEach(async () => {
      await mountWithContext(
        <TextField inputRef={textFieldComponent} />
      );
    });

    describe('focusing the field programmatically', () => {
      beforeEach(async () => {
        await textFieldComponent.current.focus();
      });

      it('focuses the input', () => {
        expect(textfield.isFocused).to.be.true;
      });
    });
  });

  describe('render in non-interactive mode', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField id="tfTest" label="test label" isNonInteractive value="test value" />
      );
    });

    it('should render the TextField as KeyValue', () => {
      expect(fieldNonInteractive.label.text).to.equal('test label');
      expect(fieldNonInteractive.value.text).to.equal('test value');
    });
  });
});
