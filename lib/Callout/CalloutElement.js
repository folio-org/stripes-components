import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import IconButton from '../IconButton';
import Icon from '../Icon';
import css from './Callout.css';

const getClassNamefromTransitionState =
  (tState, cType, baseClass, tType) => `${baseClass} ${css[`${cType}`]} ${css[`${tType}-${tState}`]}`;

const getIconForType = (type) => {
  switch (type) {
    case 'success':
      return 'check-circle';
    case 'error':
      return 'exclamation-circle';
    default:
      return 'chevron-double-right';
  }
};

const propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.string,
  ]).isRequired,
  onDismiss: PropTypes.func.isRequired,
  timeout: PropTypes.number,
  transition: PropTypes.string,
  type: PropTypes.string,
};

const defaultProps = {
  timeout: '6000',
  transition: 'slide',
  type: 'success',
};

const CalloutElement = props => (
  <Transition
    {...props}
    timeout={300}
    appear
  >
    {transitionState => (
      <div className={css.calloutRow}>
        <div
          className={getClassNamefromTransitionState(transitionState, props.type, css.calloutBase, props.transition)}
        >
          <Icon icon={getIconForType(props.type)} />
          <div className={css.message}>{props.message}</div>
          <IconButton icon="times" onClick={() => props.onDismiss(props.id)} />
        </div>
      </div>
    )}
  </Transition>
);

CalloutElement.propTypes = propTypes;
CalloutElement.defaultProps = defaultProps;

export default CalloutElement;
