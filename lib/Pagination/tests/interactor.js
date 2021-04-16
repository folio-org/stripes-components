import {
  clickable,
  collection,
  interactor,
  isPresent,
  computed,
  scoped,
  hasClass,
} from '@bigtest/interactor';

// import { selectorFromClassnameString } from '../../../tests/helpers';

import css from '../Pagination.css';
import iconCSS from '../../Icon/Icon.css';


const PaginationLinkInteractor = interactor(class NumberLinkInteractor {
  number = computed(function () {
    return this.$root.innerText;
  });

  text = computed(function () {
    return this.$root.innerText;
  });

  labelHidden = hasClass(`.${iconCSS.label} > *`, 'sr-only');
  click = clickable();
});

export default interactor(class PaginationInteractor {
  static defaultScope = 'nav[data-test-pagination]';
  numberlinks = collection(`.${css.paginationItem}`, PaginationLinkInteractor);

  linksArePresent = isPresent(`.${css.paginationLink}`);
  nextlink = scoped('[rel=next]', PaginationLinkInteractor);
  previouslink = scoped('[rel=prev]', PaginationLinkInteractor);
  lastNumber = scoped(`.${css.paginationItem}:nth-last-of-type(2)`, PaginationLinkInteractor);
  firstNumber = scoped(`.${css.paginationItem}:nth-of-type(2)`, PaginationLinkInteractor);
});
