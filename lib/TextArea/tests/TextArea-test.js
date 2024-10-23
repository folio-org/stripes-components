import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { TextArea as Interactor, Label as LabelInteractor, runAxeTest, Keyboard } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import TextArea from '../TextArea';

describe('TextArea', () => {
  describe('supplying no visible label', () => {
    const textArea = Interactor();

    describe('rendering a basic TextArea', async () => {
      beforeEach(async () => {
        await mountWithContext(
          <TextArea
            aria-label="test label"
            id="test"
            hasClearIcon
          />
        );
      });

      it('contains no axe errors - TextArea', runAxeTest);

      it('renders a textarea element', async () => {
        await textArea.perform(el => expect(el.querySelector('textarea')).to.exist);
      });

      it('renders no label tag by default', () => textArea.has({ label: undefined }));

      it('applies the id to the textarea', () => textArea.has({ id: 'test' }));


      describe('entering text', async () => {
        beforeEach(() => textArea.fillIn('test'));

        it('updates the value', () => textArea.has({ value: 'test' }));

        describe('then clicking clear', () => {
          beforeEach(() => textArea.clear());

          it('clears the value', () => textArea.has({ value: '' }));

          it('focuses the textarea', () => textArea.is({ focused: true }));
        });
      });
    });

    describe('supplying an error', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TextArea error="This is an error." />
        );
      });

      it('renders the error', () => textArea.has({ error: 'This is an error.' }));
    });

    describe('supplying a warning', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TextArea warning="This is a warning." />
        );
      });

      it('renders the warning', () => textArea.has({ warning: 'This is a warning.' }));
    });
  });

  describe('supplying label and id', () => {
    const textArea = Interactor('my test label');

    beforeEach(async () => {
      await mountWithContext(
        <TextArea label="my test label" id="myTestInput" />
      );
    });

    it('contains no axe errors - TextArea: label', runAxeTest);

    it('has the expected id', () => textArea.has({ id: 'myTestInput' }));

    it('renders a label element', () => textArea.has({ label: 'my test label' }));

    it('with a filled htmlFor attribute', () => textArea.find(LabelInteractor({ for: 'myTestInput' })).exists());
  });

  describe('supplying fitContent', () => {
    const textArea = Interactor('my test label');
    const value = 'Test value';

    beforeEach(async () => {
      await mountWithContext(
        <TextArea
          label="my test label"
          id="myTestInput"
          fitContent
          value={value}
        />
      );
    });

    it('has \'cols\' property', () => textArea.has({ cols: `${value.length}` }));
  });

  describe('supplying areaLabel', () => {
    const textArea = Interactor();

    beforeEach(async () => {
      await mountWithContext(
        <TextArea ariaLabel="test areaLabel" />
      );
    });

    it('contains no axe errors - TextArea', runAxeTest);

    it('applies the aria-label to the textarea', () => textArea.has({ ariaLabel: 'test areaLabel' }));
  });

  describe('supplying value', () => {
    const textArea = Interactor();

    beforeEach(async () => {
      await mountWithContext(
        <TextArea ariaLabel="test label" value="test value" />
      );
    });

    it('contains no axe errors - TextArea', runAxeTest);

    it('applies the value to the textarea', () => textArea.has({ value: 'test value' }));
  });

  describe('supplying hasClearIcon', () => {
    const textArea = Interactor();
    const onClearFieldSpy = sinon.spy();

    beforeEach(async () => {
      await mountWithContext(
        <TextArea
          ariaLabel="test label"
          value="test value"
          hasClearIcon
          onClearField={onClearFieldSpy}
        />
      );

      await textArea.focus();
    });

    it('should render the clear icon', () => textArea.has({ hasClearIcon: true }));

    describe('when clear icon is clicked', () => {
      beforeEach(async () => {
        await textArea.clear();
      });

      it('should call onClearField', () => expect(onClearFieldSpy.callCount).to.equal(1));
    });
  })

  describe('supplying newLineOnShiftEnter', () => {
    const textArea = Interactor();
    const onSubmitSearchSpy = sinon.spy();

    beforeEach(async () => {
      onSubmitSearchSpy.resetHistory();

      await mountWithContext(
        <TextArea
          ariaLabel="test label"
          value="test value"
          newLineOnShiftEnter
          onSubmitSearch={onSubmitSearchSpy}
        />
      );
    });

    describe('when pressing Shift+Enter', () => {
      beforeEach(async () => {
        await textArea.focus();
        await Keyboard.pressKey('Enter', { shiftKey: true });
      });

      it('should not call submit callback', () => {
        expect(onSubmitSearchSpy.called).to.be.false;
      });
    });

    describe('when pressing Enter', () => {
      beforeEach(async () => {
        await textArea.focus();
        await Keyboard.pressKey('Enter');
      });

      it('should call submit callback', () => {
        expect(onSubmitSearchSpy.called).to.be.true;
      });
    });
  });

  describe('supplying isCursorAtEnd', () => {
    const textArea = Interactor();
    const value = 'test value';

    beforeEach(async () => {
      await mountWithContext(
        <TextArea
          isCursorAtEnd
          value={value}
        />
      );
    });

    it('should place the cursor to the end of the value', () => {
      textArea.perform(el => {
        const textarea = el.querySelector('textarea');

        expect(textarea.selectionStart).to.equal(value.length);
        expect(textarea.selectionEnd).to.equal(value.length);
      });
    });
  });
});
