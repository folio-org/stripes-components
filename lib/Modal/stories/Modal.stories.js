import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs/react';

import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

import WithModalFooter from '../../ModalFooter/examples/ModalFooterExample';
import WithModalFooterReadme from '../../ModalFooter/readme.md';

import ConfirmationModalExample from '../../ConfirmationModal/examples/ConfirmationModalExample';
import ConfirmationModalReadme from '../../ConfirmationModal/readme.md';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .add('Basic Usage', withReadme(Readme, BasicUsage))
  .add('ConfirmationModal', withReadme(ConfirmationModalReadme, ConfirmationModalExample))
  .add('ModalFooter', withReadme(WithModalFooterReadme, WithModalFooter));
