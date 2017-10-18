import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import Button from '../Button';
import Icon from '../Icon';
import css from './Callout.css';

const getClassNamefromTransitionState = (tState, cType, baseClass, tType) =>
  `${baseClass} ${css[`${cType}`]} ${css[`${tType}-${tState}`]}`;

const getIconForType = (type) => {
  switch (type) {
    case 'success':
      return 'validation-check';
    case 'error':
      return 'validation-error';
    default:
      return 'right-double-chevron-bold';
  }
};

const propTypes = {
  type: PropTypes.string,
  timeout: PropTypes.number,
  transition: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const defaultProps = {
  type: 'success',
  timeout: '6000',
  transition: 'slide',
};

const CalloutElement = props => (
  <Transition
    {...props}
    timeout={300}
    appear
  >
    {transitionState => (
      <div className={css.calloutRow}>
        <div className={getClassNamefromTransitionState(transitionState, props.type, css.calloutBase, props.transition)} >
          <Icon icon={getIconForType(props.type)} />
          <div className={css.message}>{props.message}</div>
          <Button buttonStyle="transparent slim marginBottom0" onClick={() => props.onDismiss(props.id)}>
            <Icon icon="closeX" color="#777" />
          </Button>
        </div>
      </div>
    )}
  </Transition>
);

CalloutElement.propTypes = propTypes;
CalloutElement.defaultProps = defaultProps;

export default CalloutElement;
