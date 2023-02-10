import React from 'react';
import PropTypes from 'prop-types';
import { isFinite } from 'lodash';
import Layout from '../Layout';
import css from './MCLRenderer.css';

const CenteredContainer = ({ innerRef, visible, width, children, role, style: styleProp }) => {
  // subtracting the margins to prevent horizontal scroll
  const endOfListWidth = isFinite(width) ? `${Math.max(width - 20, 200)}px` : '100%';

  return (
    <div
      ref={innerRef}
      className={css.mclCenteredContainer}
      style={
        { width: endOfListWidth,
          visibility: `${visible ? 'visible' : 'hidden'}`,
          height: `${visible ? null : 0}`,
          padding: `${visible ? null : 0}`,
          ...styleProp }
        }
      role={role}
    >
      <Layout className="textCentered">
        {children}
      </Layout>
    </div>
  );
};

CenteredContainer.propTypes = {
  children: PropTypes.node,
  innerRef: PropTypes.object,
  role: PropTypes.string,
  style: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.number,
};

export default CenteredContainer;
