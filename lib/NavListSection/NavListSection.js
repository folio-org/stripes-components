import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import css from './NavListSection.css';

const propTypes = {
  activeLink: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  label: PropTypes.node,
};

function NavListSection(props) {
  const links = props.activeLink ? React.Children.map(props.children,
    (child) => {
      if (child === null) return null;
      const newProps = {};

      // Match the link destination of either <Link to="x"> or <a href="x">
      if (props.activeLink === child.props.to ||
        props.activeLink === child.props.href ||
        props.activeLink === child.props.name // used by <Buttons>
      ) {
        newProps.isActive = true;
      }
      const elemProps = Object.assign({}, child.props, newProps);
      return React.cloneElement(child, elemProps, child.props.children);
    }) : props.children;
  return (
    <div className={classnames(css.root, props.className)}>
      {props.label && (
        <div className={css.header}>
          <Headline className={css.label}>
            {props.label}
          </Headline>
        </div>
      )}
      <div className={css.content}>
        {links}
      </div>
    </div>
  );
}

NavListSection.propTypes = propTypes;

export default NavListSection;
