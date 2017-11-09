import React from 'react';
import css from './LayoutBox.css';

const LayoutBox = (props) => (
  <div className={css.sectionBox}>
    {props.children}
  </div>
);

export default LayoutBox;