import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

export default function injectIntl(WrappedComponent, options = {}) {
  const { withRef = false } = options;

  class InjectIntl extends Component {
    static WrappedComponent = WrappedComponent;

    static propTypes = {
      forwardedRef: PropTypes.element
    };

    static contextTypes = {
      intl: intlShape
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          intl={this.context.intl}
          ref={withRef ? this.props.forwardedRef : null}
        />
      );
    }
  }

  return forwardRef((props, ref) => {
    return (
      <InjectIntl {...props} forwardedRef={ref} />
    );
  });
}
