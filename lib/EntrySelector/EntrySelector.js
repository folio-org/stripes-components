import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import IconButton from '../IconButton';
import Paneset from '../Paneset';
import Pane from '../Pane';
import PaneMenu from '../PaneMenu';
import Button from '../Button';
import NavList from '../NavList';
import NavListSection from '../NavListSection';
import NavListItem from '../NavListItem';

class EntrySelector extends React.Component {
  static propTypes = {
    addButtonTitle: PropTypes.string,
    addMenu: PropTypes.node,
    children: PropTypes.node,
    contentData: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
    detailComponent: PropTypes.func.isRequired,
    detailPaneTitle: PropTypes.string,
    editable: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: intlShape.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    nameKey: PropTypes.string,
    onAdd: PropTypes.func,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    paneTitle: PropTypes.string,
    paneWidth: PropTypes.string.isRequired,
    parentMutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
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
    const {
      detailPaneTitle,
      stripes,
      intl,
      paneWidth,
      detailComponent,
      parentMutator,
      editable,
      resources
    } = this.props;
    const ComponentToRender = detailComponent;
    const lastMenu = (
      <IconButton
        icon="edit"
        onClick={() => this.props.onEdit(item)}
        id="clickable-edit-item"
        ariaLabel="edit"
        title={intl.formatMessage({ id: 'stripes-components.button.edit' })}
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
        <ComponentToRender stripes={stripes} parentResources={resources} initialValues={item} parentMutator={parentMutator} />
      </Pane>
    );
  }

  render() {
    const {
      addButtonTitle,
      contentData,
      paneTitle,
      nameKey,
      addMenu
    } = this.props;

    const links = _.sortBy(contentData, [nameKey]).map(item => (
      <NavListItem key={item.id} to={this.linkPath(item.id)} onClick={() => this.props.onClick(item)}>{item[nameKey] || '[unnamed]'}</NavListItem>
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
          <FormattedMessage id="stripes-components.button.new" />
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

export default injectIntl(EntrySelector);
