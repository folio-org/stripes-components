import React from 'react';
import PropTypes from 'prop-types';
import css from './NavListSection.css';

const propTypes = {
  label: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      moduleName: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
  activeLink: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function NavListSection(props) {

  const links = React.Children.map(props.children,
    function (child) {
      let newProps = {};
      // Match the link destination of either <Link to="x"> or <a href="x">
      if (props.activeLink === child.props.to ||
          props.activeLink === child.props.href) {
        newProps.className = css.active;
      }
      let elemProps = Object.assign({}, newProps, child.props);
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

NavListSection.propTypes= propTypes;

export default NavListSection;
