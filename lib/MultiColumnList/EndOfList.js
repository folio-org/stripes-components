import React from 'react';
import { FormattedMessage } from 'react-intl';
import Layout from '../Layout';
import Icon from '../Icon';
import css from './MCLRenderer.css';

export default () => {
  // subtracting the margins to prevent horizontal scroll
  return (
    <Layout className={css.mclEndOfList}>
      <Icon icon="end-mark">
        <FormattedMessage id="stripes-components.endOfList" />
      </Icon>
    </Layout>
  );
};
