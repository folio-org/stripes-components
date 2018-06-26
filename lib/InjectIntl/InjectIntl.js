import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

export default function injectIntl(WrappedComponent, options = {}) {
  const { withRef = false } = options;
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class InjectIntl extends Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `InjectIntl(${componentName})`;

    static propTypes = {
      forwardedRef: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
        PropTypes.func,
        PropTypes.object
      ])
    };

    static contextTypes = {
      intl: intlShape
    };

    render() {
      const {
        forwardedRef,
        ...rest
      } = this.props;

      return (
        <WrappedComponent
          {...rest}
          intl={this.context.intl}
          ref={withRef ? forwardedRef : null}
        />
      );
    }
  }

  function forward(props, ref) {
    return <InjectIntl forwardedRef={ref} {...props} />;
  }

  forward.displayName = componentName;

  if (withRef) {
    return forwardRef(forward);
  }
  return forward;
}
