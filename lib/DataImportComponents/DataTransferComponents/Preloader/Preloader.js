import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  Loading,
  Layout,
// } from '@folio/stripes/components';
} from '../../../..';

export const Preloader = memo(({
  message,
  size,
  preloaderClassName,
}) => (
  <Layout
    className={classNames('flex', 'centerContent', preloaderClassName)}
    data-test-preloader
    data-testid="preloader"
  >
    {message}
    <Loading size={size} />
  </Layout>
));

Preloader.propTypes = {
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  preloaderClassName: PropTypes.string,
};

Preloader.defaultProps = { size: 'large' };
