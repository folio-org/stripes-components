import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import css from './DefaultCardHeader.css';

export default class DefaultCardHeader extends React.Component {
  static propTypes = {
    cardStyle: PropTypes.oneOf([
      'default',
      'negative',
      'positive',
    ]),
    headerClass: PropTypes.string,
    headerEnd: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    headerProps: PropTypes.object,
    headerStart: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
  }

  static defaultProps = {
    headerProps: {},
  }

  getHeaderStyle = () => {
    return className(
      css.header,
      css[this.props.cardStyle],
      this.props.headerClass,
    );
  }

  render() {
    const { headerEnd, headerProps, headerStart } = this.props;

    return (
      <div
        className={this.getHeaderStyle()}
        data-test-card-header
        {...headerProps}
      >
        <span
          className={css.headerStart}
          data-test-card-header-start
        >
          {headerStart}
        </span>
        {headerEnd && <span data-test-card-header-end>{headerEnd}</span>}
      </div>
    );
  }
}
