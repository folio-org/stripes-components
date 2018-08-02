import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import MultiSelection from '../MultiSelection';
// SingleSelectionHarness from './SingleSelectionHarness';

import MultiSelectionInteractor from './interactor';

describe.only('MultiSelect', () => {
  const multiselection = new MultiSelectionInteractor();

  const expectClosedMenu = () => {
    // expect(selection.expandedAttribute).to.equal('false');
    expect(multiselection.listHiddenAttributeSet).to.be.true;
  };

  const expectOpenedMenu = () => {
    // (multiselection.expandedAttribute).to.equal('true');
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

  beforeEach(async () => {
    await mountWithContext(
      <MultiSelection
        id={testId}
        dataOptions={listOptions}
      />
    );
  });

  it('renders the control', () => {
    expect(multiselection.controlPresent).to.be.true;
  });

  it('does not have a value', () => {
    expect(multiselection.valLabel).to.equal('');
  });

  it('renders the supplied id prop', () => {
    expect(multiselection.controlId).to.equal(testId);
  });

  it('list is hidden by default', expectClosedMenu);

  it('expand button has the has-popup attribute "listbox"', () => {
    expect(multiselection.popupAttribute).to.be(true);
  });

  it('control\'s aria-labelledBy attribute is set', () => {
    expect(multiselection.ariaLabelledBy).to.equal(`selected-${testId}-item`);
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
      expect(multiselection.labelRendered).to.be.true;
    });

    it('containing the supplied label string', () => {
      expect(multiselection.label).to.equal('test selection');
    });

    it('control\'s aria-labelledBy attribute is set', () => {
      expect(multiselection.ariaLabelledBy).to.equal(`sl-label-${testId} selected-${testId}-item `);
    });
  });

  /* describe('clicking the control', () => {
    beforeEach(async () => {
      await multiselection.clickControl();
    });

    it('opens the list', expectOpenedMenu);

    it('focuses the filter input', () => {
      expect(multiselection.filterFocused).to.be.true;
    });

    it('filter input is rendered with "listbox" role', () => {
      expect(multiselection.filterRole).to.equal('listbox');
    });

    it(`list is rendered with ${listOptions.length} options`, () => {
      expect(multiselection.optionCount).to.equal(listOptions.length);
    });

    describe('clicking an option', () => {
      beforeEach(async () => {
        await multiselection.clickOption(3);
      });

      it(`sets control value to ${listOptions[2].label}`, () => {
        expect(multiselection.valLabel).to.equal(`${listOptions[2].label}`);
      });

      it('closes the list', expectClosedMenu);

      it('focuses the control/trigger', () => {
        expect(multiselection.isFocused).to.be.true;
      });
    });

    describe('filtering options', () => {
      beforeEach(async () => {
        await multiselection.expandAndFilter('sample');
      });

      it('decreases list to 3 options', () => {
        expect(multiselection.optionCount).to.equal(3);
      });

      it('does not display the empty message', () => {
        expect(multiselection.emptyMessagePresent).to.be.false;
      });

      describe('clicking a filtered option', () => {
        beforeEach(async () => {
          await multiselection.clickOption(3);
        });

        it('sets the value appropriately', () => {
          expect(multiselection.valLabel).to.equal(`${listOptions[5].label}`);
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
      expect(multiselection.valLabel).to.equal(listOptions[1].label);
    });

    describe('Keyboard : down arrow on control', () => {
      beforeEach(async () => {
        await multiselection.moveToNextOption('button', true);
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the next option', () => {
        expect(multiselection.valLabel).to.equal(listOptions[2].label);
      });
    });

    describe('Keyboard : up arrow on control', () => {
      beforeEach(async () => {
        // back twice to keep this from passing if the down arrow test fails.
        await multiselection.moveToPreviousOption('button', true);
        await multiselection.moveToPreviousOption('button');
      });

      it('opens the selection menu', expectOpenedMenu);

      it('selects the previous option', () => {
        expect(multiselection.valLabel).to.equal(listOptions[0].label);
      });
    });

    describe('Keyboard: Enter press with open option list', () => {
      beforeEach(async () => {
        await multiselection.pressEnter('input');
      });

      it('closes the list', expectClosedMenu);
    });

    describe('Keyboard: Enter press with closed option list', () => {
      beforeEach(async () => {
        await multiselection.pressEnter('button', true);
      });

      it('opens the list', expectOpenedMenu);
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

            it('closes the option list', expectClosedMenu);

            it('sets the cursored option as the value', () => {
              expect(multiselection.valLabel).to.equal(listOptions[4].label);
            });
          });
        });
      });

      describe('Supplied an \'error\' prop', () => {
        beforeEach(async () => {
          await mountWithContext(
            <MultiSelection
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
          expect(multiselection.inputWarning).to.be.true;
        });

        it('applies \'warning\' style to control', () => {
          expect(multiselection.hasWarningStyle);
        });
      });
    });
  });*/

});
