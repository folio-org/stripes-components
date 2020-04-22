import React from 'react';
import { describe, beforeEach, it, afterEach } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import MultiSelectionHarness from './MultiSelectionHarness';
// SingleSelectionHarness from './SingleSelectionHarness';

import MultiSelectionInteractor from './interactor';

const multiselection = new MultiSelectionInteractor();

const expectClosedMenu = () => {
  expect(multiselection.listHiddenAttributeSet).to.be.true;
};

const expectOpenMenu = () => {
  expect(multiselection.listHiddenAttributeSet).to.be.false;
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
      />
    );
  });

  it('renders the control', () => {
    expect(multiselection.controlPresent).to.be.true;
  });

  it('does not have a value', () => {
    expect(multiselection.valueCount).to.equal(0);
  });

  it('renders the supplied id prop', () => {
    expect(multiselection.containerId).to.equal(testId);
  });

  it('renders placeholder', () => {
    expect(multiselection.filterPlaceholder).to.equal('test multiselect');
  });

  it('list is hidden by default', expectClosedMenu);

  it('expand button has a true has-popup attribute', () => {
    expect(multiselection.popupAttribute).to.equal('true');
  });

  it('control\'s aria-labelledBy attribute is set', () => {
    expect(multiselection.controlAriaLabelledBy).to.equal(`multi-value-status-${testId}`);
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
      expect(multiselection.labelRendered).to.be.true;
    });

    it('containing the supplied label string', () => {
      expect(multiselection.label).to.equal('test selection');
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      expect(multiselection.controlAriaLabelledBy).to.equal(`${testId} multi-value-status-${testId}`);
    });
  });

  describe('clicking the control', () => {
    beforeEach(async () => {
      await multiselection.clickControl();
    });

    it('opens the list', expectOpenMenu);

    it('focuses the filter input', () => {
      expect(multiselection.filterIsFocused).to.be.true;
    });

    it(`list is rendered with ${listOptions.length} options`, () => {
      expect(multiselection.optionCount).to.equal(listOptions.length);
    });

    describe('clicking an option', () => {
      beforeEach(async () => {
        await multiselection.options(2).clickOption();
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        expect(multiselection.valueCount).to.equal(1);
        expect(multiselection.values(0).valLabel).to.equal(`${listOptions[2].label}`);
      });

      it('the list stays open', expectOpenMenu);

      it('does not render placeholder', () => {
        expect(multiselection.filterPlaceholder).to.equal('');
      });
    });

    describe('clicking multiple options', () => {
      beforeEach(async () => {
        await multiselection.options(2).clickOption();
        await multiselection.options(3).clickOption();
        await multiselection.options(4).clickOption();
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        expect(multiselection.valueCount).to.equal(3);
        expect(multiselection.values(0).valLabel).to.equal(`${listOptions[2].label}`);
        expect(multiselection.values(1).valLabel).to.equal(`${listOptions[3].label}`);
        expect(multiselection.values(2).valLabel).to.equal(`${listOptions[4].label}`);
      });

      it('the list stays open', expectOpenMenu);

      describe('Keyboard: Backspace to remove values', () => {
        beforeEach(async () => {
          await multiselection.pressBackspace('input', true);
        });

        it('removes the last selected item', () => {
          expect(multiselection.valueCount).to.equal(2);
          expect(multiselection.values(0).valLabel).to.equal(`${listOptions[2].label}`);
          expect(multiselection.values(1).valLabel).to.equal(`${listOptions[3].label}`);
        });
      });
    });

    describe('clicking the toggleButton with the open menu', () => {
      beforeEach(async () => {
        await multiselection.clickToggleButton();
      });

      it('closes the list', expectClosedMenu);
    });

    describe('filtering options', () => {
      beforeEach(async () => {
        await multiselection.fillFilter('sample');
      });

      it('first option is cursored', () => {
        expect(multiselection.options(0).isCursored).to.be.true;
      });

      it('decreases list to 3 options', () => {
        expect(multiselection.optionCount).to.equal(3);
      });

      it('does not display the empty message', () => {
        expect(multiselection.emptyMessagePresent).to.be.false;
      });

      describe('clicking a filtered option', () => {
        beforeEach(async () => {
          await multiselection.options(2).clickOption();
        });

        it('sets the value appropriately', () => {
          expect(multiselection.valueCount).to.equal(1);
          expect(multiselection.values(0).valLabel).to.equal(`${listOptions[5].label}`);
        });
      });

      describe('No options available after filtering', () => {
        beforeEach(async () => {
          await multiselection.expandAndFilter('none');
        });

        it('displays the empty message', () => {
          expect(multiselection.emptyMessagePresent).to.be.true;
        });
      });
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
      expect(multiselection.values(0).valLabel).to.equal(listOptions[1].label);
      expect(multiselection.values(1).valLabel).to.equal(listOptions[3].label);
      expect(multiselection.values(2).valLabel).to.equal(listOptions[5].label);
    });

    describe('Keyboard : navigating selected values', () => {
      describe('Keyboard: pressing the Home key when middle selected value is focused', () => {
        beforeEach(async () => {
          await multiselection.values(1).focusRemoveButton();
          await multiselection.values(1).pressHome();
        });

        it('focuses the first selected item', () => {
          expect(multiselection.values(0).isFocused).to.be.true;
        });

        describe('Keyboard: pressing the End key while a selected value is focused', () => {
          beforeEach(async () => {
            await multiselection.values(0).pressEnd();
          });

          it('focuses the last selected item', () => {
            expect(multiselection.values(multiselection.valueCount - 1).isFocused).to.be.true;
          });
        });
      });
    });

    describe('Clicking the remove button on a value chip', () => {
      beforeEach(async () => {
        await multiselection.values(0).clickRemoveButton();
      });

      it('removes the value from selection', () => {
        expect(multiselection.valueCount).to.equal(2);
      });

      it('moves focus to remaining option', () => {
        expect(multiselection.values(0).isFocused).to.be.true;
      });

      describe('Clicking the remove button on the last remaining value chip', () => {
        beforeEach(async () => {
          await multiselection.values(0).clickRemoveButton();
          await multiselection.values(0).clickRemoveButton();
        });

        it('removes the value from selection', () => {
          expect(multiselection.valueCount).to.equal(0);
        });

        it('moves focus to the filter', () => {
          expect(multiselection.filterIsFocused).to.be.true;
        });
      });
    });

    describe('Keyboard : down arrow on control with menu closed', () => {
      beforeEach(async () => {
        await multiselection
          .focusFilter()
          .moveToNextOption('input', false);
      });

      it('opens the selection menu', expectOpenMenu);

      it('the cursor is on the first option', () => {
        expect(multiselection.options(0).isCursored).to.be.true;
      });
    });

    describe('Keyboard : down arrow with open menu navigates next options', () => {
      beforeEach(async () => {
        // back twice to keep this from passing if the down arrow test fails.
        await multiselection.moveToNextOption('input', true);
        await multiselection.moveToNextOption('input', false);
        await multiselection.moveToNextOption('input', false);
      });

      it('moves cursor the next option', () => {
        expect(multiselection.options(2).isCursored).to.be.true;
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(2).id);
      });

      describe('Keyboard : up arrow with open menu navigates to previous option', () => {
        beforeEach(async () => {
          await multiselection.moveToPreviousOption('input', true);
          await multiselection.moveToPreviousOption('input', false);
        });

        it('moves cursor the previous option', () => {
          expect(multiselection.options(0).isCursored).to.be.true;
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(0).id);
        });

        describe('Keyboard : pressing enter with an open menu', () => {
          beforeEach(async () => {
            await multiselection.pressEnter('input', false);
          });

          it('selects the option at the cursor', () => {
            expect(multiselection.options(0).isCursored).to.be.true;
            expect(multiselection.options(0).isSelected).to.be.true;
          });

          it('adds the selection to the selected value list', () => {
            expect(multiselection.options(0).label)
              .to.equal(
                multiselection.values(multiselection.valueCount - 1)
                  .valLabel
              );
          });
        });
      });

      describe('Keyboard: pressing End key with open menu', () => {
        beforeEach(async () => {
          await multiselection.pressEnd('input', false);
        });

        it('moves cursor to the last option', () => {
          expect(multiselection.options(listOptions.length - 1).isCursored).to.be.true;
        });

        describe('Keyboard: pressing Home key with open menu', () => {
          beforeEach(async () => {
            await multiselection.pressHome('input', false);
          });

          it('moves cursor to the last option', () => {
            expect(multiselection.options(0).isCursored).to.be.true;
          });
        });
      });
    });
  });

  describe('Filtering option list: cursor on first', () => {
    beforeEach(async () => {
      await multiselection.fillFilter('sam');
    });

    it('sets cursor to first result', () => {
      expect(multiselection.options(0).isCursored).to.be.true;
    });

    it('sets the appropriate aria-activedescendant on the filter', () => {
      expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(0).id);
    });

    describe('Keyboard control on filtered list: move cursor down', () => {
      beforeEach(async () => {
        await multiselection.moveToNextOption('input', true);
        await multiselection.moveToNextOption('input');
      });

      it('sets cursor to third result', () => {
        // expect(selection.options(0).isCursored).to.be.false;
        expect(multiselection.options(2).isCursored).to.be.true;
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(2).id);
      });

      describe('Keyboard control on filtered list: move cursor up', () => {
        beforeEach(async () => {
          await multiselection.moveToPreviousOption('input');
        });

        it('sets cursor to second result', () => {
          // expect(multiselection.options(2).isCursored).to.be.false;
          expect(multiselection.options(1).isCursored).to.be.true;
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          expect(multiselection.filterActiveDescendant).to.equal(multiselection.options(1).id);
        });

        describe('Keyboard control on filtered list: pressing "Enter"', () => {
          beforeEach(async () => {
            await multiselection.pressEnter('input');
          });

          it('sets the cursored option as the value', () => {
            expect(multiselection.values(multiselection.valueCount - 1).valLabel)
              .to.equal(listOptions[4].label);
          });
        });
      });
    });

    describe('Supplied an \'error\' prop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <MultiSelectionHarness
            dataOptions={listOptions}
            error="Selection is invalid!"
          />
        );
      });

      it('renders a validation message', () => {
        expect(multiselection.inputError).to.be.true;
      });

      it('applies error style to control', () => {
        expect(multiselection.hasErrorStyle);
      });

      describe('With menu open', () => {
        beforeEach(async () => {
          await multiselection.clickControl();
        });

        it('renders errors in the menu', () => {
          expect(multiselection.errorMessageInMenu).to.be.true;
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
        expect(multiselection.inputWarning).to.be.true;
      });

      it('applies \'warning\' style to control', () => {
        expect(multiselection.hasWarningStyle);
      });

      describe('With menu open', () => {
        beforeEach(async () => {
          await multiselection.clickControl();
        });

        it('renders warning in the menu', () => {
          expect(multiselection.warningMessageInMenu).to.be.true;
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
      expect(multiselection.optionCount).to.equal(listOptions.length + 1);
      expect(multiselection.options(listOptions.length).label).to.equal('actionItem');
    });

    describe('clicking an action', () => {
      beforeEach(async () => {
        await multiselection.options(listOptions.length).clickOption();
      });

      it('calls the action\'s onSelect function', () => {
        expect(actionSelected).to.be.true;
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
        await multiselection.clickToggleButton();
      });

      it('opens the menu', expectOpenMenu);

      it('displays loading icon (dataOptions is undefined)', () => {
        expect(multiselection.loaderPresent).to.be.true;
      });

      it('calls the supplied filter function', () => {
        expect(filtered).to.be.true;
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
      await multiselection.clickToggleButton();
    });

    afterEach(() => {
      viewport.reset();
    });

    it('should focus the input', () => {
      expect(multiselection.filterIsFocused).to.be.true;
    });

    describe('and the menu was closed', () => {
      beforeEach(async () => {
        await multiselection.clickToggleButton();
      });

      it('should focus the control', () => {
        expect(multiselection.controlIsFocused).to.be.true;
      });
    });
  });
});
