import {
  interactor,
  blurrable,
  text,
  isPresent,
  collection,
  property,
} from '@bigtest/interactor';

import css from '../AutoComplete.css';
import TextField from '../../TextField/tests/interactor';

const OptionInteractor = interactor(class OptionInteractor {
    optionText = text();
});

export default interactor(class AutoCompleteInteractor {
  textfield = new TextField();
  blurInput = blurrable('input');
  isListOpen = isPresent(`.${css.AutoComplete} li`);
  ariaExpanded = property(`.${css.downshift}`, 'aria-expanded');
  options = collection('li', OptionInteractor);
  liValue = text('li');


  clickOption(index) {
    return this.click(`li:nth-of-type(${index}`);
  }

  items() {
    return this.options().map(item => item.optionText);
  }

  moveToNextOption(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 40 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 40 });
  }

  moveToPreviousOption(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 38 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 38 });
  }

  pressEnter(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 13 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 13 });
  }
});
