import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import scrollParent from '../../util/getScrollParent';
import Layout from '../Layout';
import css from './MCLRenderer.css';

const CenteredContainer = ({ innerRef, visible, width, children, role, style: styleProp }) => {
  const wrappingElement = useRef(innerRef || null);

  useLayoutEffect(() => {
    if (wrappingElement.current) {
      const sp = scrollParent(wrappingElement.current);
      if (sp) {
        wrappingElement.current.style.width = `${sp.offsetWidth}px`;
      }
    }
  });

  return (
    <div
      ref={wrappingElement}
      className={css.mclCenteredContainer}
      style={
        {
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
