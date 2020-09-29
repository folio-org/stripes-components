/**
 * ErrorBoundary -> ProductionError
 */

import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import css from './ProductionError.css';
import Icon from '../../../Icon';
import TextLink from '../../../TextLink';
import Modal from '../../../Modal';
import ModalFooter from '../../../ModalFooter';
import Button from '../../../Button';
import Headline from '../../../Headline';
import StackTrace from '../ErrorMessage';

const ProductionError = ({
  error,
  onReset,
  resetButtonLabel,
  stackTrace,
  subTitle,
  title,
}) => {
  const copyRef = useRef(null);
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
    const el = copyRef;
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');

    setErrorCopied(true);
  };

  useEffect(() => {
    let timeout;

    if (errorCopied) {
      timeout = setTimeout(() => {
        setErrorCopied(true);
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
          data-test-error-boundary-title
        >
          {title || <FormattedMessage id="stripes-components.ErrorBoundary.defaultTitle" />}
        </Headline>
        <Headline
          tag="h2"
          size="medium"
          faded
          className={css.header__sub}
          data-test-error-boundary-subtitle
        >
          {subTitle || <FormattedMessage id="stripes-components.ErrorBoundary.defaultSubTitle" />}
          {' '}
          <TextLink
            element="button"
            type="button"
            className={css.viewDetailsButton}
            onClick={handleToggleModal}
            data-test-error-boundary-details-button
          >
            <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
          </TextLink>
        </Headline>
      </div>
      <Button
        buttonStyle="primary"
        buttonClass={css.primaryButton}
        onClick={handleReset}
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
            onClose={handleToggleModal}
            id="error-boundary-details-modal"
            closeOnBackgroundClick
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
            <StackTrace
              error={error}
              stackTrace={stackTrace}
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

export default ProductionError;
