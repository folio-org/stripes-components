import React from 'react';
import { describe, beforeEach, it, afterEach } from 'mocha';
import {
  HTML,
  MultiSelect as MultiSelectInteractor,
  MultiSelectMenu as MenuInteractor,
  MultiSelectOption as OptionInteractor,
  Button,
  TextInput,
  Keyboard,
  converge,
  including,
  runAxeTest
} from '@folio/stripes-testing';
import { Interactor } from '@bigtest/interactor';

import { mountWithContext } from '../../../tests/helpers';
import MultiSelectionHarness from './MultiSelectionHarness';

const multiselection = MultiSelectInteractor();
const menu = MenuInteractor();
const hiddenInput = TextInput({ visible: false });
const emptyMessage = HTML.extend('empty message')
  .selector('[class^=multiSelectEmptyMessage-]');

const ValueChipInteractor = HTML.extend('value chip')
  .selector('[class^=valueChipGroup-]')
  .filters({
    index: (el) => [...el.parentNode.parentNode.children].indexOf(el.parentNode),
    focused: (el) => el.querySelector('button').matches(':focus')
  })
  .actions({
    focus: ({ perform }) => perform(el => el.querySelector('button').focus()),
    remove: ({ find }) => find(Button()).click()
  });


const expectClosedMenu = () => {
  menu.is({ visible: false });
};

const expectOpenMenu = () => {
  menu.is({ visible: true });
};

const listOptions = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
  { value: 'sample0', label: 'Sample 0' },
  { value: 'invalid', label: 'Sample 1' },
  { value: 'sample2', label: 'Sample 2' }
];

const testId = 'testingId';

describe('MultiSelect', () => {
  beforeEach(async () => {
    await mountWithContext(
      <MultiSelectionHarness
        id={testId}
        dataOptions={listOptions}
        placeholder="test multiselect"
        label="test multiselect"
      />
    );
  });

  // eslint-disable-next-line
  it('contains no axe errors - Multiselect', async () => { return await runAxeTest(); });

  it('renders the control', () => {
    multiselection.exists();
  });

  it('does not have a value', () => {
    multiselection.has({ selectedCount: 0 });
  });

  it('renders the supplied id prop', () => {
    multiselection.has({ id: testId });
  });

  it('renders placeholder', () => {
    multiselection.has({ placeholder: 'test multiselect' });
  });

  it('list is hidden by default', expectClosedMenu);

  it('expand button has a true has-popup attribute', () => {
    Button('open menu').has({ ariaHasPopup: true });
  });

  it('control\'s aria-labelledBy attribute is set', () => {
    multiselection.has({ arialabelledBy: `multi-value-status-${testId}` });
  });

  it('should have empty hidden value', () => {
    hiddenInput.has({ value: '' });
  });

  describe('supplying a label prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelectionHarness
          id={testId}
          dataOptions={listOptions}
          label="test selection"
        />
      );
    });

    it('renders the label', () => {
      MultiSelectInteractor('test selection').exists();
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      multiselection.has({ arialabelledBy: `${testId}-label multi-value-status-${testId}` });
    });
  });

  describe('clicking the control', () => {
    beforeEach(async () => {
      await multiselection.toggle();
    });

    it('opens the list', expectOpenMenu);

    // eslint-disable-next-line
    it('contains no axe errors - Multiselect: open menu', async () => { return await runAxeTest(); });

    it('focuses the filter input', () => {
      multiselection.has({ focused: true });
    });

    it(`list is rendered with ${listOptions.length} options`, () => {
      menu.has({ optionCount: listOptions.length });
    });

    describe('clicking an option', () => {
      beforeEach(async () => {
        await multiselection.select('Option 2');
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        menu.has({ optionCount: 1 });
        OptionInteractor(`${listOptions[2].label}`).exists();
      });

      it('the list stays open', expectOpenMenu);

      it('does not render placeholder', () => {
        multiselection.has({ placeholder: '' });
      });

      it('sets correct value of hidden input value', () => {
        hiddenInput.has({ value: listOptions[2].label });
      });
    });

    describe('clicking multiple options', () => {
      beforeEach(async () => {
        await multiselection.select([
          `${listOptions[2].label}`,
          `${listOptions[3].label}`,
          `${listOptions[4].label}`
        ]);
      });

      it(`sets control value to ${listOptions[2].label}, ${listOptions[3].label}, ${listOptions[4].label}`, () => {
        multiselection.has({ selectedCount: 3 });
        multiselection.has({ selected: [`${listOptions[2].label}`, `${listOptions[3].label}`, `${listOptions[4].label}`] });
      });

      it('the list stays open', expectOpenMenu);

      describe('Keyboard: Backspace to remove values', () => {
        beforeEach(async () => {
          await multiselection.focus();
          await Keyboard.backspace();
        });

        it('removes the last selected item', () => {
          multiselection.has({ selectedCount: 2 });
          multiselection.has({ selected: [`${listOptions[2].label}`, `${listOptions[3].label}`] });
        });
      });
    });

    describe('clicking the toggleButton with the open menu', () => {
      beforeEach(async () => {
        await multiselection.toggle();
      });

      it('closes the list', expectClosedMenu);
    });

    describe('filtering options', () => {
      beforeEach(async () => {
        await multiselection.filter('sample');
      });

      it('first option is cursored', () => {
        OptionInteractor({ index: 0, cursored: true }).exists();
      });

      it('decreases list to 3 options', () => {
        menu.has({ optionCount: 3 });
      });

      it('does not display the empty message', () => {
        emptyMessage().absent();
      });

      describe('clicking a filtered option', () => {
        beforeEach(async () => {
          await OptionInteractor({ index: 2 }).click();
        });

        it('sets the value appropriately', () => {
          multiselection.has({ selectedCount: 1 });
          OptionInteractor({ selected: [`${listOptions[5].label}`] });
        });
      });

      describe('No options available after filtering', () => {
        beforeEach(async () => {
          await multiselection.filter('none');
        });

        it('displays the empty message', () => {
          emptyMessage().exists();
        });
      });
    });
  });

  describe('supplying an aria-labelledby prop', () => {
    const customLabelledBy = 'custom-aria-labelledby';

    beforeEach(async () => {
      await mountWithContext(
        <MultiSelectionHarness
          id={testId}
          dataOptions={listOptions}
          aria-labelledby={customLabelledBy}
        />
      );
    });

    it('applies the aria-labelledby to the control element', () => {
      multiselection.has({ ariaLabelledBy: including(customLabelledBy) });
    });

    it('applies the aria-labelledby to the filter input', () => {
      TextInput({ ariaLabelledBy: customLabelledBy }).exists();
    });
  });

  describe('MultiSelection, initial value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelectionHarness
          value={[listOptions[1], listOptions[3], listOptions[5]]}
          dataOptions={listOptions}
        />
      );
    });

    it('renders the selected options\' values', () => {
      multiselection.has({ selected: [listOptions[1].label, listOptions[3].label, listOptions[5].label] });
    });

    it('sets correct value in hidden input', () => {
      hiddenInput.has({ value:`${listOptions[1].label},${listOptions[3].label},${listOptions[5].label}` });
    });

    describe('Keyboard : navigating selected values', () => {
      describe('Keyboard: pressing the Home key when middle selected value is focused', () => {
        beforeEach(async () => {
          await ValueChipInteractor({ index: 1 }).focus();
          await Keyboard.home();
        });

        it('focuses the first selected item', () => {
          ValueChipInteractor({ index: 0, focused: true }).exists();
        });

        describe('Keyboard: pressing the End key while a selected value is focused', () => {
          beforeEach(async () => {
            await Keyboard.end();
          });

          it('focuses the last selected item', () => {
            ValueChipInteractor({ index: 2, focused: true });
          });
        });
      });
    });

    describe('Clicking the remove button on a value chip', () => {
      beforeEach(async () => {
        await ValueChipInteractor({ index: 0 }).remove();
      });

      it('removes the value from selection', () => {
        multiselection.has({ selectedCount: 2 });
      });

      it('moves focus to remaining option', () => {
        ValueChipInteractor({ index: 0, focused: true }).exists();
      });

      describe('Clicking the remove button on the last remaining value chip', () => {
        beforeEach(async () => {
          await ValueChipInteractor({ index: 0 }).remove();
          await ValueChipInteractor({ index: 0 }).remove();
        });

        it('removes the value from selection', () => {
          multiselection.has({ selectedCount: 0 });
        });

        it('moves focus to the filter', () => {
          multiselection.is({ focused: true });
        });
      });
    });

    describe('Keyboard : down arrow on control with menu closed', () => {
      beforeEach(async () => {
        await multiselection.focus();
        await Keyboard.arrowDown();
      });

      it('opens the selection menu', expectOpenMenu);

      it('the cursor is on the first option', () => {
        OptionInteractor({ index: 0, cursored: true }).exists();
      });
    });

    describe('Keyboard : down arrow with open menu navigates next options', () => {
      beforeEach(async () => {
        // back twice to keep this from passing if the down arrow test fails.
        await multiselection.toggle();
        await Keyboard.arrowDown();
        await Keyboard.arrowDown();
        await Keyboard.arrowDown();
      });

      it('moves cursor the next option', () => {
        OptionInteractor({ index: 2, cursored: true }).exists();
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        TextInput({ ariaActiveDescendent: OptionInteractor({ index: 2 }).id }).exists();
        // expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(2).id);
      });

      describe('Keyboard : up arrow with open menu navigates to previous option', () => {
        beforeEach(async () => {
          await Keyboard.arrowUp();
          await Keyboard.arrowUp();
        });

        it('moves cursor the previous option', () => {
          OptionInteractor({ index: 0, cursored: true }).exists();
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          TextInput({ ariaActiveDescendent: OptionInteractor({ index: 0 }).id }).exists();
        });

        describe('Keyboard : pressing enter with an open menu', () => {
          beforeEach(async () => {
            await Keyboard.enter();
          });

          it('selects the option at the cursor', () => {
            OptionInteractor({ index: 0, cursored: true }).exists();
            OptionInteractor({ index: 0, selected: true }).exists();
          });

          it('adds the selection to the selected value list', () => {
            ValueChipInteractor('Sample 2').exists();
          });
        });
      });

      describe('Keyboard: pressing End key with open menu', () => {
        beforeEach(async () => {
          await multiselection.toggle();
          await Keyboard.end();
        });

        it('moves cursor to the last option', () => {
          OptionInteractor({ index: 5, cursored: true }).exists();
        });

        describe('Keyboard: pressing Home key with open menu', () => {
          beforeEach(async () => {
            await multiselection.toggle();
            await Keyboard.home();
          });

          it('moves cursor to the last option', () => {
            OptionInteractor({ index: 0, cursored: true }).exists();
          });
        });
      });
    });
  });

  describe('Filtering option list: cursor on first', () => {
    beforeEach(async () => {
      await multiselection.filter('sam');
    });

    it('sets cursor to first result', () => {
      OptionInteractor({ index: 0, cursored: true }).exists();
    });

    it('sets the appropriate aria-activedescendant on the filter', () => {
      TextInput({ ariaActiveDescendent: OptionInteractor({ index: 0 }).id }).exists();
    });

    describe('Keyboard control on filtered list: move cursor down', () => {
      beforeEach(async () => {
        await Keyboard.arrowDown();
        await Keyboard.arrowDown();
      });

      it('sets cursor to third result', () => {
        // expect(selection.options(0).isCursored).to.be.false;
        OptionInteractor({ index: 2, cursored: true }).exists();
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        TextInput({ ariaActiveDescendent: OptionInteractor({ index: 2 }).id }).exists();
      });

      describe('Keyboard control on filtered list: move cursor up', () => {
        beforeEach(async () => {
          await Keyboard.arrowUp();
        });

        it('sets cursor to second result', () => {
          // expect(multiselection.options(2).isCursored).to.be.false;
          OptionInteractor({ index: 1, cursored: true }).exists();
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          TextInput({ ariaActiveDescendent: OptionInteractor({ index: 1 }).id }).exists();
        });

        describe('Keyboard control on filtered list: pressing "Enter"', () => {
          beforeEach(async () => {
            await Keyboard.enter();
          });

          it('sets the cursored option as the value', () => {
            multiselection.has({ selected: OptionInteractor({ index: 4 }).textContent });
          });
        });
      });
    });

    describe('Supplied an \'error\' prop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <MultiSelectionHarness
            label="harness test label"
            dataOptions={listOptions}
            error="Selection is invalid!"
          />
        );
      });

      // eslint-disable-next-line
      it('contains no axe errors  - Multiselect: error validation', async () => { return await runAxeTest(); });

      it('renders a validation message', () => {
        multiselection.has({ error: 'Selection is invalid!' });
      });

      describe('With menu open', () => {
        beforeEach(async () => {
          await multiselection.open();
        });

        it('renders errors in the menu', () => {
          menu.has({ error: 'Selection is invalid!' });
        });
      });
    });

    describe('Supplied an \'warning\' prop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <MultiSelectionHarness
            dataOptions={listOptions}
            warning="You might want to choose something different!"
          />
        );
      });

      it('renders a warning validation message', () => {
        multiselection.has({ warning: 'You might want to choose something different!' });
      });

      describe('With menu open', () => {
        beforeEach(async () => {
          await multiselection.open();
        });

        it('renders warning in the menu', () => {
          menu.has({ warning: 'You might want to choose something different!' });
        });
      });
    });
  });

  describe('testing actions', () => {
    let actionSelected;

    const actions = [
      {
        onSelect: () => { actionSelected = true; },
        render: () => <div>actionItem</div>,
      }
    ];

    beforeEach(async () => {
      actionSelected = false;

      await mountWithContext(
        <MultiSelectionHarness
          dataOptions={listOptions}
          actions={actions}
        />
      );
    });

    it('renders action as last option', () => {
      menu.has({ optionCount: listOptions.length + 1 });
      OptionInteractor('actionItem').exists();
    });

    describe('clicking an action', () => {
      beforeEach(async () => {
        await multiselection.select('actionItem');
      });

      it('calls the action\'s onSelect function', () => {
        converge(() => actionSelected);
      });
    });
  });

  describe('asyncFiltering', () => {
    let filtered;

    beforeEach(async () => {
      filtered = false;

      await mountWithContext(
        <MultiSelectionHarness
          asyncFiltering
          dataOptions={null}
          filter={() => { filtered = true; }}
        />
      );
    });

    describe('opening the dropdown', () => {
      beforeEach(async () => {
        await multiselection.open();
      });

      it('opens the menu', expectOpenMenu);

      it('displays loading icon (dataOptions is undefined)', () => {
        menu.has({ loading: true });
      });

      it('calls the supplied filter function', () => {
        converge(() => filtered);
      });
    });
  });

  describe('when the menu is open on a small screen', () => {
    beforeEach(async () => {
      viewport.set(300);
      await mountWithContext(
        <MultiSelectionHarness
          id={testId}
          dataOptions={listOptions}
        />
      );
      await multiselection.toggle();
    });

    afterEach(() => {
      viewport.reset();
    });

    it('should focus the input', () => {
      multiselection.is({ focused: true });
    });

    describe('and the menu was closed', () => {
      beforeEach(async () => {
        await multiselection.toggle();
      });

      it('should focus the control', () => {
        Button().is({ focused: true });
      });
    });
  });

  describe('when a MultiSelect is set as required and placed inside a <form>', () => {
    const submit = new Interactor('button[type="submit"]');

    describe('on desktop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <form onSubmit={e => e.preventDefault()}>
            <MultiSelectionHarness
              required
              id={testId}
              dataOptions={listOptions}
            />
            <button type="submit">Submit</button>
          </form>
        );
        await submit.click();
      });

      it('should focus the filter field', () => {
        multiselection.has({ focused: true });
      });
    });

    describe('on mobile', () => {
      beforeEach(async () => {
        viewport.set(300);

        await mountWithContext(
          <form onSubmit={e => e.preventDefault()}>
            <MultiSelectionHarness
              required
              id={testId}
              dataOptions={listOptions}
            />
            <button type="submit">Submit</button>
          </form>
        );
        await submit.click();
      });

      afterEach(() => {
        viewport.reset();
      });

      it('should focus the control field', () => {
        Button().is({ focused: true });
      });
    });
  });
});
