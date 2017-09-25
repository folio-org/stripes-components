import React from 'react';
import PropTypes from 'prop-types';
import css from './NavListSection.css';

const propTypes = {
  label: PropTypes.string,
  activeLink: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function NavListSection(props) {
  const links = React.Children.map(props.children,
    (child) => {
      if (child === null) return null;
      const newProps = {};
      // Match the link destination of either <Link to="x"> or <a href="x">
      if (props.activeLink === child.props.to ||
          props.activeLink === child.props.href || 
          props.activeLink === child.props.name // used by <Buttons>
        ) {
        newProps.className = css.active;
      }
      const elemProps = Object.assign({}, newProps, child.props);
      return React.cloneElement(child, elemProps, child.props.children);
    },
  );
  return (
    <div>
      <div className={css.listTopLabel}>{props.label}</div>
      <nav className={css.listRoot}>
        {links}
      </nav>
    </div>
  );
}

NavListSection.propTypes = propTypes;

export default NavListSection;
