import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';

import {
  Datepicker as Interactor,
  Calendar,
  // re-exported and importing Bigtest to differentiate between built-in interactors
  Bigtest,
  Keyboard,
  HTML,
  IconButton
} from '@folio/stripes-testing';
import { mountWithContext, focusPrevious, focusNext } from '../../../tests/helpers';

import Datepicker, { getMomentLocalizedFormat } from '../Datepicker';
import DatepickerAppHarness from './DatepickerAppHarness';

describe('Datepicker', () => {
  const datepicker = Interactor();
  const calendar = Calendar();
  const month = calendar.find(Bigtest.Select());
  const year = calendar.find(Bigtest.TextField());

  const CalendarDays = Bigtest.createInteractor('calendar days')({
    selector: '[class^=calendar-] td',
    locator: (el) => el.textContent,
    filters: {
      month: (el) => el.getAttribute('data-date').split('/')[0],
    },
    actions: {
      click: (interactor) => interactor.perform((el) => { el.click(); }),
      focus: (interactor) => interactor.perform((el) => { el.focus(); }),
    }
  });

  describe('render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );
    });

    it('does not have a value in the input', () => datepicker.has({ inputValue: '' }));

    it('has a placeholder in the input', () => datepicker.has({ placeholder: 'MM/DD/YYYY' }));
  });

  describe('exclude functionality', () => {
    let changed;
    beforeEach(async () => {
      changed = false;
      await mountWithContext(
        <Datepicker exclude={() => true} onChange={() => { changed = true; }} />
      );
      await datepicker.openCalendar();
    });

    it('renders all days excluded', () => calendar.assert((el) => {
      // find all 'td' and check if any is set to true
      return Array.from(el.querySelectorAll('td')).reduce((excluded, node) => {
        if (!excluded) return excluded;
        return node.getAttribute('data-excluded') === 'true';
      }, true);
    }));

    describe('key-handling on excluded (lack of)', () => {
      beforeEach(async () => {
        await CalendarDays('8').focus();
        await Keyboard.enter();
      });

      it('date should not be changed', () => {
        expect(changed).to.be.false;
      });
    });
  });

  describe('usePortal functionality', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" usePortal />
      );
      await datepicker.openCalendar();
    });

    it('renders the datepicker to the "#OverlayContainer" div', () => calendar.is({ visible: true, portal: true }));

    describe('clicking within the picker doesn\'t close it', () => {
      beforeEach(async () => {
        await calendar.click();
      });

      it('doesn\'t close the datepicker when monthfield clicked', () => calendar.is({ visible: true }));
    });

    describe('pressing escape closes the picker', () => {
      beforeEach(async () => {
        await Keyboard.escape();
      });

      it('closes the picker', () => calendar.absent());
    });

    describe('closing via root-close click', () => {
      beforeEach(async () => {
        await HTML({ id: 'root' }).click();
      });

      it('closes the picker', () => calendar.absent());
    });
  });

  describe('incomplete value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker value="12/" dateFormat="YYYY-MM-DD" />
      );
      await datepicker.openCalendar();
    });

    // this checks that the calendar widget has the correct date
    // but note the datepicker input
    it('calendar date falls back to today\'s date', () => calendar.is({ today: true }));
  });

  describe('focus trapping', () => {
    beforeEach(async () => {
      await mountWithContext(
        <>
          <button type="button" id="firstButton">first</button>
          <Datepicker />
          <button type="button" id="lastButton">last</button>
        </>
      );

      await datepicker.openCalendar();
    });

    describe('focusing back off the first item', () => {
      beforeEach(async () => {
        // manually adjust focus since we are trapping tabIndex
        await focusPrevious(document.activeElement);
      });

      // for the calendar to have focus, it also needs to be visible
      it('shifts focus to calendar', () => calendar.is({ visible: true }));

      describe('focusing back off the first item', () => {
        beforeEach(async () => {
          // manually adjust focus since we are trapping tabIndex
          await focusNext(document.activeElement);
        });

        it('shifts focus to monthField', () => month.is({ focused: true }));
      });
    });
  });

  describe('value set after initial render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DatepickerAppHarness lateValue="04/01/2019" />
      );
    });

    it('does not have a value in the input', () => datepicker.has({ inputValue: '' }));

    describe('applying late value', () => {
      beforeEach(async () => {
        await HTML({ id: 'applylatevalue' }).click();
      });

      it('displays the late-applied value', () => datepicker.has({ inputValue: '04/01/2019' }));
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker id="datepicker-test" />
      );
    });

    it('has an id on the input element', () => datepicker.has({ id: 'datepicker-test' }));
  });

  describe('label', () => {
    beforeEach(async () => mountWithContext(
      <Datepicker
        label="Pick a date"
      />
    ));

    it('shows the label', () => {
      datepicker.has({ labelText: 'Pick a date' });
    });
  });

  describe('readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker readOnly />
      );

      await datepicker.focus();
    });

    it('is not disabled', () => datepicker.is({ disabled: false, focused: true, readOnly: true }));

    it('it did not open the calendar', () => calendar.absent());
  });

  describe('entering a date with the input', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker onChange={(event) => { dateOutput = event.target.value; }} />
      );

      await datepicker.fillIn('04/01/2018');
      await datepicker.blur();
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('setting a date with the calendar', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker />
      );

      await datepicker.openCalendar();
      await CalendarDays('7').click();
    });

    it('sets a date in the field', () => datepicker.is({ empty: false }));
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

      await datepicker.fillIn('01.04.2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('01.04.2018');
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

      await datepicker.fillIn('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('selecting a date with stripes.timezone prop', () => {
    let dateOutput;

    beforeEach(async () => {
      dateOutput = '';

      await mountWithContext(
        <Datepicker
          onChange={(event) => { dateOutput = event.target.value; }}
          stripes={{ timezone: 'America/Los_Angeles' }}
        />
      );

      await datepicker.fillIn('04/01/2018');
    });

    it('emits an event with the date formatted as displayed', () => {
      expect(dateOutput).to.equal('04/01/2018');
    });
  });

  describe('considering timeZone prop when provided a UTC value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker
          timeZone="Europe/Kiev"
          value="2019-03-14T22:00:00.000+0000"
        />
      );
    });

    it('displays date localized to provided timezone.', () => datepicker.has({ inputValue: '03/15/2019' }));
  });

  describe('disabled prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker disabled />
      );
    });

    it('does not display the calendar button', () => IconButton({ icon: 'calendar' }).absent());

    it('has disabled input', () => Interactor({ disabled: true }).exists());
  });

  describe('Month/Year controls', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker />);

      await datepicker.openCalendar();
    });

    describe('changing the month field', () => {
      beforeEach(async () => {
        await month.choose('November');
        await calendar.setYear('2008');
        await CalendarDays('7').click(); // this closes the calendar
        await datepicker.openCalendar();
      });

      it('updates the month in the calendar', async () => {
        await datepicker.has({ inputValue: '11/07/2008' });
      });
    });

    describe('changing the year field', () => {
      beforeEach(async () => {
        await month.choose('April');
        await calendar.setYear('2012');
        await CalendarDays('13').click(); // this closes the calendar
        await datepicker.openCalendar();
      });

      it('updates the year in the calendar', async () => {
        await datepicker.has({ inputValue: '04/13/2012' });
      });
    });
  });

  describe('calendar widget', () => {
    beforeEach(async () => {
      await mountWithContext(<Datepicker value="2008-04-17T00:00:00.000+0000" />);

      await datepicker.openCalendar();
    });

    afterEach(() => document.body.click());

    it('opened the calendar', () => calendar.is({ visible: true }));

    it('correct month selected in calendar', () => month.has({ value: 'April' }));

    it('correct year selected in calendar', () => year.has({ value: '2008' }));

    describe('advancing the month', () => {
      beforeEach(async () => {
        await month.focus();
        await Keyboard.nextOption();
      });

      it('advances the month select', () => month.has({ value: 'May' }));

      describe('previous month', () => {
        beforeEach(async () => {
          await month.focus();
          await Keyboard.prevOption();
        });

        it('decrements the month select', () => month.has({ value: 'April' }));
      });
    });

    describe('advancing the year', () => {
      beforeEach(async () => {
        await year.focus();
        await Keyboard.incrementNumber();
      });

      it('advances the year field', () => year.has({ value: '2009' }));

      describe('previous year', () => {
        beforeEach(async () => {
          await year.focus();
          await Keyboard.decrementNumber();
        });

        it('decrements the year control', () => year.has({ value: '2008' }));
      });
    });

    describe('clicking outside of calendar', () => {
      beforeEach(() => document.body.click());
      it('closes the calendar picker', () => calendar.absent());
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker label="Pick a date" required />
      );
    });

    it('adds required attribute to input field', () => datepicker.is({ required: true }));
  });

  describe('legacy tether smoke test', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Datepicker tether={{ attachment: 'top left' }} />
      );

      await datepicker.openCalendar();
    });

    it('opens calendar', () => calendar.is({ visible: true }));
  });

  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getMomentLocalizedFormat({ locale:'de' }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });
});
