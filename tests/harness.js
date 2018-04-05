import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from 'react-apollo';
import { connect, Provider as ReduxProvider } from 'react-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import Router from 'react-router-dom/Router';
import Pretender from 'pretender';
import serverConfig from './server.conf';

import { okapi, config, metadata } from 'stripes-config';
import connectErrorEpic from '@folio/stripes-core/src/connectErrorEpic';
import configureEpics from '@folio/stripes-core/src/configureEpics';
import configureLogger from '@folio/stripes-core/src/configureLogger';
import configureStore from '@folio/stripes-core/src/configureStore';
import { discoverServices } from '@folio/stripes-core/src/discoverServices';
import { loadTranslations } from '@folio/stripes-core/src/loginServices';
import { setSinglePlugin, setBindings, setOkapiToken, setTimezone } from '@folio/stripes-core/src/okapiActions';
import { formatDate, formatTime, formatDateTime } from '@folio/stripes-core/util/dateUtil';
import createApolloClient from '@folio/stripes-core/src/createApolloClient';
import gatherActions from '@folio/stripes-core/src/gatherActions';
import Stripes from '@folio/stripes-core/src/Stripes';

import MainContainer from '@folio/stripes-core/src/components/MainContainer';

/**
 * This root component initializes a Stripes instance, then wraps the
 * children in a router and container, nested within providers for
 * apollo, intl, and redux.
 */
class Root extends Component {
  static defaultProps = {
    history: createMemoryHistory(),
    locale: 'en-US',
    timezone: 'UTC'
  };

  static childContextTypes = {
    stripes: PropTypes.object
  };

  constructor(props) {
    super(props);

    let {
      logger,
      store,
      epics,
      config,
      actionNames,
      token,
      currentUser,
      currentPerms,
      locale,
      timezone,
      plugins,
      bindings,
      discovery,
      translations,
      history,
      children
    } = props;

    this.stripes = new Stripes({
      logger,
      store,
      okapi,
      epics,
      config,
      metadata,
      actionNames,
      locale,
      timezone,
      bindings,
      discovery,
      plugins: plugins || {},
      withOkapi: !okapi.withoutOkapi,
      user: {
        user: currentUser,
        perms: currentPerms
      },
      setToken: (val) => store.dispatch(setOkapiToken(val)),
      setLocale: (localeValue) => loadTranslations(store, localeValue),
      setTimezone: (timezoneValue) => store.dispatch(setTimezone(timezoneValue)),
      setSinglePlugin: (key, value) => store.dispatch(setSinglePlugin(key, value)),
      formatDate: (dateStr, zone) => formatDate(dateStr, zone || timezone),
      formatTime: (dateStr, zone) => formatTime(dateStr, zone || timezone),
      formatDateTime: (dateStr, zone) => formatDateTime(dateStr, zone || timezone),
      setBindings: (val) => store.dispatch(setBindings(val)),
      connect: (X) => X
    });
  }

  getChildContext() {
    return { stripes: this.stripes };
  }

  render() {
    let { okapi, locale, translations, history, children } = this.props;

    return (
      <ApolloProvider client={createApolloClient(okapi)}>
        <IntlProvider locale={locale} key={locale} messages={translations}>
          <ReduxProvider store={this.stripes.store}>
            <Router history={history}>
              <MainContainer>
                {children}
              </MainContainer>
            </Router>
          </ReduxProvider>
        </IntlProvider>
      </ApolloProvider>
    );
  }
}

Root = connect((state) => ({
  token: state.okapi.token,
  currentUser: state.okapi.currentUser,
  currentPerms: state.okapi.currentPerms,
  locale: state.okapi.locale,
  timezone: state.okapi.timezone,
  translations: state.okapi.translations,
  plugins: state.okapi.plugins,
  bindings: state.okapi.bindings,
  discovery: state.discovery,
  okapiReady: state.okapi.okapiReady,
  serverDown: state.okapi.serverDown,
  okapi: state.okapi
}))(Root);

/**
 * This is the testing harness that acts as the index file in
 * stripes-core. It will pass any given props down to the root
 * component above.
 */
export default class Harness extends Component {
  logger = configureLogger(config);
  epics = configureEpics(connectErrorEpic);
  store = configureStore({ okapi }, this.logger, this.epics);
  server = new Pretender(serverConfig);
  actionNames = gatherActions();

  componentDidMount() {
    if (!okapi.withoutOkapi) {
      discoverServices(this.store);
    }
  }

  componentWillUnmount() {
    this.server.shutdown();
  }

  render() {
    return (
      <Root
        config={config}
        store={this.store}
        epics={this.epics}
        logger={this.logger}
        actionNames={this.actionNames}
        {...this.props}
        />
    );
  }
}
