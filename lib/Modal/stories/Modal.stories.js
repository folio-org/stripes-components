import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs';

import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

import WithModalFooter from '../../ModalFooter/stories/ModalFooterExample';
import WithModalFooterReadme from '../../ModalFooter/readme.md';

import ConfirmationModalExample from '../../ConfirmationModal/stories/ConfirmationModalExample';
import ConfirmationModalReadme from '../../ConfirmationModal/readme.md';

import ErrorModalExample from '../../ErrorModal/stories/ErrorModalExample';
import ErrorModalReadme from '../../ErrorModal/readme.md';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .add('Basic Usage', withReadme(Readme, BasicUsage))
  .add('ConfirmationModal', withReadme(ConfirmationModalReadme, ConfirmationModalExample))
  .add('ErrorModal', withReadme(ErrorModalReadme, ErrorModalExample))
  .add('ModalFooter', withReadme(WithModalFooterReadme, WithModalFooter));
