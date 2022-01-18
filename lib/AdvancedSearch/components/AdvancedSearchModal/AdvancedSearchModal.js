import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import Modal from '../../../Modal';
import ModalFooter from '../../../ModalFooter';
import Button from '../../../Button';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const AdvancedSearchModal = ({
  open,
  children,
  onSearch,
  onCancel,
}) => {
  const intl = useIntl();
  const modalTitle = intl.formatMessage({ id: 'stripes-components.advancedSearch.title' });

  const searchLabel = intl.formatMessage({ id: 'stripes-components.advancedSearch.footer.search' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.advancedSearch.footer.cancel' });

  const footer = useMemo(() => {
    return (
      <ModalFooter>
        <Button
          data-test-advanced-search-button-search
          buttonStyle="primary"
          onClick={onSearch}
          marginBottom0
          aria-label={searchLabel}
        >
          {searchLabel}
        </Button>
        <Button
          data-test-advanced-search-button-cancel
          onClick={onCancel}
          marginBottom0
          aria-label={cancelLabel}
        >
          {cancelLabel}
        </Button>
      </ModalFooter>
    );
  }, [intl, onSearch, onCancel]);

  return (
    <Modal
      open={open}
      id="advanced-search-modal"
      dismissible
      label={modalTitle}
      showHeader
      onClose={onCancel}
      footer={footer}
      aria-label={modalTitle}
    >
      {children}
    </Modal>
  );
};

AdvancedSearchModal.propTypes = propTypes;

export default AdvancedSearchModal;
