import {
  interactor,
  isPresent,
  attribute,
  is,
  triggerable,
} from '@bigtest/interactor';

export default interactor(class LayerInteractor {
  rendered = isPresent('[class*=LayerRoot---]');
  ariaLabel = attribute('[class*=LayerRoot---]', 'aria-label');
  isFocused = is('[class*=LayerRoot---]', ':focus');

  pressTab = triggerable('document.body', 'keydown', { keyCode: 9 }); // tab
});
