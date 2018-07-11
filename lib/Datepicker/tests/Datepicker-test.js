import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import jest from 'jest-mock';

import { mountWithContext } from '../../../tests/helpers';

import Datepicker from '../Datepicker';
import DatepickerInteractor from './interactor';

/**
 * Commonly used props:
 *  - [] backendDateStandard
 *  - [] timeZone
 *  - [] dateFormat
 *  - [] intl
 *  - [] locale
 *  - [] excludeDates
 *
 * HTML Attributes
 *  - [?] disabled
 *  - [] label
 *  - [] value
 *  - [] id
 *  - [] onChange
 *  - [] readOnly
 *  - [] required
 *
 * Redux Integration
 *  - input
 *  - meta
 *
 * Possible Deprecation
 *  - [?] passThroughValue - when value matches specified value, just pass the value through
 *  - stripes
 *  - [] ignoreLocalOffset
 *
 * Unused Configurations
 * - useFocus (set to true, so it's always active although never passed)
 * - thether (has defaults but never used)
 * - screenReaderMessage
 * - hideOnChoose (default true)
 * - onSetDate
 * - showCalendar
 *
 * Tests
 *  - require to make sure asterisc shows up
 *  - if I input does it emit onChange event
 *  - Click on event does it change the event
 *  - Navigation tests
 *  - render with id

 *  - click and nothing inputted does calendar show up
 *  - Warning & error outside of redux
 *
 * Things Datepicker should do according to John
 * - uses a standard text input - value can be typed as well as picked using the calendar
 * - picker disappears with a click outside or blur of the input
 * - presents in localized format (based on locale to determine input and output)
 * - custom format can be applied
 * - excluded dates
 * - a11y - screen reader compatibility (announces actions, selections, values)
 * - a11y - keyboard navigation of dates
 * - accepts colors from a stripes theme/works with stripes-components postcss workflow/css-modules
 * - supports some version of the “passThroughValue” to keep repetitious entries to a minimum. Use-case: checkin - applying today’s date to multiple items within a check-in.  (would have to discuss alternatives with UX design staff)
 * - validation styles/classes in-line with other stripes-components
 * - Optional: outputs date in iso format (output value) (redux: format for input, normalize for output) (assumption is that all folio apps use full ISO, eholdings does not because of ebsco)
 */

describe('Datepicker', () => {
  const datepicker = new DatepickerInteractor();

  describe('render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );
    });

    it('does not have a value in the input', () => {
      expect(datepicker.inputValue).to.equal('');
    });

    it('has a placeholder in the input', () => {
      expect(datepicker.placeholder).to.equal('MM/DD/YYYY');
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => {
      expect(datepicker.id).to.equal('datepicker-test');
    });
  });

  describe('label prop', () => {
    beforeEach(async () => mountWithContext(
      <Datepicker
        label="Pick a date"
      />
    ));

    it('shows the label', () => {
      expect(datepicker.labelText).to.equal('Pick a date');
    });
  });

  describe('selecting a date', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('selecting a date with locale prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          locale="de"
        />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('selecting a date with timeZone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          timeZone="America/Los_Angeles"
        />
      );

      await datepicker.fillInput('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('disabled prop', () => {
    let onChange;
    let onBlur;

    beforeEach(async () => {
      onChange = jest.fn();
      onBlur = jest.fn();

      await mountWithContext(
        <Datepicker
          disabled
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    });

    it('shows value in the input field', () => {
      expect(datepicker.inputValue).to.be.equal('');
    });

    it('has disabled input', () => {
      expect(datepicker.disabled).to.be.true;
    });

    describe('choosing a date from calendar', () => {
      beforeEach(async () => datepicker.clickInput().focusInput());
      it('did not open the calendar', () => {
        expect(datepicker.calendar.isPresent).to.be.false;
      });

      it('did not call onChange', () => {
        expect(onChange.mock.calls.length).to.be.equal(0);
      });

      it('did not call onBlur', () => {
        expect(onBlur.mock.calls.length).to.be.equal(0);
      });
    });
  });

  describe('passThroughValue', () => {
    let onBlur;
    let onChange;

    beforeEach(async () => {
      onBlur = jest.fn();
      onChange = jest.fn();

      await mountWithContext(
        <Datepicker
          passThroughValue="yesterday"
          input={{
            value: 'yesterday',
            onBlur,
            onChange
          }}
        />
      );
    });

    it('has yesterday is in input field', () => {
      expect(datepicker.inputValue).to.equal('yesterday');
    });

    describe.skip('blur the input field', () => {
      beforeEach(async () => datepicker.focusInput());

      it('does not have any day selected', () => {
        expect(datepicker.calendar.selected).to.be.undefined;
      });
    });

    describe.skip('clearing and typing in yesterday', () => {
      beforeEach(async () => {
        await datepicker.fillAndBlur('04/01/2018');
        await datepicker.fillAndBlur('yesterday');
      });

      it('called onBlur twice', () => {
        expect(onBlur.mock.calls.length).to.be.equal(2);
      });

      it('sends yesterday to onBlur', () => {
        expect(onBlur.mock.calls[1]).to.be.equal('yesterday');
      });

      it('called onChange twice', () => {
        expect(onChange.mock.calls.length).to.be.equal(2);
      });

      it('sends yesterday to onChange', () => {
        expect(onChange.mock.calls[1]).to.be.equal('yesterday');
      });
    });
  });

  describe('the calendar picker', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div>
          <Datepicker />
        </div>
      );
    });

    it('is closed', () => {
      expect(datepicker.calendar.isPresent).to.be.false;
    });

    describe('focus', () => {
      beforeEach(async () => datepicker.focusInput());

      it('opens on focus', () => {
        expect(datepicker.calendar.isVisible).to.be.true;
      });

      describe('shifting the focus onBlur', () => {
        beforeEach(async () => {
          await datepicker.fillAndBlur('04/01/2018');
        });

        it('closes the calendar picker', () => {
          expect(datepicker.calendar.isPresent).to.be.false;
        });
      });
    });
  });
});
