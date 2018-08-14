import {
  attribute,
  interactor,
  collection,
  computed,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '../../Button/tests/interactor';
import css from '../SegmentedControl.css';

export default interactor(class SegmentedControlInteractor {
   buttons = collection('button', ButtonInteractor);
   activeId = attribute('input', 'id');
   appliedClass = attribute(`.${css.segmentedControl}`, 'class');
   getTagName = tagName(`.${css.segmentedControl}`);
   isDragonfruitPresent = isPresent('dragonfruit');
});

function tagName(selector) {
  return computed(function () {
    return this.$(selector).tagName.toLowerCase();
  });
}

