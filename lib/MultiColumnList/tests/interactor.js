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
} from '@bigtest/interactor';
import css from '../MCLRenderer.css';

const CellInteractor = interactor(class CellInteractor {
  content = text();
  width = property('offsetWidth');
});

const RowInteractor = interactor(class RowInteractor {
  isSelected = hasClass(`${css.mclSelected}`);
  cellCount = count(`.${css.mclCell}`);
  cells = collection(`.${css.mclCell}`, CellInteractor);
  click = clickable();
  isAnchor = is('a');
});

const HeaderInteractor = interactor(class HeaderInteractor {
  isSortHeader = hasClass(`${css.mclSorted}`);
  click = clickable('[data-test-clickable-header]');
});

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent(`.${css.mclContainer}`);
  containerWidth = property(`.${css.mclContainer}`, 'offsetWidth');
  containerHeight = property(`.${css.mclContainer}`, 'offsetHeight');
  rowCount = count(`.${css.mclRow}`);
  columnCount = count(`.${css.mclHeader}`);
  rows = collection(`.${css.mclRow}`, RowInteractor);
  headers = collection(`.${css.mclHeader}`, HeaderInteractor);
  scrollbodyTop = property(`.${css.mclRowContainer}`, 'offsetTop');
  displaysEmptyMessage = isPresent(`.${css.mclEmptyMessage}`);
  displaysLoadingIcon = isPresent(`.${css.mclContentLoading}`);

  scrollBody(amount) {
    return this.scroll(`.${css.mclScrollable}`, { top: amount });
  }

  contains(selector) {
    return this.$$(selector).length > 0;
  }
});
