import React from 'react';

import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs/react';

import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

import WithModalFooter from '../../ModalFooter/examples/ModalFooterExample';
import WithModalFooterReadme from '../../ModalFooter/readme.md';

import ModalWithFormExample from './ModalWithFormExample';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .add('Basic Usage', withReadme(Readme, BasicUsage))
  .add('ModalFooter', withReadme(WithModalFooterReadme, WithModalFooter))
  .add('Best Practice Example', withReadme(WithModalFooterReadme, () => <ModalWithFormExample />));
