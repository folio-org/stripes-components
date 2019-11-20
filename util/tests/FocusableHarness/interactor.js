import {
  interactor,
  Interactor,
  collection,
  is,
} from '@bigtest/interactor';

export default @interactor class FocusableInteractor {
  buttons = collection('button', {
    isFocused: is(':focus')
  });

  container = new Interactor('#container');
  inner = new Interactor('#inner');
}
