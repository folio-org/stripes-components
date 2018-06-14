import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, reduxForm } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import TextField from '../TextField';

import TextFieldHarness from './TextFieldHarness';

import TextFieldInteractor from './interactor';

describe('TextField', () => {
  const textfield = new TextFieldInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <TextField id="tfTest" />
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

  describe('entering text into the field', async () => {
    beforeEach(async () => {
      await textfield.fillInput('test');
    });

    it('updates the value', () => {
      expect(textfield.val).to.equal('test');
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

    it('applies appropriate padding to the input', () => {
      expect(parseFloat(textfield.inputComputed.paddingRight)).to.be.above(parseFloat(textfield.inputComputed.paddingLeft));
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

    it('applies appropriate padding to the input', () => {
      expect(parseFloat(textfield.inputComputed.paddingLeft)).to.be.above(parseFloat(textfield.inputComputed.paddingRight));
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
    let focusEventFired = false;

    beforeEach(async () => {
      await mountWithContext(
        <TextField onFocus={() => { focusEventFired = true; }} />
      );
    });

    describe('focusing the field', () => {
      beforeEach(async () => {
        await textfield.focusInput();
      });

      it('fires the event', () => {
        expect(focusEventFired).to.be.true;
      });
    });
  });

  describe('supplying an onBlur handler', () => {
    let blurEventFired = false;

    beforeEach(async () => {
      await mountWithContext(
        <TextField onBlur={() => { blurEventFired = true; }} />
      );
    });

    describe('blurring the field', () => {
      beforeEach(async () => {
        await textfield.blurInput();
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
    let textFieldComponent;

    beforeEach(async () => {
      await mountWithContext(
        <TextField ref={(ref) => { textFieldComponent = ref; }} />
      );
    });

    describe('focusing the field programmatically', () => {
      beforeEach(async () => {
        await textFieldComponent.getInput().focus();
      });

      it('focuses the input', () => {
        expect(textfield.isFocused).to.be.true;
      });
    });
  });

  describe('using with redux-form', () => {
    describe('inputting a value', () => {
      let fieldCleared = false;

      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              clearFieldId="clearField"
              onClearField={() => { fieldCleared = true; }}
            />
          </TestForm>
        );
      });

      it('should render the TextField normally', () => {
        expect(textfield.type).to.equal('text');
      });

      describe('changing the value', () => {
        beforeEach(async () => {
          await textfield.fillInput('anything')
            .focusInput();
        });

        it('applies a changed class', () => {
          expect(textfield.hasChangedStyle).to.be.true;
        });

        it('renders a clear button', () => {
          expect(textfield.hasClearButton).to.be.true;
        });

        describe('clicking the clear button', () => {
          beforeEach(async () => {
            await textfield
              .clickClearButton()
              .blurInput();
          });

          it('clears the field', () => {
            expect(textfield.val).to.equal('');
          });

          it('fires the onClearField event', () => {
            expect(fieldCleared).to.be.true;
          });
        });
      });
    });

    describe('inputting an invalid value', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textfield.fillAndBlur('invalid');
      });

      it('renders an error message', () => {
        expect(textfield.inputError).to.be.true;
      });
    });

    describe('inputting an valid value with validStylesEnabled', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm>
            <Field
              name="testField"
              component={TextField}
              validStylesEnabled
              validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
            />
          </TestForm>
        );
      });

      beforeEach(async () => {
        await textfield.fillAndBlur('valid');
      });

      it('applies a valid class', () => {
        expect(textfield.hasValidStyle).to.be.true;
      });

      describe('then removing the text', () => {
        beforeEach(async () => {
          await textfield.fillAndBlur('');
        });

        it('renders an error message', () => {
          expect(textfield.inputError).to.be.true;
        });
      });
    });

    describe('inputting an valid value with asyncValidating', () => {
      let resolveValidation;

      const AsyncForm = reduxForm({
        form: 'TextFieldAsyncTest',
        asyncValidate: () => {
          return new Promise((resolve) => {
            resolveValidation = resolve;
          });
        }
      })(() => (
        <Field
          name="testField"
          component={TextField}
        />
      ));

      beforeEach(async () => {
        await mountWithContext(
          <AsyncForm />
        );
      });

      beforeEach(async () => {
        await textfield.fillInput('valid');
      });

      it('displays a loading icon', () => {
        expect(textfield.hasLoadingIcon).to.be.true;
      });

      describe('finishing the async validation', () => {
        beforeEach(async () => {
          resolveValidation();
        });

        it('removes the loading icon', () => {
          expect(textfield.hasLoadingIcon).to.be.false;
        });
      });
    });
  });
});
