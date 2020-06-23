import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import Selection from '../Selection';
import SingleSelectionHarness from './SingleSelectionHarness';

import SelectInteractor from './interactor';

describe('Selection, Single select', () => {
  const selection = new SelectInteractor();

  const expectClosedMenu = () => {
    expect(selection.expandedAttribute).to.equal('false');
    expect(selection.listHiddenAttributeSet).to.be.true;
  };

  const expectOpenedMenu = () => {
    expect(selection.expandedAttribute).to.equal('true');
    expect(selection.listHiddenAttributeSet).to.be.false;
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
        id={testId}
        dataOptions={listOptions}
      />
    );
  });

  it('renders the control', () => {
    expect(selection.controlPresent).to.be.true;
  });

  it('does not have a value', () => {
    expect(selection.valLabel).to.equal('');
  });

  it('renders the supplied id prop', () => {
    expect(selection.controlId).to.equal(testId);
  });

  it('list is hidden by default', expectClosedMenu);

  it('control has the has-popup attribute "listbox"', () => {
    expect(selection.popupAttribute).to.equal('listbox');
  });

  it('control\'s aria-expanded attribute is false', () => {
    expect(selection.expandedAttribute).to.equal('false');
  });

  it('control\'s aria-labelledBy attribute is set', () => {
    expect(selection.ariaLabelledBy).to.equal(`selected-${testId}-item`);
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

    it('renders the label', () => {
      expect(selection.labelRendered).to.be.true;
    });

    it('containing the supplied label string', () => {
      expect(selection.label).to.equal('test selection');
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      expect(selection.ariaLabelledBy).to.equal(`sl-label-${testId} selected-${testId}-item`);
    });
  });

  describe('without options', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Selection
          id={testId}
          dataOptions={[]}
        />
      );

      await selection.clickControl();
    });

    it('opens the list', expectOpenedMenu);
  });

  describe('supplying optionAlignment prop', () => {
    describe('setting option alignment to "start"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            dataOptions={listOptions}
            optionAlignment="start"
          />
        );
      });

      it('should align options correctly', () => {
        selection.options().forEach(option => {
          expect(option.hasStartAlignment).to.be.true;
        });
      });
    });

    describe('setting option alignment to "end"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            dataOptions={listOptions}
            optionAlignment="end"
          />
        );
      });

      it('should align options correctly', () => {
        selection.options().forEach(option => {
          expect(option.hasEndAlignment).to.be.true;
        });
      });
    });

    describe('setting option alignment to "center"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            dataOptions={listOptions}
            optionAlignment="center"
          />
        );
      });

      it('should align options correctly', () => {
        selection.options().forEach(option => {
          expect(option.hasCenterAlignment).to.be.true;
        });
      });
    });

    describe('setting option alignment to "outside"', () => {
      beforeEach(async () => {
        await mountWithContext(
          <Selection
            dataOptions={listOptions}
            optionAlignment="outside"
          />
        );
      });

      it('should align options correctly', () => {
        selection.options().forEach(option => {
          expect(option.hasOutsideAlignment).to.be.true;
        });
      });
    });
  });

  describe('clicking the control', () => {
    beforeEach(async () => {
      await selection.clickControl();
    });

    it('opens the list', expectOpenedMenu);

    it('focuses the filter input', () => {
      expect(selection.filterFocused).to.be.true;
    });

    it(`list is rendered with ${listOptions.length} options`, () => {
      expect(selection.optionCount).to.equal(listOptions.length);
    });

    describe('clicking an option', () => {
      beforeEach(async () => {
        await selection.clickOption(3);
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        expect(selection.valLabel).to.equal(`${listOptions[2].label}`);
      });

      it('closes the list', expectClosedMenu);

      it('focuses the control/trigger', () => {
        expect(selection.isFocused).to.be.true;
      });
    });

    describe('filtering options', () => {
      beforeEach(async () => {
        await selection.expandAndFilter('sample');
      });

      it('decreases list to 3 options', () => {
        expect(selection.optionCount).to.equal(3);
      });

      it('does not display the empty message', () => {
        expect(selection.emptyMessagePresent).to.be.false;
      });

      describe('reset filter', () => {
        beforeEach(async () => {
          await selection.expandAndFilter('');
        });

        it('should display initial list', () => {
          expect(selection.optionCount).to.equal(listOptions.length);
        });
      });

      describe('clicking a filtered option', () => {
        beforeEach(async () => {
          await selection.clickOption(3);
        });

        it('sets the value appropriately', () => {
          expect(selection.valLabel).to.equal(`${listOptions[5].label}`);
        });
      });

      describe('No options available after filtering', () => {
        beforeEach(async () => {
          await selection.expandAndFilter('none');
        });

        it('displays the empty message', () => {
          expect(selection.emptyMessagePresent).to.be.true;
        });
      });
    });
  });

  describe('Selection, initial value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SingleSelectionHarness
          initValue={listOptions[1].value}
          options={listOptions}
        />
      );
    });

    it("renders the appropriate option's label", () => {
      expect(selection.valLabel).to.equal(listOptions[1].label);
    });

    describe('Keyboard : letter press', () => {
      beforeEach(async () => {
        await selection.pressKey('button', 83, true);
      });

      it('should set up the first filtered value', () => {
        expect(selection.valLabel).to.equal(listOptions.find(o => o.value.startsWith('s')).label);
      });
    });

    describe('Keyboard : down arrow on control', () => {
      beforeEach(async () => {
        await selection.moveToNextOption('button', true);
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the next option', () => {
        expect(selection.valLabel).to.equal(listOptions[2].label);
      });
    });

    describe('Keyboard : up arrow on control', () => {
      beforeEach(async () => {
        // back twice to keep this from passing if the down arrow test fails.
        await selection.moveToPreviousOption('button', true);
        await selection.moveToPreviousOption('button');
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the previous option', () => {
        expect(selection.valLabel).to.equal(listOptions[0].label);
      });
    });

    describe('Keyboard: Enter press with open option list', () => {
      beforeEach(async () => {
        await selection.pressEnter('input');
      });

      it('closes the list', expectClosedMenu);
    });

    describe('Keyboard: Enter press with closed option list', () => {
      beforeEach(async () => {
        await selection.pressEnter('button', true);
      });

      it('opens the list', expectOpenedMenu);
    });

    describe('Filtering option list: cursor on first', () => {
      beforeEach(async () => {
        await selection.fillFilter('sam');
      });

      it('sets cursor to first result', () => {
        expect(selection.options(0).isCursored).to.be.true;
      });

      it('sets the appropriate aria-activedescendant on the filter', () => {
        expect(selection.filterActiveDescendant).to.equal(selection.options(0).id);
      });

      describe('Keyboard : esc press', () => {
        beforeEach(async () => {
          await selection.pressKey('input', 27, true);
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard : tab press', () => {
        beforeEach(async () => {
          await selection.pressKey('input', 9, true);
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard : space press when filter input is empty', () => {
        beforeEach(async () => {
          await selection.fillFilter('');
          await selection.pressKey('input', 32, true);
        });

        it('should close the list', expectClosedMenu);
      });

      describe('Keyboard control on filtered list: move cursor down', () => {
        beforeEach(async () => {
          await selection.moveToNextOption('input', true);
          await selection.moveToNextOption('input');
        });

        it('sets cursor to third result', () => {
          // expect(selection.options(0).isCursored).to.be.false;
          expect(selection.options(2).isCursored).to.be.true;
        });

        it('sets the appropriate aria-activedescendant on the filter', () => {
          expect(selection.filterActiveDescendant).to.equal(selection.options(2).id);
        });

        describe('Keyboard control on filtered list: move cursor up', () => {
          beforeEach(async () => {
            await selection.moveToPreviousOption('input');
          });

          it('sets cursor to second result', () => {
            // expect(selection.options(2).isCursored).to.be.false;
            expect(selection.options(1).isCursored).to.be.true;
          });

          it('sets the appropriate aria-activedescendant on the filter', () => {
            expect(selection.filterActiveDescendant).to.equal(selection.options(1).id);
          });

          describe('Keyboard control on filtered list: pressing "Enter"', () => {
            beforeEach(async () => {
              await selection.pressEnter('input');
            });

            it('closes the option list', expectClosedMenu);

            it('sets the cursored option as the value', () => {
              expect(selection.valLabel).to.equal(listOptions[4].label);
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
          expect(selection.inputError).to.be.true;
        });

        it('applies error style to control', () => {
          expect(selection.hasErrorStyle);
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
          expect(selection.inputWarning).to.be.true;
        });

        it('applies \'warning\' style to control', () => {
          expect(selection.hasWarningStyle);
        });
      });
    });
  });
});
