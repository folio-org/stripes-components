import {
  interactor,
  isPresent
} from '@bigtest/interactor';
import css from '../Selection.css';

export default interactor(class SelectionInteractor {
  controlPresent = isPresent(`.${css.SelectionControlContainer}`);
});
