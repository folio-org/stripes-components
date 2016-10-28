import React from 'react';
import css from './PaneMenu.css';

function PaneMenu(props){
  return(
    <div className={css.paneMenu}>{props.children}</div>
  );
};

export default PaneMenu;


