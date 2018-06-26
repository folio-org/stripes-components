import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Field } from 'redux-form';

import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import Selection from '../Selection';

import SelectInteractor from './interactor';

describe('Single Select with redux-form', () => {
  describe('Selection, Single select', () => {
    const selection = new SelectInteractor();

    const expectClosedMenu = () => {
      expect(selection.expandedAttribute).to.equal('false');
      expect(selection.listHidden).to.be.true;
    };

    const expectOpenedMenu = () => {
      expect(selection.expandedAttribute).to.equal('true');
      expect(selection.listHidden).to.be.false;
    };

    const listOptions = [
      { value: 'test0', label: 'Option 0' },
      { value: 'test1', label: 'Option 1' },
      { value: 'test2', label: 'Option 2' },
      { value: 'sample0', label: 'Sample 0' },
      { value: 'invalid', label: 'Sample 1' },
      { value: 'warning', label: 'Sample 2' }
    ];

    const testId = 'testingId';

    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="testField"
            component={Selection}
            id={testId}
            dataOptions={listOptions}
          />
        </TestForm>
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

    it('list is hidden by default', () => {
      expect(selection.listHidden).to.be.true;
    });

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
          <TestForm>
            <Field
              component={Selection}
              id={testId}
              name="testField"
              dataOptions={listOptions}
              label="test selection"
            />
          </TestForm>
        );
      });

      it('renders the label', () => {
        expect(selection.labelRendered).to.be.true;
      });

      it('containing the supplied label string', () => {
        expect(selection.label).to.equal('test selection');
      });

      it('control\'s aria-labelledBy attribute is set', () => {
        expect(selection.ariaLabelledBy).to.equal(`sl-label-${testId} selected-${testId}-item `);
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

      it('filter input is rendered with "listbox" role', () => {
        expect(selection.filterRole).to.equal('listbox');
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

        describe('clicking a filtered option', () => {
          beforeEach(async () => {
            await selection.clickOption(3);
          });

          it('sets the value appropriately', () => {
            expect(selection.valLabel).to.equal(`${listOptions[5].label}`);
          });
        });
      });
    });

    describe('Selection, initial value', () => {
      beforeEach(async () => {
        await mountWithContext(
          <TestForm initialValues={{ testField: listOptions[1].value }}>
            <Field
              name="testField"
              component={Selection}
              dataOptions={listOptions}
            />
          </TestForm>
        );
      });

      it("renders the appropriate option's label", () => {
        expect(selection.valLabel).to.equal(listOptions[1].label);
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

        describe('Error validation', () => {
          beforeEach(async () => {
            await mountWithContext(
              <TestForm>
                <Field
                  name="testField"
                  component={Selection}
                  dataOptions={listOptions}
                  validate={(value) => (value === 'invalid' ? 'Selection is invalid!' : undefined)}
                />
              </TestForm>
            );
          });

          describe('Selecting an erroneous value', () => {
            beforeEach(async () => {
              await selection.expandAndClick(5);
            });

            it('renders a validation error message', () => {
              expect(selection.inputError).to.be.true;
            });

            it('applies error style to control', () => {
              expect(selection.hasErrorStyle);
            });
          });
        });

        describe('Warning validation', () => {
          beforeEach(async () => {
            await mountWithContext(
              <TestForm>
                <Field
                  name="testField"
                  component={Selection}
                  dataOptions={listOptions}
                  warn={(value) => (value === 'warning' ? 'You might want to choose something different!' : undefined)}
                />
              </TestForm>
            );
          });

          describe('Selecting a suspicious, warn-worthy value', () => {
            beforeEach(async () => {
              await selection.expandAndClick(6);
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
  });
});

