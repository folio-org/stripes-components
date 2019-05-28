import {
  hasClass,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import css from '../Card.css';

@interactor class CardInteractor {
  static defaultScope = `.${css.card}`
  isHeaderPresent = isPresent('[data-test-card-header]');
  header = text('[data-test-card-header]');
  headerStart = text('[data-test-card-header-start]');
  headerEnd = text('[data-test-card-header-end]');
  isBodyPresent = isPresent('[data-test-card-body]');
  body = text('[data-test-card-body]');

  rendersDefault = hasClass(css.default);
  rendersLookupEmpty = hasClass(css.lookupEmpty);
  rendersLookupPreview = hasClass(css.lookupPreview);
  rendersBottomMargin0 = hasClass(css.marginBottom0);

  cardHasTestClass = hasClass('test-card');
  headerHasTestClass = hasClass('[data-test-card-header]', 'test-header');
  bodyHasTestClass = hasClass('[data-test-card-body]', 'test-body')
}

export default CardInteractor;
