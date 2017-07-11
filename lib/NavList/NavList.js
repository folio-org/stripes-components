import React from 'react';
import PropTypes from 'prop-types';
import css from '../NavListSection/NavListSection.css';

const propTypes = {
  children: PropTypes.element,
};

class NavList extends React.Component {
  constructor(props) {
    super(props);

    this.nav = null;
    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }

  handleNavigationClick(e) {
    const activeLink = this.nav.querySelector(`.${css.active}`);
    activeLink ? activeLink.classList.remove(css.active) : null;
    e.target.classList.add(css.active);
  }

  render() {
    return (
      <nav ref={(ref) => { this.nav = ref; }} onClick={this.handleNavigationClick}>
        {this.props.children}
      </nav>
    );
  }
}

export default NavList;
