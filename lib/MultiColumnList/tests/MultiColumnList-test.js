import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { Interactor } from '@bigtest/interactor';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import MultiColumnList from '../MultiColumnList';
import MCLHarness from './MCLHarness';
import MultiColumnListInteractor from './interactor';

import generate from './generate';

const data = generate(10);
const data3 = generate(3);
const data100 = generate(100);

let scrolled = false;
let moreRequested = false;

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

  describe('interaction with a non-virtualized list', () => {
    beforeEach(async () => {
      scrolled = false;
      moreRequested = false;
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            onScroll={() => { scrolled = true; }}
            contentData={data100}
            onNeedMoreData={() => { moreRequested = true; }}
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
        expect(scrolled).to.be.true;
      });
    });

    describe('scrolling the list more', () => {
      beforeEach(async () => {
        await mcl.scrollBody(2500);
      });

      it('calls the supplied onNeedMoreData handler', () => {
        expect(moreRequested).to.be.true;
      });
    });
  });

  describe('rendering with virtualization', () => {
    beforeEach(async () => {
      scrolled = false;
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList onScroll={() => { scrolled = true; }} contentData={data100} autosize virtualize />
        </div>
      );
    });

    it('only renders a portion of the content', () => {
      expect(mcl.rowCount).not.to.equal(data100.length);
    });

    describe('scrolling the MCL', () => {
      let firstRow;
      let lastRow;
      beforeEach(async () => {
        firstRow = 0;
        lastRow = mcl.rowCount - 1;
        await mcl.scrollBody(200);
      });

      it('calls the onScroll handler', () => {
        expect(scrolled).to.be.true;
      });

      it('updates the top positioning of the rowContainer', () => {
        expect(mcl.scrollBodyTop).to.not.equal(0);
      });

      it('still only renders a portion of the content', () => {
        expect(mcl.rowCount).not.to.equal(data100.length);
      });

      it('advances the rendered slice of rows', () => {
        const dataKeys = Object.keys(data100[0]);
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

  describe('rendering with empty starting data', () => {
    beforeEach(async () => {
      await mountWithContext(<MCLHarness key="0" initialData={[]} />);
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
          await mcl.rows(2).click();
        });

        it('applies the selected class', () => {
          expect(mcl.rows(2).isSelected).to.be.true;
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

  describe('starting with small initial amount of data', () => {
    beforeEach(async () => {
      scrolled = false;
      await mountWithContext(
        <MCLHarness
          key="1"
          initialData={data3}
          onScroll={() => { scrolled = true; }}
        />
      );
    });

    it('fills data as necessary', () => {
      expect(mcl.rowCount).to.be.above(3);
    });

    describe('scrolling the list', () => {
      beforeEach(async () => {
        scrolled = false;
        await mcl.scrollBody(1000);
        await mcl.scrollBody(1000);
      });

      it('calls the onScroll handler', () => {
        expect(scrolled).to.be.true;
      });

      describe('changing number of columns 3 to 2', () => {
        beforeEach(async () => {
          await clicker.click('[data-test-two-columns]');
        });

        it('renders only 2 columns', () => {
          expect(mcl.rows(0).cellCount).to.equal(2);
        });

        describe('changing the height prop', () => {
          beforeEach(async () => {
            await clicker.click('[data-test-800-height]');
          });

          it('changes the height of the grid', () => {
            expect(mcl.containerHeight).to.equal(800);
          });
        });
      });
    });
  });
});
