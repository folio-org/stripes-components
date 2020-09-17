/**
 * ErrorBoundary
 */

import React, { Component, createRef } from 'react';
import { FormattedMessage } from 'react-intl';
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
  static defaultProps = {
    layout: process.env.NODE_ENV
  }

  static propTypes = {
    children: PropTypes.node,
    layout: PropTypes.oneOf(['production', 'development']),
    onReset: PropTypes.func,
    resetButtonLabel: PropTypes.node,
    subTitle: PropTypes.node,
    title: PropTypes.node,
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

  handleCopyErrorStack = () => {
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

  handleReset = e => {
    const { onReset } = this.props;
    const { error, info } = this.state;

    if (typeof onReset === 'function') {
      onReset(error, info, e);
    } else {
      window.location.reload();
    }
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
        <Headline tag="h3" size="large" className={css.errorTitle}>
          Error: {error.message}
        </Headline>
        <pre className={css.errorStack}>{componentStack}</pre>
      </MessageBanner>
    );
  }

  renderProductionError = () => {
    const { title, subTitle, resetButtonLabel } = this.props;
    const { errorCopied, modalOpen, error, info: { componentStack } } = this.state;

    return (
      <>
        <div className={css.header}>
          <Icon icon="exclamation-circle" iconRootClass={css.header__icon} />
          <Headline tag="h1" size="xx-large" margin="xx-small" data-test-error-boundary-title>
            {title || <FormattedMessage id="stripes-components.ErrorBoundary.defaultTitle" />}
          </Headline>
          <Headline tag="h2" size="medium" faded className={css.header__sub} data-test-error-boundary-subtitle>
            {subTitle || <FormattedMessage id="stripes-components.ErrorBoundary.defaultSubTitle" />}
            {' '}
            <TextLink
              element="button"
              type="button"
              className={css.viewDetailsButton}
              onClick={this.toggleModal}
              data-test-error-boundary-details-button
            >
              <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
            </TextLink>
          </Headline>
        </div>
        <Button
          buttonStyle="primary"
          buttonClass={css.primaryButton}
          onClick={this.handleReset}
          data-test-error-boundary-reset-button
        >
          {resetButtonLabel || <FormattedMessage id="stripes-components.ErrorBoundary.defaultButtonLabel" />}
        </Button>
        <FormattedMessage id="stripes-components.ErrorBoundary.errorDetails">
          {modalLabel => (
            <Modal
              label={modalLabel}
              aria-label={modalLabel}
              dismissible
              open={modalOpen}
              onClose={this.toggleModal}
              id="error-boundary-details-modal"
              closeOnBackgroundClick
              size="medium"
              footer={
                <ModalFooter>
                  <Button
                    marginBottom0
                    buttonStyle="primary"
                    onClick={this.toggleModal}
                  >
                    <FormattedMessage id="stripes-components.close" />
                  </Button>
                  <Button
                    marginBottom0
                    buttonStyle="default"
                    onClick={this.handleCopyErrorStack}
                    disabled={errorCopied}
                  >
                    <Icon icon="clipboard">
                      {errorCopied ?
                        <FormattedMessage id="stripes-components.copied" /> :
                        <FormattedMessage id="stripes-components.copy" />
                      }
                    </Icon>
                  </Button>
                </ModalFooter>
              }
            >
              <Headline size="medium">
                <FormattedMessage id="stripes-components.ErrorBoundary.detailsDescription" />
              </Headline>
              {this.renderErrorStack()}
            </Modal>
          )}
        </FormattedMessage>
        <textarea
          defaultValue={`URL: ${window.location.href}\n\nError: ${error}\n\nStack: ${componentStack}`}
          ref={this.copyRef}
          className="sr-only"
          aria-hidden
        />
      </>
    );
  }

  renderError = () => {
    const { layout } = this.props;
    const isDevelopment = layout === 'development';
    const isProduction = layout === 'production';

    if (isDevelopment) {
      return this.renderErrorStack();
    }

    if (isProduction) {
      return this.renderProductionError();
    }

    // Default to production error
    return this.renderProductionError();
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className={css.root} data-test-error-boundary>
          {this.renderError()}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
