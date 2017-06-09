import React from 'react';
import css from './NavListSection.css';

const propTypes = {
  label: React.PropTypes.string,
  navItems: React.PropTypes.arrayOf(React.PropTypes.shape({moduleName: React.PropTypes.string, href: React.PropTypes.string})),
  activeLink: React.PropTypes.string,
}

function NavListSection(props){

  const links = React.Children.map(props.children, 
    function(child){
      let newProps = {};
      // Match the link destination of either <Link to="x"> or <a href="x">
      if (props.activeLink === child.props.to ||
          props.activeLink === child.props.href) {
        newProps.className = css.active;
      }
      let elemProps = Object.assign({}, newProps, child.props,);
      return React.cloneElement(child, elemProps, child.props.children);
    }
  );
  return (
    <div>
      <div className={css.listTopLabel}>{props.label}</div>
      <nav className={css.listRoot}>
        {links}
      </nav>
    </div>
  )
  
}

export default NavListSection;

