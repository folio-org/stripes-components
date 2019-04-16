import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import mock from 'jest-mock';
import moment from 'moment';
import faker from 'faker';

import { mountWithContext } from '../../../tests/helpers';
import { AccordionInteractor } from '../../Accordion/tests/interactor';
import MultiColumnListInteractor from '../../MultiColumnList/tests/interactor';

import { NotesAccordion } from '../NotesAccordion';
import NotesAccordionInteractor from './interactor';


describe('NotesAccordion', () => {
  const accordion = new AccordionInteractor();
  const multiColumnList = new MultiColumnListInteractor();
  const notesAccordion = new NotesAccordionInteractor();
  let onCreateHandler;
  let onNoteClick;

  const mountComponent = (props) => {
    return mountWithContext(
      <NotesAccordion
        open={false}
        notes={[]}
        onCreate={onCreateHandler}
        onNoteClick={onNoteClick}
        {...props}
      />
    );
  };

  const generateThreeNotes = () => ([
    {
      id: 'uuid-1',
      title: 'Conversation with Kim White',
      lastSavedDate: faker.date.recent(),
      lastSavedUserFullName: 'Ann Brown',
    },
    {
      id: 'uuid-2',
      title: 'Conversation with Jean Smith',
      lastSavedDate: faker.date.past(),
      lastSavedUserFullName: 'Alice Jones',
    },
    {
      id: 'uuid-3',
      title: 'Conversation with Jim Miles',
      lastSavedDate: faker.date.future(),
      lastSavedUserFullName: 'Kate Swan',
    }
  ]);

  beforeEach(async () => {
    onCreateHandler = mock.fn();
    onNoteClick = mock.fn();

    await mountComponent();
  });

  it('should render accordion', () => {
    expect(notesAccordion.exists).to.be.true;
  });

  describe('handles open/close', () => {
    describe('when open prop is provided as true', () => {
      beforeEach(async () => {
        await mountComponent({ open: true });
      });

      it('should render expanded accordion', () => {
        expect(accordion.isOpen).to.be.true;
      });
    });

    describe('when open prop is provided as false', () => {
      beforeEach(async () => {
        await mountComponent();
      });

      it('should render collapsed accordion', () => {
        expect(accordion.isOpen).to.be.false;
      });
    });
  });

  describe('when accordion is collapsed', () => {
    it('should render header', () => {
      expect(notesAccordion.hasAccordionHeader).to.be.true;
    });

    describe('and there is no notes', () => {
      it('should display notes quantity equal to 0', () => {
        expect(notesAccordion.quantityIndicator).to.equal('0');
      });
    });

    describe('and there are 3 notes', () => {
      beforeEach(async () => {
        await mountComponent({
          notes: generateThreeNotes(),
        });
      });

      it('should display notes quantity equal to 3', () => {
        expect(notesAccordion.quantityIndicator).to.equal('3');
      });
    });
  });

  describe('when accordion is expanded', () => {
    beforeEach(async () => {
      await mountComponent({ open: true });
    });

    it('should render header', () => {
      expect(notesAccordion.hasAccordionHeader).to.be.true;
    });

    it('should render "Add" button', () => {
      expect(notesAccordion.hasAddButton).to.be.true;
    });

    it('should render "New" note button', () => {
      expect(notesAccordion.hasNewButton).to.be.true;
    });

    describe('after click on "New" button', () => {
      beforeEach(async () => {
        await notesAccordion.clickOnNewButton();
      });

      it('should call once passed callback', () => {
        expect(onCreateHandler.mock.calls.length).to.equal(1);
      });
    });

    describe('and there is no notes', () => {
      it('should render message indicating empty notes list', () => {
        expect(multiColumnList.displaysEmptyMessage).to.be.true;
      });
    });

    describe('and there are 3 notes', () => {
      beforeEach(async () => {
        await mountComponent({
          notes: generateThreeNotes(),
        });
      });

      it('should render 3 notes', () => {
        expect(multiColumnList.rowCount).to.equal(3);
      });

      it('should render note titles', () => {
        expect(multiColumnList.rows(0).cells(2).content).to.equal('Conversation with Kim White');
        expect(multiColumnList.rows(1).cells(2).content).to.equal('Conversation with Jean Smith');
        expect(multiColumnList.rows(2).cells(2).content).to.equal('Conversation with Jim Miles');
      });

      it('should render note last saved dates', () => {
        expect(moment(multiColumnList.rows(0).cells(0).content).isValid()).to.be.true;
        expect(moment(multiColumnList.rows(0).cells(0).content).isValid()).to.be.true;
        expect(moment(multiColumnList.rows(0).cells(0).content).isValid()).to.be.true;
      });

      it('should render note last updated user full names', () => {
        expect(multiColumnList.rows(0).cells(1).content).to.equal('Ann Brown');
        expect(multiColumnList.rows(1).cells(1).content).to.equal('Alice Jones');
        expect(multiColumnList.rows(2).cells(1).content).to.equal('Kate Swan');
      });

      describe('after click on second note', () => {
        beforeEach(async () => {
          await multiColumnList.rows(1).click();
        });

        it('should raise second note id', () => {
          expect(onNoteClick.mock.calls[0][0]).to.equal('uuid-2');
        });
      });
    });
  });
});
