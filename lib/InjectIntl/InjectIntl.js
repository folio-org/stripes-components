import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { intlShape } from 'react-intl';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function injectIntl(WrappedComponent, options = {}) {
  const { intlPropName = 'intl', withRef = false } = options;

  class InjectIntl extends Component {
    static displayName = `InjectIntl(${getDisplayName(WrappedComponent)})`;

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

    static WrappedComponent = WrappedComponent;

    render() {
      const {
        forwardedRef,
        ...rest
      } = this.props;

      return (
        <WrappedComponent
          {...rest}
          {...{ [intlPropName]: this.context.intl }}
          ref={withRef ? forwardedRef : null}
        />
      );
    }
  }

  if (withRef) {
    const ForwardedComponent = forwardRef((props, ref) => {
      return <InjectIntl {...props} forwardedRef={ref} />;
    });

    ForwardedComponent.displayName = `${InjectIntl.displayName}`;
    return hoistNonReactStatics(ForwardedComponent, InjectIntl);
  }

  return hoistNonReactStatics(InjectIntl, WrappedComponent);
}
