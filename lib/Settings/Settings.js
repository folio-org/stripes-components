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

const Settings = (props, context) => {
  const stripes = context.stripes;

  let firstLink;
  const navLinks = _.sortBy(props.pages, ['label']).map((p) => {
    const link = `${props.match.path}/${p.route}`;
    if (!firstLink) firstLink = link;
    if (p.perm && !stripes.hasPerm(p.perm)) return null;
    return <Link key={p.route} to={link}>{p.label}</Link>;
  }).filter(l => l);

  let Saved;
  const routes = props.pages.map((p) => {
    const Current = stripes.connect(p.component);
    if (!Saved) Saved = Current;
    return (<Route
      key={p.route}
      path={`${props.match.path}/${p.route}`}
      render={props2 => <Current {...props2} stripes={stripes} label={p.label} />}
    />);
  });

  return (
    <Paneset nested defaultWidth="80%">
      <Pane defaultWidth="25%" paneTitle="Users">
        <NavList>
          <NavListSection activeLink={firstLink}>
            {navLinks}
          </NavListSection>
        </NavList>
      </Pane>

      <Switch>
        {routes}
        <Route
          key={0}
          path={props.match.path}
          render={props2 => <Saved {...props2} stripes={stripes} label={props.pages[0].label} />}
        />
      </Switch>
    </Paneset>
  );
};

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
};

export default Settings;
