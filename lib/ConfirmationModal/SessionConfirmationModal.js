import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { useSessionStorage } from 'rehooks-ts'
import { useIntl } from 'react-intl';
import ConfirmationModal from './ConfirmationModal';
import Checkbox from '../Checkbox';

const propTypes = {
  bodyTag: PropTypes.string,
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node.isRequired,
  id: PropTypes.string,
  isConfirmButtonDisabled: PropTypes.bool,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  sessionKey: PropTypes.string,
  checkboxLabel: PropTypes.node,
  confirmIfSuppressed: PropTypes.bool,
};

const SessionConfirmationModal = ({ sessionKey, checkboxLabel, confirmIfSuppressed, onConfirm, message, ...rest }) => {
  const { formatMessage } = useIntl();
  const sessionKeyRef = useRef(sessionKey || uniqueId('confirmation-modal-'));
  const [suppressStorage, setSuppressStorage] = useSessionStorage(sessionKeyRef.current, false);
  const [suppress, setSuppress] = useState(false);

  const handleSessionConfirm = useCallback(() => {
    onConfirm();
    if (suppress) {
      setSuppressStorage(suppress);
    }
  }, [onConfirm, suppress, setSuppressStorage]
  );

  const appendedMessage = (
    <>
      {message}
      <div>
        <Checkbox
          label={formatMessage({
            id: 'ConfirmationModal.suppressMessage',
            defaultMessage: "Do not display this message again."
          })}
          onChange={(e) => setSuppress(e.target.checked)}
        />
      </div>
    </>
  )

  if (suppressStorage) {
    if (confirmIfSuppressed) { onConfirm() };
    return null;
  }

  return (
    <ConfirmationModal {...rest} message={appendedMessage} onConfirm={handleSessionConfirm} />
  )
}

SessionConfirmationModal.propTypes = propTypes;

export default SessionConfirmationModal;
