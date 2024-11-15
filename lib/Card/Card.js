import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import omitProps from '../../util/omitProps';

import css from './Card.css';
import DefaultCardHeader from './headers/DefaultCardHeader';
import StripesOverlayWrapper from '../../util/StripesOverlayWrapper';

export default class Card extends React.Component {
  static propTypes = {
    bodyClass: PropTypes.string,
    cardClass: PropTypes.string,
    cardStyle: PropTypes.oneOf([
      'default',
      'negative',
      'positive',
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,

    headerClass: PropTypes.string,
    headerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]),
    headerEnd: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    headerProps: PropTypes.object,
    headerStart: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    marginBottom0: PropTypes.bool,
    roundedBorder: PropTypes.bool,
  }

  static defaultProps = {
    cardStyle: 'default',
    headerComponent: DefaultCardHeader,
  }

  getCardStyle = () => {
    return className(
      css.card,
      css[this.props.cardStyle],
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.roundedBorder}`]: this.props.roundedBorder },
      this.props.cardClass,
    );
  }

  render() {
    const {
      bodyClass,
      headerComponent: HeaderComponent,
      children
    } = this.props;

    const customProps = omitProps(this.props, [
      'bodyClass',
      'cardClass',
      'cardStyle',
      'children',
      'headerClass',
      'headerComponent',
      'headerEnd',
      'headerProps',
      'headerStart',
      'marginBottom0',
      'roundedBorder',
    ]);

    return (
      <StripesOverlayWrapper>
        <div
          className={this.getCardStyle()}
          {...customProps}
        >
          <HeaderComponent {...this.props} />
          <div
            data-test-card-body
            className={`${css.body} ${bodyClass || ''}`}
          >
            {children}
          </div>
        </div>
      </StripesOverlayWrapper>
    );
  }
}
