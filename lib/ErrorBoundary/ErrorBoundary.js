/**
 * ErrorBoundary
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import ModalFooter from '../ModalFooter';
import Button from '../Button';
import Modal from '../Modal';
import TextLink from '../TextLink';
import Icon from '../Icon';
import MessageBanner from '../MessageBanner';
import css from './ErrorBoundary.css';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      errorCopied: false,
      error: undefined,
      info: undefined,
    };

    this.copyRef = createRef(null);
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  toggleModal = () => {
    this.setState(({ modalOpen }) => ({
      modalOpen: !modalOpen
    }));
  }

  handleCopyStack = () => {
    const el = this.copyRef.current;
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');

    this.setState({
      errorCopied: true
    }, () => {
      setTimeout(() => {
        this.setState({
          errorCopied: false
        });
      }, 1000);
    });
  }

  renderErrorStack = () => {
    const { error, info: { componentStack } } = this.state;

    return (
      <MessageBanner
        type="error"
        icon={null}
        className={css.errorMessage}
        contentClassName={css.errorMessageContent}
      >
        <Headline size="large" className={css.errorTitle}>
          Error: {error.message}
        </Headline>
        <pre className={css.errorStack}>{componentStack}</pre>
      </MessageBanner>
    );
  }

  renderProductionError = () => {
    const { errorCopied, modalOpen, error, info: { componentStack } } = this.state;

    return (
      <div className={css.root}>
        <div className={css.header}>
          <Icon icon="exclamation-circle" iconRootClass={css.header__icon} />
          <Headline size="xx-large" margin="xx-small">
            Something went wrong
          </Headline>
          <Headline size="medium" faded className={css.header__sub}>
            Refresh the page to continue.{' '}
            <TextLink
              element="button"
              type="button"
              className={css.viewDetailsButton}
              onClick={this.toggleModal}
            >
              View error details
            </TextLink>
          </Headline>
        </div>
        <Button buttonStyle="primary" block buttonClass={css.primaryButton}>
          Refresh page
        </Button>
        <Modal
          label="Error details"
          aria-label="Error details"
          dismissible
          open={modalOpen}
          onClose={this.toggleModal}
          id="basic-modal-example"
          closeOnBackgroundClick
          size="medium"
          footer={
            <ModalFooter>
              <Button
                marginBottom0
                buttonStyle="primary"
                onClick={this.toggleModal}
              >
                Close
              </Button>
              <Button
                marginBottom0
                buttonStyle="default"
                onClick={this.handleCopyStack}
                disabled={errorCopied}
              >
                {errorCopied ? 'Copied' : 'Copy'}
              </Button>
            </ModalFooter>
          }
        >
          <Headline size="medium">
            The following occurred, resulting in the current page becoming unstable:
          </Headline>
          {this.renderErrorStack()}
        </Modal>
        <textarea defaultValue={`${error}\n ${componentStack}`} ref={this.copyRef} className="sr-only" aria-hidden />
      </div>
    );
  }

  renderDevelopmentError = () => {
    return (
      <div className={css.root}>
        {this.renderErrorStack()}
      </div>
    );
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      // if (process.env.NODE_ENV === 'development') {
      //   return this.renderDevelopmentError();
      // }

      return this.renderProductionError();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
