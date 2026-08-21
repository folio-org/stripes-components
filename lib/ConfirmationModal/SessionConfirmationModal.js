import { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { useSessionStorage } from 'usehooks-ts'
import { useIntl } from 'react-intl';
import ConfirmationModal, { ConfirmationModalPropTypes } from './ConfirmationModal';
import Checkbox from '../Checkbox';
import Layout from '../Layout';

const propTypes = {
  ...ConfirmationModalPropTypes,
  checkboxLabel: PropTypes.node,
  sessionKey: PropTypes.string,
};

const SessionConfirmationModal = ({ sessionKey, checkboxLabel, onConfirm, open, message, ...rest }) => {
  const { formatMessage } = useIntl();
  const sessionKeyRef = useRef(sessionKey || uniqueId('confirmation-modal-'));
  const [suppressStorage, setSuppressStorage] = useSessionStorage(sessionKeyRef.current, false);
  const [suppress, setSuppress] = useState(false);
  // Tracks whether onConfirm was already invoked by the user's own click in this
  // "open" session, so the effect below doesn't fire onConfirm a second time.
  const justConfirmedRef = useRef(false);

  // Auto-confirms when the modal opens and confirmation is already suppressed from
  // a *prior* session (i.e. the user previously checked "do not display again").
  useEffect(() => {
    if (!open) {
      // Reset for the next time this modal is opened.
      justConfirmedRef.current = false;
    } else if (suppressStorage && !justConfirmedRef.current) {
      // mark justConfirmed here so it only gets called once in a suppressed modal, avoiding repeat
      // calls on re-renders.
      justConfirmedRef.current = true;
      onConfirm();
    }
  }, [suppressStorage, open, onConfirm]);

  const handleSessionConfirm = useCallback(() => {
    // Mark that onConfirm is being called here so the effect above skips its own
    // call if setSuppressStorage below causes a re-render while open is still true.
    justConfirmedRef.current = true;
    onConfirm();
    if (suppress) {
      setSuppressStorage(suppress);
    }
  }, [onConfirm, suppress, setSuppressStorage]);

  if (suppressStorage) return null;

  const appendedMessage = (
    <>
      {message}
      <Layout className="marginTop1">
        <Checkbox
          label={formatMessage({
            id: 'ConfirmationModal.suppressLabel',
            defaultMessage: 'Do not display this message again.'
          })}
          onChange={(e) => setSuppress(e.target.checked)}
        />
        <div className="margin-start-gutter">{formatMessage({
          id: 'ConfirmationModal.suppressMessage',
          defaultMessage: 'If checked, this message will be automatically confirmed for the rest of the session.'
        })}
        </div>
      </Layout>
    </>
  );

  return (
    <ConfirmationModal {...rest} open={open} message={appendedMessage} onConfirm={handleSessionConfirm} />
  )
}

SessionConfirmationModal.propTypes = propTypes;

export default SessionConfirmationModal;
