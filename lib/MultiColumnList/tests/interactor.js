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
  isSelected = hasClass(`${css.selected}`);
  cellCount = count(`.${css.cell}`);
  cells = collection(`.${css.cell}`, CellInteractor);
  click = clickable();
  isAnchor = is('a');
});

const HeaderInteractor = interactor(class HeaderInteractor {
  isSortHeader = hasClass(`${css.sorted}`);
  click = clickable('[data-test-clickable-header]');
});

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent(`.${css.mclContainer}`);
  containerWidth = property(`.${css.mclContainer}`, 'offsetWidth');
  containerHeight = property(`.${css.mclContainer}`, 'offsetHeight');
  rowCount = count(`.${css.row}`);
  columnCount = count(`.${css.header}`);
  rows = collection(`.${css.row}`, RowInteractor);
  headers = collection(`.${css.header}`, HeaderInteractor);
  scrollbodyTop = property(`.${css.rowContainer}`, 'offsetTop');
  displaysEmptyMessage = isPresent(`.${css.emptyMessage}`);
  displaysLoadingIcon = isPresent(`.${css.contentLoading}`);

  scrollBody(amount) {
    return this.scroll(`.${css.scrollable}`, { top: amount });
  }

  contains(selector) {
    return this.$$(selector).length > 0;
  }
});
