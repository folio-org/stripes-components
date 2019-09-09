import React from 'react';
import PropTypes from 'prop-types';
import { isFinite } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Layout from '../Layout';
import Icon from '../Icon';
import css from './MCLRenderer.css';

export default class EndOfList extends React.Component {
  static propTypes = {
    innerRef: PropTypes.object,
    visible: PropTypes.bool,
    width: PropTypes.number,
  }

  render() {
    const {
      width,
      innerRef,
      visible,
    } = this.props;

    // subtracting the margins to prevent horizontal scroll
    const endOfListWidth = isFinite(width) ? `${Math.max(width, 200)}px` : '100%';

    return (
      <div
        key="end-of-list"
        ref={innerRef}
        className={css.mclEndOfList}
        style={
          { width: endOfListWidth,
            visibility: `${visible ? 'visible' : 'hidden'}`,
            height: `${visible ? null : 0}`,
            padding: `${visible ? null : 0}` }
          }
      >
        <Layout className="textCentered">
          <Icon icon="end-mark">
            <FormattedMessage id="stripes-components.endOfList" />
          </Icon>
        </Layout>
      </div>
    );
  }
}
