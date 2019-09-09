import React from 'react';
import { describe, beforeEach, before, it } from '@bigtest/mocha';
import { Interactor } from '@bigtest/interactor';
import sinon from 'sinon';

import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import MultiColumnList from '../MultiColumnList';
import { dataChangedOrLess } from '../MCLRenderer';
import MCLHarness from './MCLHarness';
import DimensionCache from '../DimensionCache';
import MultiColumnListInteractor from './interactor';
import * as handlers from '../defaultHandlers';
import convertToPixels from '../convertToPixels';

import generate from './generate';

const data = generate(10);
const data3 = generate(3);
const data100 = generate(100);

let headerClicked = false;

describe('MultiColumnList', () => {
  const mcl = new MultiColumnListInteractor();
  const clicker = new Interactor();

  describe('Basic data rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList contentData={data} />
      );
    });

    it('renders the container', () => {
      expect(mcl.containerPresent).to.be.true;
    });

    it('renders the correct number of headers', () => {
      expect(mcl.columnCount).to.equal(Object.keys(data[0]).length);
    });

    it('renders the correct number of rows', () => {
      expect(mcl.rowCount).to.equal(data.length);
    });

    it('each row renders the correct number of columns', () => {
      let correctNumber;
      data.forEach((d, i) => {
        const cellNumber = mcl.rows(i).cellCount;
        if (cellNumber !== Object.keys(data[i]).length) {
          correctNumber = false;
        }
        // console.log(`checking row ${i}`);
      });
      expect(correctNumber).to.not.be.false;
    });

    it('renders the proper content in each row', () => {
      let correctData;
      data.forEach((d, n) => {
        // console.log(`data ${n}: ${JSON.stringify(d)}`);
        const rendered = [];
        for (let j = 0; j < mcl.rows(n).cellCount; j++) {
          if (mcl.rows(n).cells(j).content !== d[Object.keys(d)[j]]) {
            correctData = false;
            rendered.push(mcl.rows(n).cells(j).content);
          }
        }
        // console.log(`row ${n}: ${rendered.join(', ')}`);
      });
      expect(correctData).to.not.be.false;
    });
  });

  describe('rendering with columnWidths prop', () => {
    const testWidths = {
      name: '100px',
      email: '150px',
      phone: '200px'
    };
    beforeEach(async () => {
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            contentData={data}
            columnWidths={testWidths}
            visibleColumns={['name', 'email', 'phone']}
          />
        </div>
      );
    });

    it('renders columns with requested Width', () => {
      const colKeys = Object.keys(testWidths);
      let matches;
      colKeys.forEach((n, i) => {
        // console.log(`${n} column width: ${mcl.rows(0).cells(i).width}`);
        if (mcl.rows(0).cells(i).width !== parseInt(testWidths[n], 10)) {
          matches = false;
        }
      });
      expect(matches).to.not.be.false;
    });
  });

  describe('rendering with autosize prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList contentData={data} autosize />
        </div>
      );
    });

    it('renders main container with width of parent', () => {
      expect(mcl.containerWidth).to.equal(600);
    });

    it('renders main container with height of parent', () => {
      expect(mcl.containerHeight).to.equal(300);
    });
  });

  describe('data change from sorting', () => {
    const data5 = generate(5);
    const dataName = data5[0].name;
    beforeEach(async () => {
      await mountWithContext(<MCLHarness initialData={data5} onNeedMoreData={null} />);
    });

    it('renders rows with the same count', () => {
      expect(mcl.rowCount).to.equal(5);
    });

    it('renders data in appropriate cell', () => {
      expect(mcl.rows(0).cells(0).text).to.equal(dataName);
    });

    it('measures columns', () => {
      expect(mcl.rows(0).cells(0).style.width).to.not.equal('');
    });

    describe('clicking a header (sorting)', () => {
      beforeEach(async () => {
        await mcl.headers(0).click();
      });

      it('renders rows with the same count', () => {
        expect(mcl.rowCount).to.equal(5);
      });

      it('renders data in appropriate cell', () => {
        expect(mcl.rows(1).cells(0).text).to.equal(dataName);
      });
    });
  });

  describe('interaction with a non-virtualized list', () => {
    let handleScroll;
    let requestMore;
    before(async () => {
      handleScroll = sinon.fake();
      requestMore = sinon.fake();
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            onScroll={handleScroll}
            contentData={data100}
            onNeedMoreData={requestMore}
            autosize
          />
        </div>
      );
    });

    describe('scrolling the list', () => {
      beforeEach(async () => {
        await mcl.scrollBody(200);
      });

      it('calls the supplied onScroll handler', () => {
        expect(handleScroll.called).to.be.true;
      });
    });

    describe('scrolling the list more', () => {
      beforeEach(async () => {
        await mcl.scrollBody(2500);
      });

      it('expects loaderRow to be present', () => {
        expect(mcl.loaderPresent).to.be.true;
      });

      it('calls the supplied onNeedMoreData handler', () => {
        expect(requestMore.called).to.be.true;
      });
    });
  });

  describe('rendering with a maximum height', () => {
    const maxHeightData = [
      { name: 'james' },
      { name: 'philip' }
    ];
    const maxHeight = 400;
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList contentData={maxHeightData} maxHeight={maxHeight} />
      );
    });

    it('container height is less than the maxHeight', () => {
      expect(mcl.scrollBodyHeight).to.be.lessThan(maxHeight);
    });
  });

  describe('rendering with virtualization', () => {
    let handleScroll;
    beforeEach(async () => {
      handleScroll = sinon.fake();
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList onScroll={handleScroll} contentData={data100} autosize virtualize />
        </div>
      );
    });

    it('only renders a portion of the content', () => {
      expect(mcl.rowCount).not.to.equal(data100.length);
    });

    describe('scrolling the MCL', () => {
      beforeEach(async () => {
        await mcl.scrollBody(200);
      });

      it('calls the onScroll handler', () => {
        expect(handleScroll.called).to.be.true;
      });

      it('still only renders a portion of the content', () => {
        expect(mcl.rowCount).not.to.equal(data100.length);
      });

      it('advances the rendered slice of rows', () => {
        const dataKeys = Object.keys(data100[0]);
        let firstRow;
        let lastRow;
        let lastMatched = 0;
        data100.some((d, i) => {
          let matching = false;
          for (let k = 0; k < dataKeys.length; k++) {
            if (data100[i][dataKeys[k]] === mcl.rows(0).cells(k).content) {
              matching = true;
              firstRow = i;
            }
          }
          return matching;
        });
        // console.log(`firstRow dataIndex: ${firstRow}`);

        data100.some((d, l) => {
          let matchingLast = false;
          for (let m = 0; m < dataKeys.length; m++) {
            if (data100[l][dataKeys[m]] === mcl.rows(lastRow).cells(m).content) {
              matchingLast = true;
              lastMatched = l;
            }
          }
          return matchingLast;
        });

        // console.log(`lastRow dataIndex: ${lastMatched}`);

        expect(firstRow).to.not.equal(0);
        expect(lastMatched).to.not.equal(mcl.rowCount - 1);
      });
    });
  });

  describe('rendering with a hidden grid', () => {
    beforeEach(async () => {
      await mountWithContext(<MCLHarness key="0" autosize={false} displayGrid={false} initialData={data100} />);
    });

    it('mclContainer is not visible', () => {
      expect(mcl.containerVisible).to.be.false;
    });

    it('rowMeasurers are present', () => {
      expect(mcl.rowMeasurers().length).to.not.equal(0);
    });

    it('cells are not measured', () => {
      expect(mcl.rows(2).cells(0).style.width).to.equal('');
    });

    describe('revealing the grid', () => {
      beforeEach(async () => {
        await clicker.click('[data-test-display-grid]');
      });

      it('mclContainer is visible', () => {
        expect(mcl.containerVisible).to.be.true;
      });

      it('cells are measured', () => {
        expect(mcl.rows(2).cells(0).style.width).to.not.equal('');
      });
    });
  });

  describe('rendering with empty starting data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          key="1"
          initialData={[]}
          columnWidths={{ 'name': '200px' }}
        />
      );
    });

    it('displays empty message', () => {
      expect(mcl.displaysEmptyMessage).to.be.true;
    });

    describe('receiving data', () => {
      beforeEach(async () => {
        await clicker.click('[data-test-load]');
      });

      it('no longer displays the empty message', () => {
        expect(mcl.displaysEmptyMessage).to.be.false;
      });

      it('displays data rows', () => {
        expect(mcl.rowCount).to.be.gt(0);
      });

      describe('selecting a row', () => {
        beforeEach(async () => {
          mcl.columnsMeasured();
          await mcl.rows(2).click();
        });

        it('applies the selected class', () => {
          expect(mcl.rows(2).isSelected).to.be.true;
        });

        describe('adjusting to width change', () => {
          beforeEach(async () => {
            await mcl.scrollBody(500);
          });

          describe('selecting another', () => {
            beforeEach(async () => {
              await mcl.rows(11).click();
            });

            it('applies the updated selection', () => {
              expect(mcl.rows(11).isSelected).to.be.true;
            });
          });
        });
      });
    });
  });

  describe('using formatter prop', () => {
    const visibleCol = [
      'name',
      'email',
      'identity',
    ];

    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          initialData={[]}
          visibleColumns={visibleCol}
          formatter={
            {
              identity: (item) => (
                <React.Fragment>
                  <div data-test-username>{item.userName}</div>
                  <div data-test-date-joined style={{ backgroundColor: 'grey' }}>
                    {`since ${item.joinDate}`}
                  </div>
                </React.Fragment>
              )
            }
          }
        />
      );
    });

    it('displays empty message', () => {
      expect(mcl.displaysEmptyMessage).to.be.true;
    });

    describe('receiving data', () => {
      beforeEach(async () => {
        await clicker.click('[data-test-load]');
      });

      it('no longer displays the empty message', () => {
        expect(mcl.displaysEmptyMessage).to.be.false;
      });

      it('displays correct number of columns', () => {
        expect(mcl.rows(0).cellCount).to.be.gt(0);
      });

      it('displays data rows', () => {
        expect(mcl.rows(0).cellCount).to.equal(visibleCol.length);
      });

      it('renders the formatter', () => {
        expect(mcl.contains('[data-test-date-joined]')).to.be.true;
      });
    });
  });

  describe('using a custom row formatter', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          rowFormatter={({ rowIndex, rowClass, cells, rowProps }) => (
            <a key={`row-${rowIndex}`} className={rowClass} {...rowProps}>
              {cells}
            </a>
          )}
        />
      );
    });

    it('renders custom formatter (rows as anchors)', () => {
      expect(mcl.rows(0).isAnchor).to.be.true;
    });
  });

  describe('using the "onHeaderClick" prop ', () => {
    beforeEach(async () => {
      headerClicked = false;
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          onHeaderClick={() => { headerClicked = true; }}
        />
      );
    });

    it('renders appropriate headers', () => {
      expect(mcl.headers().length).to.be.greaterThan(0);
    });

    describe('clicking a header', () => {
      beforeEach(async () => {
        headerClicked = false;
        await mcl.headers(0).click();
      });

      it('calls the onHeaderClick handler', () => {
        expect(headerClicked).to.be.true;
      });
    });
  });

  describe('starting with small initial amount of data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          key="smallInitialData"
          initialData={data3}
        />
      );
    });

    it('fills data as necessary', () => {
      expect(mcl.rowCount).to.be.above(3);
    });
  });

  describe('changing the number of columns', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          key="columnChanges"
          initialData={data100}
        />
      );
    });

    describe('changing number of columns 3 to 2', () => {
      beforeEach(async () => {
        await clicker.click('[data-test-two-columns]');
      });

      it('renders only 2 columns', () => {
        expect(mcl.rows(0).cellCount).to.equal(2);
      });
    });
  });

  describe('handling height prop changes', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          key="heightChanges"
          initialData={data100}
        />
      );
    });

    it('renders the MCL', () => {
      expect(mcl.containerPresent).to.be.true;
    });

    describe('invoking a height change', () => {
      beforeEach(async () => {
        await clicker.click('[data-test-800-height]');
      });

      it('changes the height of the grid', () => {
        expect(mcl.containerHeight).to.equal(800);
      });
    });
  });

  describe('detecting data changes', () => {
    let currentData;
    let nextData;

    beforeEach(() => {
      currentData = null;
      nextData = null;
    });

    describe('data fully changed', () => {
      it('data change detected', () => {
        currentData = generate(4);
        nextData = generate(4);
        expect(dataChangedOrLess(currentData, nextData)).to.be.true;
      });
    });

    describe('growing data - paging', () => {
      it('data items did not change', () => {
        currentData = generate(5);
        nextData = [...currentData, ...generate(5)];
        expect(dataChangedOrLess(currentData, nextData)).to.be.false;
      });
    });

    describe('updated data - reordered sub-arrays', () => {
      it('data items did not change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: ['north'] },
        ];
        nextData = [
          { name: 'james', servicePoints: ['south', 'north', 'west', 'east'] },
          { name: 'phil', servicePoints: ['north'] },
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.false;
      });
    });

    describe('updated data - changed sub-arrays', () => {
      it('data items did change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: ['north'] },
        ];
        nextData = [
          { name: 'james', servicePoints: ['south', 'north', 'east'] },
          { name: 'phil', servicePoints: ['north'] },
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.true;
      });
    });

    describe('updated data - changed data field', () => {
      it('data items did change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: ['north'] },
        ];
        nextData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'randy', servicePoints: ['east'] },
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.true;
      });
    });

    describe('updated data - compare arrays of 0 length', () => {
      it('data items did not change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: [] },
        ];
        nextData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: [] },
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.false;
      });
    });

    describe('updated data - changed type of array item', () => {
      it('data items did change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: [] },
        ];
        nextData = [
          'phil',
          'james'
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.true;
      });
    });

    describe('updated data - smaller incoming array', () => {
      it('data items did change', () => {
        currentData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: [] },
          { name: 'robert', servicePoints: ['north'] },
        ];
        nextData = [
          { name: 'james', servicePoints: ['north', 'south', 'east', 'west'] },
          { name: 'phil', servicePoints: [] },
        ];
        expect(dataChangedOrLess(currentData, nextData)).to.be.true;
      });
    });
  });

  describe('dimension cache', () => {
    let cache;
    before(() => {
      cache = new DimensionCache(24, 0, 0);
    });

    it('has a fillValue of 24', () => {
      expect(cache.fillerItem).to.equal(24);
    });

    it('has a base accumulation index of 0', () => {
      expect(cache.baseAccumIndex).to.equal(0);
    });

    describe('requesting a value that isn\'t fulfilled yet with a callback', () => {
      let res;
      const cb = (v) => { res = v; };
      before(() => {
        res = cache.request(4, cb);
      });

      it('returns null', () => {
        expect(res).to.be.null;
      });

      it('stores the request callback', () => {
        expect(cache.requests[4]).to.equal(cb);
      });
    });

    describe('requesting a value that isn\'t fulfilled yet without a callback', () => {
      let res;
      before(() => {
        res = cache.request(5);
      });

      it('returns null', () => {
        expect(res).to.be.null;
      });
    });

    describe('requesting an accumulated value without a callback', () => {
      let res;
      before(() => {
        res = cache.requestAccumulated(4);
      });

      it('values before the requested index are empty', () => {
        let empty = true;
        for (let n = 0; n < 4; n += 1) {
          if (cache.cache[n]) {
            empty = false;
          }
        }
        expect(empty).to.be.true;
      });

      it('returns an estimated accumulation value', () => {
        expect(res).to.equal(96);
      });
    });

    describe('requesting an accumulation value with a callback', () => {
      let res;
      let setRes = (obj) => { res = obj; };
      before(() => {
        cache.requestAccumulated(2, setRes);
      });

      it('values before the requested index are empty', () => {
        let empty = true;
        for (let n = 0; n < 2; n += 1) {
          if (cache.cache[n]) {
            empty = false;
          }
        }
        expect(empty).to.be.true;
      });

      it('returns an object with a estimated value and an estimate status', () => {
        const expected = { result: 48, estimate: true };
        expect(res).to.deep.equal(expected);
      });

      describe('filling out the values of the cache', () => {
        before(() => {
          cache.set(0, 42);
          cache.set(1, 24);
        });

        it('values are stored in the cache', () => {
          let empty = false;
          for (let n = 0; n < 2; n += 1) {
            if (!cache.cache[n]) {
              empty = true;
            }
          }
          expect(empty).to.be.false;
        });

        it('calls the accumulated request callback and returns a non-estimated value', () => {
          const expected = { result: 66, estimate: false };
          expect(res).to.deep.equal(expected);
        });

        describe('changing the base of the cache', () => {
          before(() => {
            cache.rebase(3, 96);
          });

          it('sets base accumulation index to 3', () => {
            expect(cache.baseAccumIndex).to.equal(3);
          });

          it('empties the cached values', () => {
            expect(Object.keys(cache.cache).length).to.equal(0);
          });

          describe('requesting index at a position', () => {
            before(() => {
              res = null;
              res = cache.getIndexByPosition(55);
            });

            it('returns a value', () => {
              expect(res).to.equal(2);
            });

            describe('requesting a smaller accumulation index than the base', () => {
              before(() => {
                res = null;
                setRes = (obj) => { res = obj; };
                cache.requestAccumulated(2, setRes);
              });

              it('calls the callback and returns an object with a result value and estimate status', () => {
                const expected = { result: 72, estimate: true };
                expect(res).to.deep.equal(expected);
              });
            });
          });
        });
      });
    });

    describe('setting a value', () => {
      before(() => {
        cache.set(4, 42);
      });
    });
  });

  describe('MCL event handlers functions', () => {
    const container = { focus: sinon.fake() };
    const e = { target: {} };
    let selectHandler;
    before(() => {
      container.focus = sinon.fake();
      selectHandler = sinon.fake();
      handlers.unfocusRow(2, container);
      handlers.selectNextRow(e, 2, selectHandler, data100);
    });

    it('expects container focus to be called', () => {
      expect(container.focus.called).to.be.true;
    });

    it('expects selectHandler to be passed event and data item', () => {
      expect(selectHandler.calledWith(e, data100[3])).to.be.true;
    });

    describe('unfocusRow called with null focusRow parameter', () => {
      before(() => {
        container.focus = sinon.fake();
        handlers.unfocusRow(null, container);
      });

      it('container.focus() should not be called', () => {
        expect(container.focus.called).to.be.false;
      });
    });

    describe('mcl selectPreviousRow handler', () => {
      before(() => {
        handlers.selectPreviousRow(e, 3, selectHandler, data100);
      });

      it('expects selectHandler to be called with an event and a data item', () => {
        expect(selectHandler.calledWith(e, data100[2])).to.be.true;
      });

      describe('mcl select handlers called with indices at extents', () => {
        before(() => {
          selectHandler = sinon.fake();
          handlers.selectPreviousRow(e, 0, selectHandler, data100);
          handlers.selectNextRow(e, 99, selectHandler, data100);
        });

        it('expects selectHandler to not be called', () => {
          expect(selectHandler.called).to.be.false;
        });
      });
    });
  });

  describe('pixel conversion of css values', () => {
    let rem;
    let percent;
    let px;
    let num;
    const width = 200;
    beforeEach(() => {
      rem = '1rem';
      percent = '50%';
      px = '35px';
      num = '75';
    });

    it('converts rem', () => {
      expect(convertToPixels(rem, width)).to.equal(14);
    });

    it('converts percent', () => {
      expect(convertToPixels(percent, width)).to.equal(100);
    });

    it('converts px', () => {
      expect(convertToPixels(px, width)).to.equal(35);
    });

    it('converts a number to percent', () => {
      expect(convertToPixels(num, width)).to.equal(150);
    });
  });
});
