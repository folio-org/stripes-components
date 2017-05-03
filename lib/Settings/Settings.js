// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import NavList from '@folio/stripes-components/lib/NavList';
import NavListSection from '@folio/stripes-components/lib/NavListSection';

const Settings = (props) => {
  const stripes = props.stripes;

  const navLinks = props.pages.map((p) => {
    if (p.perm && !stripes.hasPerm(p.perm)) return null;
    return (
      <Link
        key={p.route}
        to={`${props.match.path}/${p.route}`}
      >{p.label}</Link>
    );
  }).filter(l => l);

  const routes = props.pages.map((p) => {
    const Current = stripes.connect(p.component);
    return (<Route
      key={p.route}
      path={`${props.match.path}/${p.route}`}
      render={props2 => <Current {...props2} stripes={stripes} />}
    />);
  });

  return (
    <Paneset nested defaultWidth="80%">
      <Pane defaultWidth="25%" paneTitle="Users">
        <NavList>
          <NavListSection activeLink="">
            {navLinks}
          </NavListSection>
        </NavList>
      </Pane>

      <Switch>
        {routes}
        <Route component={() => <div>Choose category</div>} />
      </Switch>
    </Paneset>
  );
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
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default Settings;
