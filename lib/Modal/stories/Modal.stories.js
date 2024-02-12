import BasicUsage from './BasicUsage';

import WithModalFooter from '../../ModalFooter/stories/ModalFooterExample';

import ConfirmationModalExample from '../../ConfirmationModal/stories/ConfirmationModalExample';

import ErrorModalExample from '../../ErrorModal/stories/ErrorModalExample';

export default {
  title: 'Modal',
};

export const _BasicUsage = BasicUsage;
export const ConfirmationModal = ConfirmationModalExample;

ConfirmationModal.storyName = 'ConfirmationModal';

export const ErrorModal = ErrorModalExample;

ErrorModal.storyName = 'ErrorModal';

export const ModalFooter = WithModalFooter;

ModalFooter.storyName = 'ModalFooter';
