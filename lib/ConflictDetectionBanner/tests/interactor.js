import {
  interactor,
} from '@bigtest/interactor';
import MessageBannerInteractor from '../../MessageBanner/tests/interactor';
import IconInteractor from '../../Icon/tests/interactor';
import TextLinkInteractor from '../../TextLink/tests/interactor';

import css from '../ConflictDetectionBanner.css';

export default interactor(class ConflictDetectionInteractor {
  messageBanner = new MessageBannerInteractor('[data-test-message-banner]');
  externalLinkIcon = new IconInteractor(`.${css.externalLink}`);
  link = new TextLinkInteractor('[data-test-text-link]');
});
