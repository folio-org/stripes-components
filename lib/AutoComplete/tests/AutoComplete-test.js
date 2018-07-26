import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mountWithContext } from '../../../tests/helpers';
import AutoComplete from '../AutoComplete';
import AutoCompleteInteractor from './interactor';

describe('AutoComplete', () => {
  const autoComplete = new AutoCompleteInteractor();
  const items = [{ value: 'location1' }, { value: 'location2' }, { value: 'location3' }, { value: 'maps' }];
  const expectedItems = ['location1', 'location2', 'location3'];
  const id = 'AutoComplete-test';
  const label = 'AutoComplete-label';

  describe('rendering autoComplete with id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete id={id} items={items} />
      );
    });

    it(`renders with an id of "${id}"`, () => {
      expect(autoComplete.textfield.id).to.equal('AutoComplete-test');
    });
  });

  describe('rendering autoComplete with label', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete label={label} items={items} />
      );
    });

    it(`renders with a label of "${label}"`, () => {
      expect(autoComplete.textfield.label).to.equal('AutoComplete-label');
    });
  });

  describe('renders AutoComplete with list', () => {
    const onBlur = e => e.preventDefault();

    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete onBlur={onBlur} items={items} />
      );
    });

    describe('Fill and blur the input', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillAndBlur('loc');
      });

      it('has the list closed', () => {
        expect(autoComplete.isListOpen).to.be.false;
      });
    });

    describe('Fill the input', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillInput('loc');
      });

      it('has the list open', () => {
        expect(autoComplete.isListOpen).to.be.true;
      });

      describe('Click an option from the list', () => {
        beforeEach(async () => {
          await autoComplete.clickOption(2);
        });

        it(`sets control value to ${items[1].value}`, () => {
          expect(autoComplete.textfield.val).to.equal(`${items[1].value}`);
        });
      });
    });
  });

  describe('rendering autoComplete items list', () => {
    const onBlur = e => e.preventDefault();

    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete onBlur={onBlur} items={items} />
      );

      await autoComplete.textfield.fillInput('l');
    });

    it('renders with a list of 3 items', () => {
      expect(autoComplete.options().length).to.equal(3);
    });

    it('renders with a list of expected items', () => {
      expect(autoComplete.items()).to.deep.equal(expectedItems);
    });
  });

  describe('renders AutoComplete with Error', () => {
    const error = 'please fill in to continue';
    const onBlur = e => e.preventDefault();

    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete onBlur={onBlur} error={error} validationEnabled items={items} />
      );
    });

    describe('Fill and blur with empty string', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillAndBlur('');
      });

      it('renders an error message', () => {
        expect(autoComplete.textfield.inputError).to.be.true;
      });
    });
  });

  describe('Keyboard : down arrow on control', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete items={items} />
      );
    });

    describe('fill input', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillInput('l');
      });

      describe('keyboard down', () => {
        beforeEach(async () => {
          await autoComplete.moveToNextOption('li', true);
        });

        it('selects the first list item', () => {
          expect(autoComplete.liValue).to.equal(expectedItems[0]);
        });
      });
    });
  });

  describe('Keyboard : up arrow on control', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete items={items} />
      );
    });

    describe('fill input', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillInput('l');
      });

      describe('keyboard up', () => {
        beforeEach(async () => {
          await autoComplete.moveToNextOption('li', true);
          await autoComplete.moveToNextOption('li', true);
          await autoComplete.moveToPreviousOption('li', true);
        });

        it('selects the first list item', () => {
          expect(autoComplete.liValue).to.equal(expectedItems[0]);
        });
      });
    });
  });

  describe('Keyboard: Enter press', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoComplete items={items} />
      );
    });

    describe('fill input', () => {
      beforeEach(async () => {
        await autoComplete.textfield.fillInput('l');
      });

      describe('keyboard enter', () => {
        beforeEach(async () => {
          await autoComplete.moveToNextOption('li', true);
          await autoComplete.pressEnter('li', true);
        });

        it('selects the first list item', () => {
          expect(autoComplete.textfield.val).to.equal('l');
        });
      });
    });
  });
});
