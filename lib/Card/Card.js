import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import omitProps from '../../util/omitProps';

import css from './Card.css';

export default class Card extends React.Component {
  static propTypes = {
    bodyClass: PropTypes.string,
    bottomMargin0: PropTypes.bool,
    cardClass: PropTypes.string,
    cardStyle: PropTypes.oneOf([
      'default',
      'lookupEmpty',
      'lookupPreview',
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    headerClass: PropTypes.string,
    headerEnd: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    headerStart: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
  }

  static defaultProps = {
    cardStyle: 'default',
  }

  getCardStyle = () => {
    return className(
      css.card,
      css[this.props.cardStyle],
      { [`${css.marginBottom0}`]: this.props.bottomMargin0 },
      this.props.cardClass,
    );
  }

  getBodyStyle = () => {
    return className(
      css.body,
      css[this.props.cardStyle],
      this.props.bodyClass,
    );
  }

  getHeaderStyle = () => {
    return className(
      css.header,
      css[this.props.cardStyle],
      this.props.headerClass,
    );
  }

  render() {
    const { children, headerEnd, headerStart } = this.props;

    const customProps = omitProps(this.props, [
      'bodyClass',
      'bottomMargin0',
      'cardClass',
      'cardStyle',
      'children',
      'headerEnd',
      'headerClass',
      'headerStart',
    ]);

    return (
      <div
        className={this.getCardStyle()}
        {...customProps}
      >
        <div
          className={this.getHeaderStyle()}
          data-test-card-header
        >
          <span data-test-card-header-start>
            {headerStart}
          </span>
          {headerEnd && (
            <span
              className={css.headerEnd}
              data-test-card-header-end
            >
              {headerEnd}
            </span>
          )}
        </div>
        <div
          data-test-card-body
          className={this.getBodyStyle()}
        >
          {children}
        </div>
      </div>
    );
  }
}
