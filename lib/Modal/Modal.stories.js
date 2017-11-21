import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import Readme from './readme.md';

import Modal from './Modal';

storiesOf('Modal', module)
  .addDecorator(withReadme(Readme))
  .add('with defaults', () => (
    <Modal open>
      Modal Content
    </Modal>
  ))
  .add('dismissible', () => (
    <Modal open dismissible>
      Modal Content
    </Modal>
  ))
  .add('with label', () => (
    <Modal open label="Modal Label">
      Modal Content
    </Modal>
  ))
  .add('dismissible, with label', () => (
    <Modal open dismissible label="Modal Label">
      Modal Content
    </Modal>
  ))
  .add('small', () => (
    <Modal open dismissible label="Modal Label" size="small">
      Modal Content
    </Modal>
  ))
  .add('large', () => (
    <Modal open dismissible label="Modal Label" size="large">
      Modal Content
    </Modal>
  ))
  .add('without a header', () => (
    <Modal open showHeader={false}>
      Modal Content
    </Modal>
  ))
  .add('with onClose handler', () => (
    <Modal
      open
      dismissible
      onClose={() => alert('onClose')} // eslint-disable-line no-alert
    >
      Modal Content
    </Modal>
  ))
  .add('with onOpen handler', () => (
    <Modal
      open
      dismissible
      onOpen={() => alert('onOpen')} // eslint-disable-line no-alert
    >
      Modal Content
    </Modal>
  ))
  .add('with root scope', () => (
    <Modal open scope="root">
      Modal Content
    </Modal>
  ))
  .add('closeOnBackgroundClick', () => (
    <Modal open closeOnBackgroundClick>
      Modal Content
    </Modal>
  ));
