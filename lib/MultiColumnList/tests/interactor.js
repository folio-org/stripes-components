import {
  interactor,
  isPresent
} from '@bigtest/interactor';
import css from '../MCLRenderer.css';

export default interactor(class MultiColumnListInteractor {
  containerPresent = isPresent(`.${css.mclContainer}`);
});
