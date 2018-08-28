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
  hasEmptyMessage = isPresent(`.${css.isEmptyMessage}`);
  emptyMessageText = text(`.${css.isEmptyMessage}`);
  hasMarginBottom0Class= hasClass('ul', `${css.marginBottom0}`);
  hasBulletedClass= hasClass('ul', `${css.listStyleBullets}`);
  hasDefaultClass= hasClass('ul', `${css.listStyleDefault}`);
  itemCount = this.countItems();
});
