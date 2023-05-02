import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { scrollParent } from 'dom-helpers';
// import { isFinite } from 'lodash';
import Layout from '../Layout';
import css from './MCLRenderer.css';


const CenteredContainer = ({ innerRef, visible, width, children, role, style: styleProp }) => {
  const wrappingElement = useRef(innerRef || null);
  const elementWidth = useRef('100%');
  // subtracting the margins to prevent horizontal scroll
  // const endOfListWidth = isFinite(width) ? `${Math.max(width - 20, 200)}px` : '100%';

  const updateWidth = () => {
    if (wrappingElement.current) {
      const sp = scrollParent(wrappingElement.current);
      if (sp) elementWidth.current = `${sp.offsetWidth}px`;
    }
  }

  return (
    <div
      ref={(ref) => { wrappingElement.current = ref; updateWidth(); }}
      className={css.mclCenteredContainer}
      style={
        {
          width: elementWidth.current,
          visibility: `${visible ? 'visible' : 'hidden'}`,
          height: `${visible ? null : 0}`,
          padding: `${visible ? null : 0}`,
          ...styleProp
        }
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
