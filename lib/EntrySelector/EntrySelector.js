import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import IconButton from '@folio/stripes-components/lib/IconButton'; // eslint-disable-line import/no-extraneous-dependencies
import Paneset from '../Paneset';
import Pane from '../Pane';
import PaneMenu from '../PaneMenu';
import Button from '../Button';
import NavList from '../NavList';
import NavListSection from '../NavListSection';

class EntrySelector extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
    children: PropTypes.node,
    addButtonTitle: PropTypes.string,
    addMenu: PropTypes.node,
    detailComponent: PropTypes.func.isRequired,
    detailPaneTitle: PropTypes.string,
    editable: PropTypes.bool,
    paneWidth: PropTypes.string.isRequired,
    paneTitle: PropTypes.string,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onClick: PropTypes.func,
    parentMutator: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentData: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
    nameKey: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    editable: true,
    nameKey: 'name',
  };

  constructor(props) {
    super(props);

    this.activeLink = this.activeLink.bind(this);
    this.linkPath = this.linkPath.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  linkPath(id) {
    return `${this.props.match.path}/${id}`;
  }

  activeLink(links) {
    return this.props.location.pathname || this.linkPath(links[0].key);
  }

  onClose() {
    this.props.history.push(`${this.props.match.path}`);
  }

  onClick(item) {
    if (this.props.onClick) {
      this.props.onClick(item);
    }
  }

  renderDetail(item) {
    const { detailPaneTitle, stripes, paneWidth, detailComponent, parentMutator, editable } = this.props;
    const ComponentToRender = detailComponent;
    const lastMenu = (
      <IconButton
        icon="edit"
        onClick={() => this.props.onEdit(item)}
        id="clickable-edit-item"
        ariaLabel="edit"
        title={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.edit' })}
        size="medium"
      />
    );

    return (
      <Pane
        paneTitle={detailPaneTitle}
        {...editable ? { lastMenu } : {}}
        defaultWidth={paneWidth}
        dismissible
        onClose={this.onClose}
      >
        <ComponentToRender stripes={stripes} initialValues={item} parentMutator={parentMutator} />
      </Pane>
    );
  }

  render() {
    const { addButtonTitle, contentData, paneTitle, nameKey, addMenu } = this.props;
    const links = _.sortBy(contentData, [nameKey]).map(item => (
      <Link key={item.id} to={this.linkPath(item.id)} onClick={() => this.props.onClick(item)}>{item[nameKey] || '[unnamed]'}</Link>
    ));

    const routes = contentData.map(item => (
      <Route
        key={item.id}
        path={this.linkPath(item.id)}
        render={() => this.renderDetail(item)}
      />
    ));

    const LastMenu = addMenu || (
      <PaneMenu>
        <Button title={addButtonTitle} onClick={this.props.onAdd} buttonStyle="primary paneHeaderNewButton">
          {this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.new' })}
        </Button>
      </PaneMenu>
    );

    return (
      <Paneset>
        <Pane defaultWidth="fill" lastMenu={LastMenu} paneTitle={paneTitle} noOverflow>
          <NavList>
            <NavListSection activeLink={this.activeLink(links)}>
              {links}
            </NavListSection>
          </NavList>
        </Pane>

        <Switch>
          {routes}
        </Switch>

        {this.props.children}
      </Paneset>
    );
  }
}

export default EntrySelector;
