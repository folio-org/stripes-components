import {
  collection,
  clickable,
  hasClass,
  interactor,
  isPresent,
  is,
  count,
  text,
  property,
  isVisible,
  scoped,
  computed,
} from '@bigtest/interactor';

import { computedStyle } from '../../../tests/helpers';
import css from '../MCLRenderer.css';


function clientTop(selector) {
  return computed(function () {
    return this.$(selector).getBoundingClientRect().top;
  });
}

const CellInteractor = interactor(class CellInteractor {
  content = text();
  width = property('offsetWidth');
  style = property('style');
});

const RowMeasurerInteractor = interactor(class RowMeasurerInteractor {
  style = property('style');
});

const RowInteractor = interactor(class RowInteractor {
  isSelected = hasClass(`${css.mclSelected}`);
  cellCount = count('[class*=mclCell---]');
  cells = collection('[class*=mclCell---]', CellInteractor);
  click = clickable();
  isAnchor = is('a');
  width = property('offsetWidth');
  minWidth = computedStyle(undefined, 'minWidth');
  clientTop = clientTop(this.$selector);
});

const HeaderInteractor = interactor(class HeaderInteractor {
  isSortHeader = hasClass(`${css.mclSorted}`);
  click = clickable('[data-test-clickable-header]');
  isInteractive = isPresent('[data-test-clickable-header]');
});

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent('[class*=mclContainer---]');
  containerVisible = isVisible('[class*=mclContainer---]');
  containerWidth = property('[class*=mclContainer---]', 'offsetWidth');
  containerHeight = property('[class*=mclContainer---]', 'offsetHeight');
  rowCount = count('[data-row-inner]');
  columnCount = count('[class*=mclHeader---]');
  rows = collection('[data-row-inner]', RowInteractor);
  rowMeasurers = collection('[class*=mclRowFormatterContainer---]', RowMeasurerInteractor);
  loaderPresent = isPresent('[class*=mclLoaderRow---]');
  headers = collection('[class*=mclHeader---]', HeaderInteractor);
  scrollbodyTop = property('[class*=mclRowContainer---]', 'offsetTop');
  scrollBodyHeight = property('[class*=mclRowContainer---]', 'offsetHeight');
  displaysEmptyMessage = isPresent('[class*=mclEmptyMessage---]');
  displaysLoadingIcon = isPresent('[class*=mclContentLoading---]');
  cell = scoped('[class*=mclCell---]', CellInteractor);
  pagingButton = scoped('[data-test-paging-button]');
  pagingNext = scoped('[data-test-next-paging-button]');
  pagingPrevious = scoped('[data-test-prev-paging-button]');

  listScrollTop = property('[class*=mclScrollable---]', 'scrollTop');

  columnsMeasured() {
    return this.when(() => (this.cell.style && this.cell.style.width !== ''));
  }

  scrollBody(amount) {
    return this.scroll('[class*=mclScrollable---]', { top: amount });
  }

  contains(selector) {
    return this.$$(selector).length > 0;
  }
});
