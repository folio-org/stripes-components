import {
  collection,
  clickable,
  hasClass,
  interactor,
  isPresent,
  is,
  count,
  text,
  computed,
} from '@bigtest/interactor';
import css from '../MCLRenderer.css';

const CellInteractor = interactor(class CellInteractor {
  content = text();
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
  click = clickable();
});

function getWidth(selector) {
  return computed(function () {
    return this.$(selector).offsetWidth;
  });
}

function getHeight(selector) {
  return computed(function () {
    return this.$(selector).offsetHeight;
  });
}

function getTop(selector) {
  return computed(function () {
    return this.$(selector).offsetTop;
  });
}

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent(`.${css.mclContainer}`);
  containerWidth = getWidth(`.${css.mclContainer}`);
  containerHeight = getHeight(`.${css.mclContainer}`);
  rowCount = count(`.${css.row}`);
  columnCount = count(`.${css.header}`);
  rows = collection(`.${css.row}`, RowInteractor);
  headers = collection(`.${css.header}`, HeaderInteractor);
  scrollBodyTop = getTop(`.${css.rowContainer}`);
  displaysEmptyMessage = isPresent(`.${css.emptyMessage}`);
  displaysLoadingIcon = isPresent(`.${css.contentLoading}`);

  scrollBody = function (amount) {
    this.$(`.${css.scrollable}`).scrollTop += amount;
    return this.trigger(`.${css.scrollable}`, 'scroll');
  };
});
