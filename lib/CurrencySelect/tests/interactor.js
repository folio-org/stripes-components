import {
  interactor,
  isPresent,
  attribute,
} from '@bigtest/interactor';

export default interactor(class CurrencySelectInteractor {
  id = attribute('select', 'id');
  hasSelect = isPresent('select');
});
