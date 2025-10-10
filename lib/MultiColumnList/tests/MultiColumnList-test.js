import React from 'react';
import { StaticRouter } from 'react-router';
import { describe, beforeEach, before, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import faker from 'faker';
import {
  MultiColumnList as Interactor,
  MultiColumnListCell as CellInteractor,
  MultiColumnListRow as RowInteractor,
  Button as ButtonInteractor,
  HTML as HTMLInteractor,
  runAxeTest,
  Button,
  including,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import MultiColumnList from '../MultiColumnList';
import { dataChangedOrLess, hasVerticalScrollbar } from '../MCLRenderer';
import MCLHarness from './MCLHarness';
import DimensionCache from '../DimensionCache';
import * as handlers from '../defaultHandlers';
import convertToPixels from '../convertToPixels';
import PrevNextPagingOffset from '../stories/PrevNextOffsetPaging';
import { generate, sparseGenerate } from './generate';

const generator = () => (
  {
    status: faker.random.boolean() ? 'true' : 'false',
    id: faker.random.number(),
    orderer: faker.random.words(3),
    sender: faker.random.words(3),
  }
);

const data = generate(10);
const data3 = generate(3);
const data5 = generate(5);
const data100 = generate(100);
const sparseData = sparseGenerate(30, 30, generator);
const bigWidthData = generate(30, generator);
const bigWidthLongData = generate(100, generator);

const columnCount = (dataSet) => Object.keys(dataSet[0]).length;
const rowCount = (dataSet) => dataSet.length;
const value = (dataSet, [x, y]) => Object.values(dataSet[x])[y];
const xyRange = (dataSet) => (
  [...Array(rowCount(dataSet))].flatMap((x, i) => (
    [...Array(columnCount(dataSet))].map((y, j) => [i, j])
  ))
);
const headings = (dataSet) => Object.keys(dataSet[0]);

const cumulativeCellWidth = async (mcl) => {
  let nColumns = 0;
  await mcl.perform(el => { nColumns = el.querySelectorAll(['[class*=mclHeader-]']).length; });

  const widths = await Promise.all([...Array(nColumns)].map(async (_, i) => {
    let width = 0;
    await mcl.find(CellInteractor({ row: 0, columnIndex: i })).perform(el => { width = el.offsetWidth; });
    return width;
  }));

  return widths.reduce((sum, width) => sum + width, 0);
};

// custom bigtest matcher - we may need to move this to a utility file if they accumulate.

function withClientTop(comparator) {
  return {
    match(actual) {
      return comparator(actual.getBoundingClientRect().top);
    },
    description() {
      return `clientTop comparison: ${comparator}`;
    }
  };
}

const tabIndexedElement = HTMLInteractor.extend('tab-indexed')
  .filters({
    tabIndex: el => el.tabIndex,
  })

let headerClicked = false;

describe('MultiColumnList', () => {
  const mcl = Interactor();
  const mclRow = RowInteractor();
  describe('column width ranges', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          contentData={bigWidthData}
          columnWidths={{
            status: { min: 24, max: 24 },
            id: { max: 60 },
            orderer: { min: 60, max: 80 },
            sender: { min: 60, max: 80 },
          }}
        />
      );
    });

    it('has no axe errors', runAxeTest);

    it('keeps widths between the specified range', async () => {
      const assertWidthWithin = (w1, w2) => el => expect(el.offsetWidth).to.be.within(w1, w2);

      await mcl.find(CellInteractor({ row: 0, columnIndex: 0 })).perform(assertWidthWithin(24, 24));
      await mcl.find(CellInteractor({ row: 0, columnIndex: 1 })).perform(assertWidthWithin(0, 60));
      await mcl.find(CellInteractor({ row: 0, columnIndex: 2 })).perform(assertWidthWithin(60, 80));
      await mcl.find(CellInteractor({ row: 0, columnIndex: 3 })).perform(assertWidthWithin(60, 80));
    });

    it('adds a tabindex to scroll container since the table contains no focusable elements', () => tabIndexedElement({ tabIndex: 0, className: including('mclScrollable') }).exists());
  });

  describe('Basic data rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList contentData={data} />
      );
    });

    it('has no axe errors', runAxeTest);

    it('renders the container', () => mcl.is({ visible: true }));

    it('renders the correct number of headers', () => mcl.has({ columnCount: columnCount(data) }));

    it('renders the correct number of rows', () => mcl.has({ rowCount: rowCount(data) }));

    it('each row renders the correct number of columns', async () => {
      await mcl.perform(el => el.querySelectorAll('[class*=mclRow-]').forEach(row => {
        expect(row.children.length).to.equal(columnCount(data));
      }));
    });

    it('renders the proper content in each row', () => Promise.all(
      xyRange(data).map(async (xy) => {
        await mcl.find(CellInteractor({ row: xy[0], columnIndex: xy[1] })).perform(el => {
          expect(el.textContent).to.equal(value(data, xy));
        });
      })
    ));

    it('renders the proper content under each header', () => {
      let current = columnCount(data);
      const res = [];
      while (current > -1) {
        current -= 1;
        const headerText = headings(data)[current];
        res.push(CellInteractor({ column: headerText, content: data[0][headerText] }).exists);
      }
      return Promise.all(res);
    });

    it('renders proper content under specific header', () => CellInteractor({ row: 3, column: 'joinDate', content: data[3].joinDate }).exists());
  });

  describe('rendering with columnWidths prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div style={{ height: '300px', width: '600px' }}>
          <MultiColumnList
            contentData={data}
            columnWidths={{
              name: '100px',
              email: '150px',
              phone: '200px'
            }}
            visibleColumns={['name', 'email', 'phone']}
          />
        </div>
      );
    });

    it('has no axe errors', runAxeTest);

    it('renders columns with requested Width', async () => {
      await mcl.find(CellInteractor({ row: 0, columnIndex: 0 })).perform(el => {
        expect(el.offsetWidth).to.equal(100);
      });
      await mcl.find(CellInteractor({ row: 0, columnIndex: 1 })).perform(el => {
        expect(el.offsetWidth).to.equal(150);
      });
      await mcl.find(CellInteractor({ row: 0, columnIndex: 2 })).perform(el => {
        expect(el.offsetWidth).to.be.greaterThan(200);
        expect(el.style.flex).to.equal('1 1 auto');
      });
    });
  });

  describe('rendering with partial columnWidths and no width prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div style={{ height: '300px', width: '400px' }}>
          <MultiColumnList
            contentData={data}
            columnWidths={{ name: '50px', email: '150px' }}
            visibleColumns={['name', 'email', 'joinDate']}
          />
        </div>
      );
    });

    it('container width 400px: row width == sum of column widths', async () => {
      const width = await cumulativeCellWidth(mcl);
      await mcl.perform(el => {
        expect(`${width}px`).to.equal(el.querySelector('[class*=mclRow-]').style.minWidth);
      });
    });

    describe('rendering with partial columnWidths and no width prop', () => {
      beforeEach(async () => {
        await mountWithContext(
          <div style={{ height: '300px', width: '1000px' }}>
            <MultiColumnList
              contentData={data}
              columnWidths={{ name: '50px', email: '150px' }}
              visibleColumns={['name', 'email', 'phone']}
            />
          </div>
        );
      });

      it('container width 1000px: row width == container width', async () => {
        await mcl.perform(el => {
          expect(el.querySelector('[class*=mclRow-]').clientWidth).to.equal(1000);
        });
      });
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

    it('renders main container with width of parent', () => mcl.has({ width: 600 }));

    it('renders main container with height of parent', () => mcl.has({ height: 300 }));
  });

  describe('Percentage widths that sum to 100% ', () => {
    beforeEach(async () => {
      await mountWithContext(
        <div style={{ height: '300px', width: '400px' }}>
          <MultiColumnList
            contentData={data}
            columnWidths={{
              name: '25%',
              email: '25%',
              phone: '25%',
              userName: '25%',
            }}
            visibleColumns={['name', 'email', 'phone', 'userName']}
          />
        </div>
      );
    });

    it('does not cause overflow', async () => {
      expect(await cumulativeCellWidth(mcl)).to.be.at.most(400);
    });
  });

  describe('data change from sorting', () => {
    beforeEach(async () => {
      await mountWithContext(<MCLHarness initialData={data5} onNeedMoreData={null} />);
    });

    it('has no axe errors', runAxeTest);

    it('renders rows with the same count', () => mcl.has({ rowCount: 5 }));

    it('renders data in appropriate cell', async () => {
      await mcl.find(CellInteractor({ row: 0, columnIndex: 0 })).has({ content: data5[0].name });
    });

    it('measures columns', async () => {
      await mcl.find(CellInteractor({ row: 0, columnIndex: 0 })).perform(el => {
        expect(el.style.width).to.not.equal('');
      });
    });

    describe('clicking a header', () => {
      beforeEach(() => mcl.clickHeader('name'));

      it('renders rows with the same count', () => mcl.has({ rowCount: 5 }));

      it('shifts the data down one row', async () => {
        await mcl.find(CellInteractor({ row: 1, column: 'name' })).has({ content: data5[0].name });
      });

      describe('click a header again', () => {
        beforeEach(() => mcl.clickHeader('name'));

        it('shifts the data down another row', async () => {
          await mcl.find(CellInteractor({ row: 2, column: 'name' })).has({ content: data5[0].name });
        });
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
        await mcl.scrollBy({ direction: 'top', value: 200 });
      });

      it('calls the supplied onScroll handler', () => {
        expect(handleScroll.called).to.be.true;
      });
    });

    describe('scrolling the list more', () => {
      beforeEach(async () => {
        await mcl.scrollBy({ direction: 'top', value: 2500 });
      });

      it('expects loaderRow to be present', () => mcl.assert((el) => !!el.querySelector('[data-loader]')));

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

    it('container height is less than the maxHeight', () => mcl.assert((el) => el.querySelector('div[class^=mclScrollable]').width < maxHeight));
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

    it('only renders a portion of the content', () => mcl.assert((el) => (el.querySelectorAll('[class*=mclRow-]').length < data100.length)));

    describe('scrolling the MCL', () => {
      beforeEach(async () => {
        await mcl.scrollBy({ direction: 'top', value: 200 });
      });

      it('calls the onScroll handler', () => {
        expect(handleScroll.called).to.be.true;
      });

      it('still only renders a portion of the content', () => mcl.assert((el) => (el.querySelectorAll('[class*=mclRow-]').length !== data100.length)));

      it('advances the rendered slice of rows', async () => {
        await mcl.find(CellInteractor({ row: 0, columnIndex: 0 })).assert((el) => el.textContent !== data100[0].id);

        // we are not rendering the full data set so the last shouldn't appear
        await mcl.find(CellInteractor({ row: data100.length - 1, columnIndex: 0 })).absent();
      });
    });
  });

  describe('rendering with a hidden grid', () => {
    beforeEach(async () => {
      await mountWithContext(<MCLHarness key="0" autosize={false} displayGrid={false} initialData={data100} />);
    });

    it('mclContainer is not visible', () => mcl.is({ visible: false }));

    it('rowMeasurers are present', () => mcl.assert((el) => (el.querySelectorAll('[class*=mclRow-]').length > 0)));

    it('cells are not measured', () => mcl.find(CellInteractor({ row: 2, columnIndex: 0 })).is({ measured: false }));

    describe('revealing the grid', () => {
      beforeEach(async () => {
        await ButtonInteractor('show grid').click();
      });

      it('mclContainer is visible', () => mcl.is({ visible: true }));

      it('cells are measured', () => mcl.find(CellInteractor({ row: 2, columnIndex: 0 })).is({ measured: true }));
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

    it('has no axe errors', runAxeTest);

    it('displays empty message', () => HTMLInteractor('The list contains no items').exists());

    describe('receiving data', () => {
      beforeEach(async () => {
        await ButtonInteractor('loadData').click();
      });

      it('no longer displays the empty message', () => HTMLInteractor('The list contains no items').absent());

      it('displays data rows', () => mcl.assert((el) => [...el.querySelectorAll('div[class^=mclRowFormatterContainer-]')].length > 0));

      describe('selecting a row', () => {
        beforeEach(async () => {
          await mcl.click({ row: 2, columnIndex: 1 });
        });

        it('applies the selected class', () => mcl.find(CellInteractor({ row: 2, columnIndex: 1 })).is({ selected: true }));

        describe('adjusting to width change', () => {
          beforeEach(async () => {
            await mcl.scrollBy({ direction: 'top', value: 600 });
          });

          describe('selecting another', () => {
            beforeEach(async () => {
              await mcl.click({ row: 11, columnIndex: 1 });
            });

            it('applies the class to the updated selection', () => mcl.find(CellInteractor({ row: 11, columnIndex: 1 })).is({ selected: true }));
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
                <>
                  <div data-test-username>{item.userName}</div>
                  <div data-test-date-joined style={{ backgroundColor: 'grey' }}>
                    {` since ${item.joinDate}`}
                  </div>
                </>
              ),
              email: (item) => <a href={`mailto:${item.email}`}>{item.email}</a>
            }
          }
        />
      );
    });

    it('displays empty message', () => HTMLInteractor('The list contains no items').exists());

    describe('receiving data', () => {
      beforeEach(async () => {
        await ButtonInteractor('loadData').click();
      });

      it('no longer displays the empty message', () => HTMLInteractor('The list contains no items').absent());

      it('displays correct number of columns', () => mcl.assert(
        el => [...el.querySelectorAll('[class*=mclHeader-]')].length > 0
      ));

      it('displays specified columns', () => mcl.has({ columnCount: visibleCol.length }));

      it('renders the formatter', () => mcl.find(CellInteractor({ row: 3, columnIndex: 0 })).assert((el) => !!el.querySelector('[data-test-date-joined]')));

      it('renders the scrollable container without a tabindex since it contains focusable elements (links)', () => tabIndexedElement({ tabIndex: -1, className: including('mclScrollable') }).exists());
    });
  });

  describe('passing rowProps with "to" as function', () => {
    beforeEach(async () => {
      await mountWithContext(
        <StaticRouter context={{}}>
          <MultiColumnList
            contentData={data3}
            rowProps={{ to: id => id }}
          />
        </StaticRouter>
      );
    });

    it('has axe errors', () => {
      runAxeTest()
        .then(() => { throw (new Error('href/anchor rows should not be used due to a11y issues')); })
        .catch(() => { return true; });
    });

    it('renders default formatter (rows as html anchors, <a>)', () => mcl.find(CellInteractor({ row: 0, columnIndex: 0 }))
      .assert(
        (el) => el.parentElement.name === 'a'
      ));
  });

  describe('passing rowProps with "href" as string', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          rowProps={{ href: 'href' }}
        />
      );
    });

    it('renders default formatter (rows as html anchors, <a>)', () => mcl.find(CellInteractor({ row: 0, columnIndex: 0 }))
      .assert(
        (el) => el.parentElement.name === 'a'
      ));
  });

  describe('passing rowProps with "href" as function', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          rowProps={{ href: id => id }}
        />
      );
    });

    it('has axe errors', () => {
      runAxeTest()
        .then(() => { throw (new Error('href/anchor rows should not be used due to a11y issues')); })
        .catch(() => { return true; });
    });

    it('renders default formatter (rows as html anchors, <a>)', () => mcl.find(CellInteractor({ row: 0, columnIndex: 0 }))
      .assert(
        (el) => el.parentElement.name === 'a'
      ));
  });

  describe('using a custom row formatter', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          rowFormatter={({ rowIndex, rowClass, cells, rowProps }) => (
            <p key={`row-${rowIndex}`} className={rowClass} {...rowProps}>
              {cells}
            </p>
          )}
        />
      );
    });

    it('has no axe errors', runAxeTest);

    it('renders default formatter (rows as html anchors, <a>)', () => mcl.find(CellInteractor({ row: 0, columnIndex: 0 }))
      .assert(
        (el) => el.parentElement.name === 'p'
      ));
  });

  describe('using the "onHeaderClick" prop ', () => {
    beforeEach(async () => {
      headerClicked = false;
      await mountWithContext(
        <MultiColumnList
          contentData={data3}
          onHeaderClick={() => { headerClicked = true; }}
          nonInteractiveHeaders={['name']}
        />
      );
    });

    it('clickable headers - no axe errors', runAxeTest);

    it('renders appropriate headers', () => mcl.assert((el) => [...el.querySelectorAll('div[class*=mclHeader-]')].length > 0));

    it('should not be possible to click on the second header (name)', () => mcl.has({ headerInteractivity: [true, false, true, true, true, true] }));

    describe('clicking a header', () => {
      beforeEach(async () => {
        headerClicked = false;
        await mcl.clickHeader('id');
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

    it('fills data as necessary', () => mcl.assert((el) => [...el.querySelectorAll('div[class^=mclRowFormatterContainer-]')].length > 3));
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
        await ButtonInteractor('Two Columns').click();
      });

      it('renders only 2 columns', () => mcl.has({ columnCount: 2 }));
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

    it('renders the MCL', () => mcl.is({ visible: true }));

    describe('invoking a height change', () => {
      beforeEach(async () => {
        await ButtonInteractor('800 height').click();
      });

      it('changes the height of the grid', () => mcl.assert((el) => el.height === '800px'));
    });
  });

  describe('using the pagingType prop', () => {
    const loadMore = ButtonInteractor('Load more');

    let pagingNeedMore;
    beforeEach(async () => {
      pagingNeedMore = sinon.fake();
      await mountWithContext(
        <MCLHarness initialData={data5} asyncPaging onNeedMoreSpy={pagingNeedMore} pagingType="click" />
      );
    });

    it('click paging type has no axe errors', runAxeTest);

    it('renders the paging button', () => loadMore.exists());

    describe('clicking the paging button', () => {
      beforeEach(async () => {
        await mcl.clickLoadMoreButton();
      });

      it('calls the onNeedMoreData handler', () => {
        expect(pagingNeedMore.calledOnce).to.be.true;
      });

      it('disables the Load more button', () => loadMore.is({ disabled: true }));

      describe('after loading data...', () => {
        beforeEach(async () => {
          await mcl.has({ rowCount: 28 });
          await mcl.scrollBy({ direction: 'top', value: 815 });
        });

        it('re-enables Load more button when loading is finished', () => loadMore.is({ disabled: false }));
      })
    });
  });

  describe('prev-next paging', () => {
    let needMoreHandler;
    beforeEach(async () => {
      needMoreHandler = sinon.fake();
      mountWithContext(
        <MultiColumnList
          contentData={sparseData}
          pagingType="prev-next"
          onNeedMoreData={needMoreHandler}
          pageLength={30}
          totalCount={90}
          height={300}
          visibleColumns={['id', 'status', 'orderer']}
        />
      );

      await mcl.clickNextPagingButton();
    });

    it('prev-next paging has no axe errors', runAxeTest);

    it('calls handler with appropriate parameters', () => {
      expect(needMoreHandler.calledWith(30, 60, 30)).to.be.true;
    });

    describe('paging previous', () => {
      beforeEach(async () => {
        await mcl.clickPreviousPagingButton();
      });

      it('calls previous paging handler with appropriae parameters', () => {
        expect(needMoreHandler.calledWith(30, 60, 30)).to.be.true;
      });
    });
  });

  describe('prev-next paging with pagingCanGoNext and pagingCanGoPrevious', () => {
    let needMoreHandler;
    beforeEach(async () => {
      needMoreHandler = sinon.fake();
      mountWithContext(
        <MultiColumnList
          contentData={sparseData}
          pagingType="prev-next"
          onNeedMoreData={needMoreHandler}
          pageLength={30}
          totalCount={90}
          height={300}
          visibleColumns={['id', 'status', 'orderer']}
          pagingCanGoNext={false}
          pagingCanGoPrevious={false}
        />
      );
    });

    it('disables the Next button', () => ButtonInteractor('Next').is({ disabled: true }));

    it('disables the Previous button', () => ButtonInteractor('Previous').is({ disabled: true }));
  });

  describe('pagingOffset prop', () => {
    let needMoreHandler;
    let handleScroll;
    beforeEach(async () => {
      needMoreHandler = sinon.fake();
      handleScroll = sinon.fake();
      await mountWithContext(
        <PrevNextPagingOffset test onNeedMoreData={needMoreHandler} onScroll={handleScroll} totalCount={250} />
      );

      await mcl.scrollBy({ direction: 'top', value: 500 });
    });

    it('displays the proper starting index within pagination', () => HTMLInteractor('1').exists());
    it('displays the proper ending index within pagination', () => HTMLInteractor('100').exists());
    it('scrolls down 500 px', () => mcl.has({ scrollTop: 500 }));

    describe('clicking the next pagination button', () => {
      beforeEach(async () => {
        await mcl.clickNextPagingButton();
      });

      it('displays advanced starting index within pagination', () => HTMLInteractor('101').exists());
      it('displays the proper advanced ending index within pagination', () => HTMLInteractor('200').exists());
      it('scrolls back to top when new data received', () => mcl.has({ scrollTop: 0 }));

      describe('Reaching the totalCount disables the next button...', () => {
        beforeEach(async () => {
          await mcl.clickNextPagingButton();
        });

        it('displays advanced starting index within pagination', () => HTMLInteractor('201').exists());
        it('displays the proper advanced ending index within pagination', () => HTMLInteractor('250').exists());
        it('disables the next button', () => mcl.find(ButtonInteractor('Next')).is({ disabled: true }));
      });

      describe('clicking the previous pagination button', () => {
        beforeEach(async () => {
          await mcl.scrollBy({ direction: 'top', value: 500 });
          await mcl.clickPreviousPagingButton();
        });

        it('displays advanced starting index within pagination', () => HTMLInteractor('1'));
        it('displays the proper advanced ending index within pagination', () => HTMLInteractor('100'));
        it('scrolls back to top when new data received', () => mcl.has({ scrollTop: 0 }));
      });
    });
  });

  describe('mark position functionality', () => {
    let markPositionInspector;
    beforeEach(async () => {
      markPositionInspector = sinon.fake();
      await mountWithContext(<MCLHarness virtualize={false} onMarkPosition={markPositionInspector} initialData={data100} onNeedMoreData={null} />);
      await mcl.click({ row: 6 });
    });

    it('calls the markPosition handler, supplying proper arguments', () => {
      expect(markPositionInspector.calledOnceWith()).to.not.equal(null);
    });
  });

  describe('itemToView, width change', () => {
    let position;
    beforeEach(async () => {
      position = 0;
      await mountWithContext(
        <MCLHarness
          virtualize={false}
          initialData={bigWidthLongData}
          columns={['status', 'id', 'orderer', 'sender']}
          columnWidths={{
            status: '50px',
            id: '20%',
            orderer: '35%',
            sender: '25%'
          }}
          onNeedMoreData={null}
        />
      );
      await mcl.click({ row: 50 });
      position = mclRow.is({ index: 50 }).clientTop;
    });

    it('applies the client top', () => {
      expect(mclRow.has({ element: withClientTop(ct => ct === position) }));
    });
  });

  describe('item-to-view functionality', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiColumnList
          height={300}
          contentData={data100}
          itemToView={{
            selector: '[aria-rowindex="50"]',
            localClientTop: 30
          }}
          visibleColumns={['id']}
        />
      );
    });

    it('scrolls list to view offset', () => {
      expect(mclRow.has({ element: withClientTop(clientTop => clientTop > 0) }));
    });

    describe('clicking a row', () => {
      beforeEach(async () => {
        await mcl.click({ row: 50 });
      });

      it('scrolls list to view offset', () => {
        expect(mclRow.has({ element: withClientTop(clientTop => clientTop > 0) }));
      });
    });
  });

  describe('sticky columns', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MCLHarness
          height={300}
          initialData={data3}
          visibleColumns={['status', 'id', 'orderer', 'sender']}
          columnWidths={{ sender: '30px' }}
          stickyFirstColumn
          stickyLastColumn
          virtualize={false}
          autosize={false}
          totalCount={3}
          pagingType={null}
        />
      );
    });

    it('applies sticky CSS class to first column',
      () => mcl.find(CellInteractor({ row: 2, columnIndex: 0 })).assert((el) => el.className.includes('mclSticky')));

    it('doesn\'t apply sticky CSS class to second column',
      () => mcl.find(CellInteractor({ row: 2, columnIndex: 1 })).assert((el) => !el.className.includes('mclSticky')));

    it('applies sticky CSS class to last column',
      () => mcl.find(CellInteractor({ row: 2, columnIndex: 3 })).assert((el) => el.className.includes('mclSticky')));

    it('applies standard column width to last column',
      () => mcl.find(CellInteractor({ row: 2, columnIndex: 3 })).assert((el) => el.offsetWidth === 30));

    it('detects no vertical scrollbar', () => {
      const container = document.querySelector('[class^=mclScrollable]');
      expect(hasVerticalScrollbar(container)).to.equal(false);
    });

    describe('adding data roles to overflow the grid', () => {
      beforeEach(async () => {
        await Button('loadData').click();
        await mcl.has({ rowCount: 33 })
      });

      it('detects vertical scrollbar', () => {
        const container = document.querySelector('[class^=mclScrollable]');
        expect(hasVerticalScrollbar(container)).to.equal(true);
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.true;
      });
    });

    describe('growing data - paging', () => {
      it('data items did not change', () => {
        currentData = generate(5);
        nextData = [...currentData, ...generate(5)];
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.false;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.false;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.true;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.true;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.false;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.true;
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
        expect(dataChangedOrLess(currentData, nextData).changed).to.be.true;
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

  describe('interactor API', () => {
    beforeEach(async () => {
      await mountWithContext(
        <>
          <MultiColumnList
            contentData={bigWidthData}
            columnWidths={{
              status: { min: 24, max: 24 },
              id: { max: 60 },
              orderer: { min: 60, max: 80 },
              sender: { min: 60, max: 80 },
            }}
            id={'test-4-column-list'}
          />
          <MultiColumnList
            contentData={bigWidthLongData}
            columnWidths={{
              status: { min: 24, max: 24 },
              id: { max: 60 },
              sender: { min: 60, max: 80 },
            }}
            visibleColumns={['status', 'id', 'sender']}
            id={'test-3-column-list'}
          />
        </>
      );
    });

    it('locate MCL by id', () => Interactor('test-3-column-list').exists());
    it('assigns id as appropriate', () => Interactor({ id: 'test-4-column-list' }).exists());
    it('assigns aria rowcount as appropriate', () => Interactor({ id: 'test-4-column-list', ariaRowCount: '31' }).exists());
  });
});
