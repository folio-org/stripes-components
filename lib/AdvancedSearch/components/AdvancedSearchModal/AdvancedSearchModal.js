import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { HotKeys } from '../../../HotKeys';
import Modal from '../../../Modal';
import ModalFooter from '../../../ModalFooter';
import Button from '../../../Button';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  isPristine: PropTypes.bool.isRequired,
  onResetAll: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const AdvancedSearchModal = ({
  open,
  children,
  isPristine,
  onSearch,
  onCancel,
  onResetAll,
}) => {
  const shortcutsRef = useRef(null);
  const intl = useIntl();
  const modalTitle = intl.formatMessage({ id: 'stripes-components.advancedSearch.title' });

  const searchLabel = intl.formatMessage({ id: 'stripes-components.advancedSearch.footer.search' });
  const resetAllLabel = intl.formatMessage({ id: 'stripes-components.advancedSearch.footer.resetAll' });

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
          data-test-advanced-search-button-resetAll
          onClick={onResetAll}
          marginBottom0
          aria-label={resetAllLabel}
          disabled={isPristine}
        >
          {resetAllLabel}
        </Button>
      </ModalFooter>
    );
  }, [onSearch, onResetAll, resetAllLabel, searchLabel]);

  const hotKeys = useMemo(() => ({
    search: ['enter'],
  }), []);

  const handlers = useMemo(() => ({
    search: onSearch,
  }), [onSearch]);

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
      <HotKeys
        keyMap={hotKeys}
        handlers={handlers}
        attach={shortcutsRef.current}
      >
        <div ref={shortcutsRef}>
        {children}
        </div>
      </HotKeys>
    </Modal>
  );
};

AdvancedSearchModal.propTypes = propTypes;

export default AdvancedSearchModal;
