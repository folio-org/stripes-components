import {
  hasClass,
  interactor,
  count,
  isPresent,
  text,
} from '@bigtest/interactor';

import css from '../List.css';

export default interactor(class ListInteractor {
  countItems(selector = 'li') {
    return count(selector);
  }

  hasUL= isPresent('ul');
  hasEmptyMessage = isPresent('[class*=isEmptyMessage---]');
  emptyMessageText = text('[class*=isEmptyMessage---]');
  hasMarginBottom0Class= hasClass('ul', '[class*=marginBottom0---]');
  hasBulletedClass= hasClass('ul', '[class*=listStyleBullets---]');
  hasDefaultClass= hasClass('ul', '[class*=listStyleDefault---]');
  itemCount = this.countItems();
});
