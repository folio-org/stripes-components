import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';

import SortableList from '../SortableList';
import SortableListInteractor from './interactor';

describe('SortableList', () => {
  const sortableList = new SortableListInteractor();
  const onDragEndFake = sinon.fake();
  const onDragStartFake = sinon.fake();
  const onDragUpdateFake = sinon.fake();
  
  beforeEach(async () => {
    await mountWithContext(
      <>
        <div id="ModuleContainer"></div>
        <SortableList
          onDragEnd={onDragEndFake}
          onDragStart={onDragStartFake}
          onDragUpdate={onDragUpdateFake}
          contentData={[
            {
              id: '0',
              index: 0,
            },
            {
              id: '1',
              index: 1,
            }
          ]}
        />
      </>
    );

    onDragEndFake.resetHistory();
    onDragStartFake.resetHistory();
    onDragUpdateFake.resetHistory();
  });

  it('should render correct number of rows', () => {
    expect(sortableList.rows().length).to.equal(2);
  });

  describe('when lifting a row', () => {
    beforeEach(async () => {
      await sortableList.liftRow();
    });

    it('should call onDragStart', () => {
      expect(onDragStartFake.calledOnce).to.be.true;
    });

    describe('when moving a row', () => {
      beforeEach(async () => {
        await sortableList.moveRowUp();
      });

      it('should call onDragUpdate', () => {
        expect(onDragUpdateFake.called).to.be.true;
      });

      describe('when dropping a row', () => {
        beforeEach(async () => {
          await sortableList.dropRow();
        });

        it('should call onDragEnd', () => {
          expect(onDragEndFake.calledOnce).to.be.true;
        });
      });
    });
  });
});
