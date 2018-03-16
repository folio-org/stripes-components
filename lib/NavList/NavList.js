import React from 'react';
import PropTypes from 'prop-types';
import css from '../NavListSection/NavListSection.css';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

class NavList extends React.Component {
  constructor(props) {
    super(props);

    this.nav = null;
    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }

  handleNavigationClick(e) {
    const activeLink = this.nav.querySelector(`.${css.active}`);
    if (activeLink) {
      activeLink.classList.remove(css.active);
    }
    e.target.classList.add(css.active);
  }

  render() {
    return (
      <nav className={this.props.className}>
        <div ref={(ref) => { this.nav = ref; }} onClick={this.handleNavigationClick} role="presentation">
          {this.props.children}
        </div>
      </nav>
    );
  }
}

NavList.propTypes = propTypes;

export default NavList;
