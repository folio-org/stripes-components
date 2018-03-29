import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import Paneset from '../Paneset';
import Pane from '../Pane';
import NavList from '../NavList';
import NavListSection from '../NavListSection';
import IconButton from '../IconButton';

import css from './Settings.css';

class Settings extends React.Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    const stripes = context.stripes;

    this.routes = _.sortBy(props.pages, ['label'])
      .filter(p => !p.perm || stripes.hasPerm(p.perm))
      .map(page => (
        {
          page,
          component: stripes.connect(page.component, { dataKey: page.route }),
        }));
  }

  render() {
    const context = this.context;
    const props = this.props;
    let { activeLink } = this.props;

    const stripes = context.stripes;
    const pages = props.pages;

    if (!activeLink) {
      activeLink = `${props.match.path}/${pages[0].route}`;
    }

    const navLinks = pages.map((p) => {
      const link = `${props.match.path}/${p.route}`;

      if (props.location.pathname.startsWith(link)) activeLink = link;
      if (p.perm && !stripes.hasPerm(p.perm)) return null;
      return <Link key={p.route} to={link}>{p.label}</Link>;
    }).filter(x => x !== null);

    let Saved;
    const routes = this.routes.map((p) => {
      const Current = p.component;
      if (!Saved) Saved = Current;
      return (<Route
        key={p.page.route}
        path={`${props.match.path}/${p.page.route}`}
        render={props2 => <Current {...props2} stripes={stripes} label={p.page.label} />}
      />);
    });

    return (
      <Paneset nested defaultWidth="80%">
        <Pane
          defaultWidth="fill"
          paneTitle={props.paneTitle || 'Module Settings'}
          firstMenu={(
            <Link to="/settings" className={css.settingsBackButton}>
              <IconButton icon="left-arrow" />
            </Link>
          )}
        >
          <NavList>
            <NavListSection activeLink={activeLink}>
              {navLinks}
            </NavListSection>
          </NavList>
        </Pane>

        <Switch>
          {routes}
        </Switch>
      </Paneset>
    );
  }
}

Settings.contextTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

Settings.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      perm: PropTypes.string,
      route: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    }),
  ).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  paneTitle: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  activeLink: PropTypes.string,
};

export default Settings;
