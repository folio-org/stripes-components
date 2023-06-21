import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import {
  Button,
  TextField,
  converge,
  including,
  Keyboard,
  Selection as SelectionInteractor,
  SelectionList as SelectListInteractor,
  SelectionOption as SelectionOptionInteractor,
  runAxeTest,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import { RoledHTML } from '../../../tests/helpers/localInteractors';
import Selection from '../Selection';
import SingleSelectionHarness from './SingleSelectionHarness';

// import SelectInteractor from './interactor';

describe('Selection', () => {
  const selection = SelectionInteractor('test selection');

  const expectClosedMenu = () => {
    selection.has({ open: false });
  };

  const expectOpenedMenu = () => {
    selection.has({ open: true });
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



  beforeEach(async () => {
    await mountWithContext(
      <Selection
        label="test selection"
        id={testId}
        dataOptions={listOptions}
      />
    );
  });

  it('does not have axe issues - Selection', runAxeTest);

  it('renders the control', () => {
    selection.exists();
  });

  it('does not have a value', () => {
    selection.has({ value: '' });
  });

  it('renders the supplied id prop', () => {
    selection.has({ id: testId });
  });

  it('list is hidden by default', expectClosedMenu);

  it('control has the has-popup attribute "listbox"', () => {
    Button({ hasPopup: 'listbox' });
  });

  it('control\'s aria-expanded attribute is false', expectClosedMenu);

  it('control\'s aria-labelledBy attribute is set', () => {
    Button({ ariaLabelledBy: `selected-${testId}-item` });
  });

  describe('supplying a label prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Selection
          id={testId}
          dataOptions={listOptions}
          label="test selection"
        />
      );
    });

    it('does not have axe issues - Selection', runAxeTest);

    it('renders the label', () => {
      selection.exists();
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      Button({ ariaLabelledBy: `sl-label-${testId} selected-${testId}-item` });
    });
  });

  describe('supplying a object inputRef prop', () => {
    const inputRef = createRef();

    beforeEach(async () => {
      await mountWithContext(
        <Selection
          id={testId}
          dataOptions={listOptions}
          label="test selection"
          inputRef={inputRef}
        />
      );
    });

    it('should set current value of ref', () => {
      converge(() => expect(inputRef.current).not.to.be.null);
    });
  });

  describe('supplying a function inputRef prop', () => {
    let ref = null;

    const setRef = (elem) => {
      ref = elem;
    };

    beforeEach(async () => {
      await mountWithContext(
        <Selection
          id={testId}
          dataOptions={listOptions}
          label="test selection"
          inputRef={setRef}
        />
      );
    });

    it('should set current value of ref', () => {
      converge(() => expect(ref).not.to.be.null);
    });
  });

  describe('without options', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Selection
          label="test selection"
          id={testId}
          dataOptions={[]}
        />
      );

      await selection.open();
    });

    it('does not have axe issues - Selection - no options', runAxeTest);

    it('opens the list', expectOpenedMenu);
  });

  describe('supplying optionAlignment prop', () => {
    describe('setting option alignment to "start"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            label="test selection"
            dataOptions={listOptions}
            optionAlignment="start"
          />
        );
      });

      it('should align options correctly', () => {
        SelectionOptionInteractor().has({ className: including('optionStart') });
      });
    });

    describe('setting option alignment to "end"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            label="test selection"
            dataOptions={listOptions}
            optionAlignment="end"
          />
        );
      });

      it('should align options correctly', () => {
        SelectionOptionInteractor().has({ className: including('optionEnd') });
      });
    });

    describe('setting option alignment to "center"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            label="test selection"
            dataOptions={listOptions}
            optionAlignment="center"
          />
        );
      });

      it('should align options correctly', () => {
        SelectionOptionInteractor().has({ className: including('optionCentered') });
      });
    });

    describe('setting option alignment to "outside"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            label="test selection"
            dataOptions={listOptions}
            optionAlignment="outside"
          />
        );
      });

      it('should align options correctly', () => {
        SelectionOptionInteractor().has({ className: including('optionOutside') });
      });
    });
  });

  describe('clicking the control', () => {
    beforeEach(async () => {
      await selection.open();
    });

    it('opens the list', expectOpenedMenu);

    it('does not have axe issues - Selection', runAxeTest);

    it('focuses the filter input', () => {
      TextField({ ariaLabel: including('filter'), focused: true }).exists();
    });

    it('filter input is rendered with "combobox" role', () => {
      TextField({ ariaLabel: including('filter'), role: 'combobox' }).exists();
    });

    it(`list is rendered with ${listOptions.length} options`, () => {
      SelectListInteractor({ optionCount: listOptions.length }).exists();
    });

    describe('clicking an option', () => {
      beforeEach(async () => {
        await selection.choose('Option 2');
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        selection.has({ value: 'Option 2' });
      });

      it('closes the list', expectClosedMenu);

      it('focuses the control/trigger', () => {
        selection.has({ focused: true });
      });
    });

    describe('filtering options', () => {
      beforeEach(async () => {
        await selection.filterOptions('Sample');
      });

      it('decreases list to 3 options', () => {
        SelectListInteractor({ optionCount: 3 }).exists();
      });

      it('does not display the empty message', () => {
        RoledHTML({ role: 'alert' }).absent();
      });

      describe('reset filter', () => {
        beforeEach(async () => {
          await selection.filterOptions('');
        });

        it('should display initial list', () => {
          SelectListInteractor({ optionCount: listOptions.length }).exists();
        });
      });

      describe('clicking a filtered option', () => {
        beforeEach(async () => {
          await selection.choose('Sample 1');
        });

        it('sets the value appropriately', () => {
          selection.has({ value: `${listOptions[5].label}` });
        });
      });

      describe('No options available after filtering', () => {
        beforeEach(async () => {
          await selection.filterOptions('none');
        });

        it('displays the empty message', () => {
          SelectionOptionInteractor('List is empty').exists();
        });
      });
    });
  });

  describe('Selection, initial value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SingleSelectionHarness
          label="test selection"
          initValue={listOptions[1].value}
          options={listOptions}
        />
      );
    });

    it("renders the appropriate option's label", () => {
      selection.has({ value: listOptions[1].label });
    });

    describe('Keyboard : letter press', () => {
      beforeEach(async () => {
        await selection.focus();
        // press the S key...
        await Keyboard.pressKey(83);
      });

      it('should set up the first filtered value', () => {
        selection.has({ value: listOptions.find(o => o.value.startsWith('s')).label });
      });
    });

    describe('Keyboard : down arrow on control', () => {
      beforeEach(async () => {
        await selection.focus();
        await Keyboard.arrowDown();
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the next option', () => {
        selection.has({ value: listOptions[2].label });
      });
    });

    describe('Keyboard : up arrow on control', () => {
      beforeEach(async () => {
        // back twice to keep this from passing if the down arrow test fails.
        await selection.focus();
        await Keyboard.arrowUp();
        await Keyboard.arrowUp();
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the previous option', () => {
        selection.has({ value: listOptions[0].label });
      });
    });

    describe('Keyboard: Enter press with open option list', () => {
      beforeEach(async () => {
        await selection.open();
        await Keyboard.enter();
      });

      it('closes the list', expectClosedMenu);
    });

    describe('Keyboard: Enter press with closed option list', () => {
      beforeEach(async () => {
        await selection.focus();
        await Keyboard.enter();
      });

      it('opens the list', expectOpenedMenu);
    });

    describe('Filtering option list: cursor on first', () => {
      beforeEach(async () => {
        await selection.filterOptions('sam');
        // await RoledHTML({ role: 'combobox' }).focus();
      });

      it('sets cursor to first result', () => {
        SelectionOptionInteractor({ className: including('cursor'), index: 0 }).exists();
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        const id = SelectionOptionInteractor({ index: 0 }).perform((el) => el.id);
        Button({ ariaActiveDescendent: id }).exists();
      });

      describe('Keyboard : esc press', () => {
        beforeEach(async () => {
          await Keyboard.escape();
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard : tab press', () => {
        beforeEach(async () => {
          await Keyboard.tab();
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard : space press when filter input is empty', () => {
        beforeEach(async () => {
          await selection.filterOptions('');
          await Keyboard.space();
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard control on filtered list: move cursor down', () => {
        beforeEach(async () => {
          await Keyboard.arrowDown();
          await Keyboard.arrowDown();
        });

        it('sets cursor to third result', () => {
          SelectionOptionInteractor({ className: including('cursor'), index: 0 }).exists();
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          const id = SelectionOptionInteractor({ index: 2 }).perform((el) => el.id);
          Button({ ariaActiveDescendent: id }).exists();
        });

        describe('Keyboard control on filtered list: move cursor up', () => {
          beforeEach(async () => {
            await Keyboard.arrowUp();
          });

          it('sets cursor to second result', () => {
            SelectionOptionInteractor({ className: including('cursor'), index: 1 }).exists();
          });

          it('sets the appropriate aria-activedescendant on the filter', () => {
            const id = SelectionOptionInteractor({ index: 1 }).perform((el) => el.id);
            Button({ ariaActiveDescendent: id }).exists();
          });

          describe('Keyboard control on filtered list: pressing "Enter"', () => {
            beforeEach(async () => {
              await Keyboard.enter();
            });

            it('closes the option list', expectClosedMenu);

            it('sets the cursored option as the value', () => {
              selection.has({ value: listOptions[4].label });
            });
          });
        });
      });

      describe('Supplied an \'error\' prop', () => {
        beforeEach(async () => {
          await mountWithContext(
            <Selection
              dataOptions={listOptions}
              error="Selection is invalid!"
            />
          );
        });

        it('renders a validation message', () => {
          RoledHTML({ role: 'alert' }).exists();
        });

        it('applies error style to control', () => {
          Button().has({ className: including('error') });
        });
      });

      describe('Supplied an \'warning\' prop', () => {
        beforeEach(async () => {
          await mountWithContext(
            <Selection
              dataOptions={listOptions}
              warning="You might want to choose something different!"
            />
          );
        });

        it('renders a warning validation message', () => {
          RoledHTML({ role: 'alert' }).exists();
        });

        it('applies \'warning\' style to control', () => {
          Button().has({ className: including('warning') });
        });
      });
    });
  });

  describe('Enter key on open, empty list will not remove value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SingleSelectionHarness
          label="test selection"
          initValue="test2"
          options={listOptions}
        />
      );
    });

    it('has the intial value', () => selection.is({ value: 'Select controlOption 2' }));

    describe('filtering all options from the list', () => {
      beforeEach(async () => {
        await selection.filterOptions('blar');
      });

      it('list has no options present', () => SelectionOptionInteractor('-List is empty-').exists());

      describe('pressing the enter key', () => {
        beforeEach(async () => {
          await Keyboard.pressKey('Enter');
        });

        it('hides the list', () => selection.is({ open: false }));
        it('has the intial value', () => selection.is({ value: 'Select controlOption 2' }));
      });
    });
  });
});
