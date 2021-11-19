import {
  interactor,
  computed,
} from '@bigtest/interactor';
import css from '../ButtonGroup.css';

function tagName(selector) {
  return computed(function () {
    return this.$(selector).tagName.toLowerCase();
  });
}

export default interactor(class ButtonGroupInteractor {
  static defaultScope = '[class*=buttonGroup---]'
  tagName = tagName();
});
