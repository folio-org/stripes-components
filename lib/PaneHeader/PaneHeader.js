import React from 'react';
import css from './PaneHeader.css';

const propTypes = {
  firstMenu: React.PropTypes.element,
  lastMenu: React.PropTypes.element,
  paneTitle: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
};

class PaneHeader extends React.Component{
  constructor(props){
      super(props);
  }

  render(){
    let headerContent, title, firstMenu, lastMenu;

    if (this.props.header){

      headerContent = <div className={css.paneHeader}>{this.props.header}</div>;

    }else{
      if(typeof(this.props.paneTitle) === 'string'){
          title = <div className={css.paneTitle}>{this.props.paneTitle}</div>;
      }else{
          title = this.props.paneTitle? this.props.paneTitle : <div>&nbsp;</div>;
      };

      firstMenu = this.props.firstMenu? this.props.firstMenu : <div>&nbsp;</div>;
      lastMenu = this.props.lastMenu? this.props.lastMenu : <div>&nbsp;</div>;
      
      headerContent = <div className={css.paneHeader}>
                        {firstMenu} 
                        {title} 
                        {lastMenu}
                      </div>
    }

    return headerContent;
    
  }
}

PaneHeader.propTypes = propTypes;

export default PaneHeader;


