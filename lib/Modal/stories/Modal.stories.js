import withReadme from 'storybook-readme/with-readme';

import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

import WithModalFooter from '../../ModalFooter/stories/ModalFooterExample';
import WithModalFooterReadme from '../../ModalFooter/readme.md';

import ConfirmationModalExample from '../../ConfirmationModal/stories/ConfirmationModalExample';
import ConfirmationModalReadme from '../../ConfirmationModal/readme.md';

import ErrorModalExample from '../../ErrorModal/stories/ErrorModalExample';
import ErrorModalReadme from '../../ErrorModal/readme.md';

export default {
  title: 'Modal',
};

export const _BasicUsage = withReadme(Readme, BasicUsage);
export const ConfirmationModal = withReadme(ConfirmationModalReadme, ConfirmationModalExample);

ConfirmationModal.story = {
  name: 'ConfirmationModal',
};

export const ErrorModal = withReadme(ErrorModalReadme, ErrorModalExample);

ErrorModal.story = {
  name: 'ErrorModal',
};

export const ModalFooter = withReadme(WithModalFooterReadme, WithModalFooter);

ModalFooter.story = {
  name: 'ModalFooter',
};
