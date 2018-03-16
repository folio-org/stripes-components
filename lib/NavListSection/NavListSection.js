import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import css from './NavListSection.css';

const propTypes = {
  label: PropTypes.string,
  stripped: PropTypes.bool,
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
      let className = classnames(css.navListSectionItem, child.props.className);

      // Match the link destination of either <Link to="x"> or <a href="x">
      if (props.activeLink === child.props.to ||
          props.activeLink === child.props.href ||
          props.activeLink === child.props.name // used by <Buttons>
      ) {
        className = classnames(className, css.active);
      }
      const elemProps = Object.assign({}, child.props, { className });
      return React.cloneElement(child, elemProps, child.props.children);
    });
  return (
    <div>
      { props.label && (<Headline size="medium" margin="small">{props.label}</Headline>) }
      <nav className={classnames(css.listRoot, { [css.stripped]: props.stripped })}>
        {links}
      </nav>
    </div>
  );
}

NavListSection.propTypes = propTypes;

export default NavListSection;
