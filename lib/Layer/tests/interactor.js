import {
  interactor,
  isPresent,
  attribute,
  is,
  triggerable,
} from '@bigtest/interactor';

import css from '../Layer.css';

export default interactor(class LayerInteractor {
  rendered = isPresent(`.${css.LayerRoot}`);
  ariaLabel = attribute(`.${css.LayerRoot}`, 'aria-label');
  isFocused = is(`.${css.LayerRoot}`, ':focus');

  pressTab = triggerable('document.body', 'keydown', { keyCode: 9 }); // tab
});
