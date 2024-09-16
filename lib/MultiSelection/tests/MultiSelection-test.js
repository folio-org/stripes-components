import React from 'react';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  HTML,
  MultiSelect,
  MultiSelectMenu as MenuInteractor,
  MultiSelectOption,
  Button,
  TextInput,
  Label,
  Keyboard,
  converge,
  including,
  runAxeTest
} from '@folio/stripes-testing';
import { Interactor } from '@bigtest/interactor';

import { mountWithContext } from '../../../tests/helpers';
import MultiSelection from '../MultiSelection';
import MultiSelectionHarness from './MultiSelectionHarness';

const MultiSelectInteractor = MultiSelect.extend('local multiselect')
  .filters({
    ariaLabelledby: (el) => el.querySelector('[role=combobox]').getAttribute('aria-labelledby'),
  });

const OptionInteractor = MultiSelectOption.extend('local multiselect option')
  .filters({
    cursored: (el) => el.className.includes('Cursor'),
  });

const LoadingInteractor = HTML.extend('loading')
  .selector('[class^=spinner-]')

const menu = MenuInteractor();
const hiddenInput = TextInput({ className: including('multiSelectValueInput') });
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

const multiselectionAriaLabelledby = MultiSelectInteractor({ ariaLabelledby: 'test-label-id' });
const multiselection = MultiSelectInteractor();

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
  describe('basic rendering', () => {
    const onRemove = sinon.spy();
    const onChange = sinon.spy();
    beforeEach(async () => {
      await onRemove.resetHistory();
      await onChange.resetHistory();
      await mountWithContext(
        <MultiSelectionHarness
          id={testId}
          dataOptions={listOptions}
          placeholder="test multiselect"
          label="test multiselect"
          onRemove={onRemove}
          onChange={(fn, val) => { onChange(val); fn(val); }}
          ariaLabelledby="test-label-id"
        />
      );
    });

    it('contains no axe errors - Multiselect', runAxeTest);

    it('renders the control', () => multiselectionAriaLabelledby.exists());

    it('does not have a value', () => multiselectionAriaLabelledby.has({ selectedCount: 0 }));

    it('renders the supplied id prop', () => multiselectionAriaLabelledby.has({ id: testId }));

    it('renders placeholder', () => multiselectionAriaLabelledby.has({ placeholder: 'test multiselect' }));

    it('list is hidden by default', expectClosedMenu);

    it('control\'s aria-labelledBy attribute is set', () => multiselectionAriaLabelledby.has({ ariaLabelledby: including('test-label-id') }));

    it('should have empty hidden value', () => hiddenInput.has({ value: '' }));

    describe('clicking the control', () => {
      beforeEach(async () => {
        await multiselectionAriaLabelledby.toggle();
      });

      it('opens the list', expectOpenMenu);

      it('contains no axe errors - Multiselect: open menu', runAxeTest);

      it('focuses the filter input', () => multiselection.has({ focused: true }));

      it(`list is rendered with ${listOptions.length} options`, () => menu.has({ optionCount: listOptions.length }));

      describe('clicking an option', () => {
        beforeEach(async () => {
          await multiselection.select('Option 2');
        });

        it(`sets control value to ${listOptions[2].label}`, () => ValueChipInteractor(`${listOptions[2].label}`).exists());

        it('the list stays open', expectOpenMenu);

        it('does not render placeholder', () => multiselection.has({ placeholder: '' }));

        it('sets correct value of hidden input value', () => hiddenInput.has({ value: listOptions[2].label }));

        it('calls the onChange handler supplying the selected object', async () => {
          await converge(() => {
            if (!onChange.calledOnceWith([listOptions[2]])) throw new Error('expected onChange handler to be called with array of selected values');
          });
        });
      });

      describe('clicking multiple options', () => {
        beforeEach(async () => {
          await multiselection.select([
            `${listOptions[2].label}`,
            `${listOptions[3].label}`,
            `${listOptions[4].label}`
          ])
        });

        it(`sets control value to ${listOptions[2].label}, ${listOptions[3].label}, ${listOptions[4].label}`, async () => {
          return Promise.all(
            [
              multiselection.has({ selectedCount: 3 }),
              multiselection.has({ selected: [`${listOptions[2].label}`, `${listOptions[3].label}`, `${listOptions[4].label}`] })
            ]
          );
        });

        it('the list stays open', expectOpenMenu);

        describe('Keyboard: Backspace to remove values', () => {
          beforeEach(async () => {
            await multiselection.focus();
            await Keyboard.backspace();
          });

          it('removes the last selected item', () => {
            return Promise.all(
              [
                multiselection.has({ selectedCount: 2 }),
                multiselection.has({ selected: [`${listOptions[2].label}`, `${listOptions[3].label}`] })
              ]
            );
          });

          it('calls the supplied onRemove handler, supplying the removed item.', () => {
            expect(onRemove.calledOnceWith(listOptions[4])).to.equal(true);
          });
        });

        describe('Clicking the remove button on the first value chip', () => {
          beforeEach(async () => {
            await ValueChipInteractor({ index: 0 }).remove();
          });

          it('calls the supplied onRemove handler, supplying the removed item.', () => {
            expect(onRemove.calledOnceWith(listOptions[2])).to.equal(true);
          });
        });

        describe('Clicking the selected item in the options list', () => {
          beforeEach(async () => {
            await multiselection.toggle();
            await OptionInteractor(listOptions[3].label).click();
            await multiselection.has({ selectedCount: 2 });
          });
          it('calls the supplied onRemove handler, supplying the removed item.', () => {
            expect(onRemove.calledOnceWith(listOptions[3])).to.equal(true);
          });
          it('has option 3 selected', () => OptionInteractor(listOptions[3].label).has({ selected: false }));
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
          await multiselection.fillIn('sample');
        });

        it('first option is cursored', () => OptionInteractor({ index: 0, cursored: true }).exists());

        it('decreases list to 3 options', () => menu.has({ optionCount: 3 }));

        it('does not display the empty message', () => emptyMessage().absent());

        describe('clicking a filtered option', () => {
          beforeEach(async () => {
            await OptionInteractor({ index: 2 }).click();
          });

          it('sets the value appropriately', () => {
            multiselection.has({ selectedCount: 1 });
            OptionInteractor({ selected: [`${listOptions[5].label}`] });
          });

          it('empties the filter field', () => multiselection.has({ filterValue: '' }));
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
  });

  describe('supplying a label prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelection
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

  describe('supplying an aria-label prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelection
          id={testId}
          dataOptions={listOptions}
          aria-label="test aria selection"
        />
      );
    });

    it('renders the label', () => {
      MultiSelectInteractor('test aria selection').has({ visible: false });
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      multiselection.has({ arialabelledBy: `${testId}-label multi-value-status-${testId}` });
    });

    it('renders the label with an sr-only classname', () => Label('test aria selection').has({ className: including('sr-only'), visible: false }));

    it('contains no axe errors - Multiselect: aria-label prop', runAxeTest);
  });

  describe('supplying an aria-labelledby prop', () => {
    const customLabelledBy = 'custom-aria-labelledby';

    beforeEach(async () => {
      await mountWithContext(
        <MultiSelection
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
        <MultiSelection
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
          <MultiSelection
            label="harness test label"
            dataOptions={listOptions}
            error="Selection is invalid!"
          />
        );
      });

      it('contains no axe  - Multiselect: error validation', runAxeTest);

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
          <MultiSelection
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
        <MultiSelection
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

      it('calls the action\'s onSelect function', () => converge(() => { if (!actionSelected) throw new Error('MultiSelection - action should be executed'); }));
    });
  });

  describe('asyncFiltering', () => {
    let filtered;

    beforeEach(async () => {
      filtered = false;

      await mountWithContext(
        <MultiSelection
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

      it('displays loading icon (dataOptions is undefined)', () => LoadingInteractor().exists());

      it('calls the supplied filter function', () => converge(() => filtered));
    });
  });

  describe('when the menu is open on a small screen', () => {
    beforeEach(async () => {
      viewport.set(300);
      await mountWithContext(
        <MultiSelection
          id={testId}
          dataOptions={listOptions}
        />
      );
      await multiselection.toggle();
    });

    afterEach(() => {
      viewport.reset();
    });

    it('should focus the input', () => multiselection.is({ focused: true }));

    describe('and the menu was closed', () => {
      beforeEach(async () => {
        await multiselection.toggle();
      });

      it('should focus the control', () => Button().is({ focused: true }));
    });
  });

  describe('when a MultiSelect is set as required and placed inside a <form>', () => {
    const submit = new Interactor('button[type="submit"]');

    describe('on desktop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <form onSubmit={e => e.preventDefault()}>
            <MultiSelection
              required
              id={testId}
              dataOptions={listOptions}
            />
            <button type="submit">Submit</button>
          </form>
        );
        await submit.click();
      });

      it('should focus the filter field', () => multiselection.has({ focused: true }));
    });

    describe('on mobile', () => {
      beforeEach(async () => {
        viewport.set(300);

        await mountWithContext(
          <form onSubmit={e => e.preventDefault()}>
            <MultiSelection
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

      it('should focus the control field', () => multiselection.is({ focused: true }));
    });

    describe('when supplying a showLoading prop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <MultiSelection
            id={testId}
            dataOptions={listOptions}
            aria-label="test aria selection"
            showLoading
          />
        );
      });

      it('should display loading icon', () => LoadingInteractor().exists());
    });
  });

  describe('Changing the value prop outside of render', () => {
    const changeSpy = sinon.spy();
    beforeEach(async () => {
      changeSpy.resetHistory();
      const harnessFunc = (fn, val) => {
        changeSpy(val);
        fn(val);
      };
      await mountWithContext(
        <MultiSelectionHarness
          label="test multiselection"
          initValue={[listOptions[2]]}
          options={listOptions}
          onChange={harnessFunc}
        />
      );
    });

    it('renders initial value as provided', () => multiselection.has({ selected: ['Option 2'] }));

    describe('Resetting the value', () => {
      beforeEach(async () => {
        await Button('reset').click();
      });

      it('removes the value', () => multiselection.has({ selectedCount: 0 }))

      it('does not call the supplied change handler', async () => converge(() => { if (changeSpy.calledOnceWith([])) throw new Error('expected change handler not to be called') }));
    });
  });

  describe('Changing the value prop outside of render', () => {
    const changeSpy = sinon.spy();
    beforeEach(async () => {
      changeSpy.resetHistory();
      const harnessFunc = (fn, val) => {
        changeSpy(val);
        fn(val);
      };
      await mountWithContext(
        <MultiSelectionHarness
          label="test multiselection"
          initValue={[listOptions[2]]}
          options={listOptions}
          onChange={harnessFunc}
        />
      );
    });

    describe('Removing the value (setting to undefined)', () => {
      beforeEach(async () => {
        await Button('remove').click();
      });

      it('removes the value', () => multiselection.has({ selectedCount: 0 }))

      it('does not call the supplied change handler', async () => converge(() => { if (changeSpy.calledOnce) throw new Error('expected change handler not to be called') }));
    });
  });

  describe('Change handlers slow to resolve', () => {
    const changeSpy = sinon.spy();

    beforeEach(async () => {
      changeSpy.resetHistory();
      const harnessFunc = (fn, val) => {
        setTimeout(() => {
          changeSpy(val);
          fn(val);
        }, 100)
      };
      await mountWithContext(
        <MultiSelectionHarness
          label="test multiselection"
          initValue={[listOptions[2]]}
          options={listOptions}
          onChange={harnessFunc}
        />
      );
    });

    it('renders initial value as provided', () => multiselection.has({ selected: ['Option 2'] }));

    describe('Choosing a new value', () => {
      beforeEach(async () => {
        await multiselection.choose('Option 0');
      });

      it('updates the value', () => multiselection.has({ selectedCount: 2 }))

      it('calls the supplied change handler', async () => converge(() => { if (!changeSpy.calledOnceWith([listOptions[2], listOptions[0]])) throw new Error('expected change handler to be called') }));
    });
  });

  describe('Change handlers slow to resolve, empty initial, multiple selections...', () => {
    const changeSpy = sinon.spy();

    beforeEach(async () => {
      changeSpy.resetHistory();
      const harnessFunc = (fn, val) => {
        setTimeout(() => {
          changeSpy(val);
          fn(val);
        }, 100)
      };
      await mountWithContext(
        <MultiSelectionHarness
          label="test multiselection"
          initValue={[]}
          options={listOptions}
          onChange={harnessFunc}
        />
      );
    });

    it('displays no value', () => multiselection.has({ selectedCount: 0 }));

    describe('Choosing multiple values', () => {
      beforeEach(async () => {
        changeSpy.resetHistory();
        await multiselection.choose([
          listOptions[0].label,
          listOptions[1].label,
        ]);
        await Button(including('update')).click();
      });

      it('updates the value', () => multiselection.has({ selectedCount: 2 }))

      it('calls the supplied change handler twice, once per selection', async () => converge(() => { if (!changeSpy.calledTwice) throw new Error('expected change handler to be for each change') }));

      describe('deselecting both values in reverse order...', () => {
        beforeEach(async () => {
          changeSpy.resetHistory();
          await multiselection.choose([
            listOptions[1].label,
            listOptions[0].label,
          ]);
          await Button(including('update')).click();
        });

        it('updates the value', () => multiselection.has({ selectedCount: 0 }))

        it('calls the supplied change handler once per de-selection...', async () => converge(() => { if (!changeSpy.calledTwice) throw new Error('expected change handler to be for each change') }));
      });
    });
  });

  describe('usePortal prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelectionHarness
          label="test multiselection"
          initValue={[]}
          options={listOptions}
          usePortal
        />
      );
      await multiselection.open();
    });

    it('renders options list to overlay element', () => HTML({ id: 'OverlayContainer' }).find(MenuInteractor()).exists());
  })
});
