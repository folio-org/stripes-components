/**
 * ErrorBoundary -> ProductionError
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import css from './ProductionError.css';
import Icon from '../../../Icon';
import SRStatus from '../../../SRStatus';
import TextLink from '../../../TextLink';
import Modal from '../../../Modal';
import ModalFooter from '../../../ModalFooter';
import Button from '../../../Button';
import Headline from '../../../Headline';
import ErrorMessage from '../ErrorMessage';

const ProductionError = ({
  error,
  onCopyError,
  onReset,
  resetButtonLabel,
  stackTrace,
  subTitle,
  title,
}) => {
  const intl = useIntl();
  const copyRef = useRef(null);
  const srsRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorCopied, setErrorCopied] = useState(false);
  const handleToggleModal = () => setModalOpen(!modalOpen);

  const handleReset = e => {
    if (typeof onReset === 'function') {
      onReset(error, stackTrace, e);
    } else {
      window.location.reload();
    }
  };

  const handleCopyStack = () => {
    const el = copyRef.current;
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');

    if (typeof onCopyError === 'function') {
      onCopyError(el.defaultValue);
    }

    srsRef.current.sendMessage(
      intl.formatMessage({
        id: 'stripes-components.ErrorBoundary.errorCopiedScreenReaderMessage'
      })
    );
    setErrorCopied(true);
  };

  useEffect(() => {
    let timeout;

    if (errorCopied) {
      timeout = setTimeout(() => {
        setErrorCopied(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [errorCopied]);

  return (
    <>
      <div className={css.header}>
        <Icon icon="exclamation-circle" iconRootClass={css.header__icon} />
        <Headline
          tag="h1"
          size="xx-large"
          margin="xx-small"
          data-test-error-boundary-production-error-title
        >
          {title || <FormattedMessage id="stripes-components.ErrorBoundary.defaultTitle" />}
        </Headline>
        <Headline
          tag="h2"
          size="medium"
          faded
          className={css.header__sub}
          data-test-error-boundary-production-error-sub-title
        >
          {subTitle || <FormattedMessage id="stripes-components.ErrorBoundary.defaultSubTitle" />}
          {' '}
          <TextLink
            element="button"
            type="button"
            className={css.viewDetailsButton}
            onClick={handleToggleModal}
            data-test-error-boundary-production-error-details-button
          >
            <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
          </TextLink>
        </Headline>
      </div>
      <Button
        buttonStyle="primary"
        buttonClass={css.resetButton}
        onClick={handleReset}
        data-test-error-boundary-production-error-reset-button
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
            onClose={handleToggleModal}
            data-test-error-boundary-production-error-details-modal
            closeOnBackgroundClick
            contentClass={css.modalContent}
            size="medium"
            footer={
              <ModalFooter>
                <Button
                  marginBottom0
                  buttonStyle="primary"
                  onClick={handleToggleModal}
                >
                  <FormattedMessage id="stripes-components.close" />
                </Button>
                <Button
                  marginBottom0
                  buttonStyle="default"
                  onClick={handleCopyStack}
                  disabled={errorCopied}
                  data-test-error-boundary-production-error-copy-button
                  aria-label={intl.formatMessage({ id: 'stripes-components.ErrorBoundary.copyErrorButtonAriaLabel' })}
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
            <SRStatus ref={srsRef} />
            <Headline size="medium">
              <FormattedMessage id="stripes-components.ErrorBoundary.detailsDescription" />
            </Headline>
            <ErrorMessage
              data-test-error-boundary-production-error-message
              error={error}
              stack={stackTrace}
            />
          </Modal>
        )}
      </FormattedMessage>
      <textarea
        defaultValue={`URL: ${window.location.href}\n\nError: ${error}\n\nStack: ${stackTrace}`}
        ref={copyRef}
        className="sr-only"
        aria-hidden
      />
    </>
  );
};

ProductionError.propTypes = {
  error: PropTypes.string,
  onCopyError: PropTypes.func,
  onReset: PropTypes.func,
  resetButtonLabel: PropTypes.node,
  stackTrace: PropTypes.string,
  subTitle: PropTypes.node,
  title: PropTypes.node,
};

export default ProductionError;
