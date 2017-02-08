import React from 'react';
import css from './NavListSection.css';

const propTypes = {
  label: React.PropTypes.string,
  navItems: React.PropTypes.arrayOf(React.PropTypes.shape({moduleName: React.PropTypes.string, href: React.PropTypes.string}))
}

class NavListSection extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <div>
        <div className={css.listTopLabel}>{this.props.label}</div>
        <nav className={css.listRoot}>
          {this.props.children}
        </nav>
      </div>
    )
  }
}

export default NavListSection;

