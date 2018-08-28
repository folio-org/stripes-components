import {
  attribute,
  hasClass,
  interactor,
  count,
  is,
  isPresent,
  text,
} from '@bigtest/interactor';

import css from '../List.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

export default interactor(class ListInteractor {
  countItems(selector = 'li') {
    return count(selector);
  }

  hasUL= isPresent('ul');
  hasEmptyMessage = isPresent(`.${css.isEmptyMessage}`);
  emptyMessageText = text(`.${css.isEmptyMessage}`);
  itemCount = this.countItems();
});
