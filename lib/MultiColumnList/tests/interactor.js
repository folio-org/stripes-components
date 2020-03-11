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
} from '@bigtest/interactor';

import { computedStyle } from '../../../tests/helpers';
import css from '../MCLRenderer.css';

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
  cellCount = count(`.${css.mclCell}`);
  cells = collection(`.${css.mclCell}`, CellInteractor);
  click = clickable();
  isAnchor = is('a');
  width = property('offsetWidth');
  minWidth = computedStyle(undefined, 'minWidth');
});

const HeaderInteractor = interactor(class HeaderInteractor {
  isSortHeader = hasClass(`${css.mclSorted}`);
  click = clickable('[data-test-clickable-header]');
});

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent(`.${css.mclContainer}`);
  containerVisible = isVisible(`.${css.mclContainer}`);
  containerWidth = property(`.${css.mclContainer}`, 'offsetWidth');
  containerHeight = property(`.${css.mclContainer}`, 'offsetHeight');
  rowCount = count(`.${css.mclRow}:not([data-loader])`);
  columnCount = count(`.${css.mclHeader}`);
  rows = collection(`.${css.mclRow}:not([data-loader])`, RowInteractor);
  rowMeasurers = collection(`.${css.mclRowFormatterContainer}`, RowMeasurerInteractor);
  loaderPresent = isPresent(`.${css.mclLoaderRow}`);
  headers = collection(`.${css.mclHeader}`, HeaderInteractor);
  scrollbodyTop = property(`.${css.mclRowContainer}`, 'offsetTop');
  scrollBodyHeight = property(`.${css.mclRowContainer}`, 'offsetHeight');
  scrollTop = property(`.${css.mclScrollable}`, 'scrollTop');
  displaysEmptyMessage = isPresent(`.${css.mclEmptyMessage}`);
  displaysLoadingIcon = isPresent(`.${css.mclContentLoading}`);
  cell = scoped(`.${css.mclCell}`, CellInteractor);
  pagingButton = scoped('[data-test-paging-button]');

  columnsMeasured() {
    return this.when(() => (this.cell.style && this.cell.style.width !== ''));
  }

  scrollBody(amount) {
    return this.scroll(`.${css.mclScrollable}`, { top: amount });
  }

  contains(selector) {
    return this.$$(selector).length > 0;
  }
});
