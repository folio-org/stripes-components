import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { FormattedMessage, intlShape } from 'react-intl';

import injectIntl from '../InjectIntl';
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
    clonable: PropTypes.bool,
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
    onClone: PropTypes.func,
    onEdit: PropTypes.func,
    paneSetWidth: PropTypes.string,
    paneTitle: PropTypes.string,
    paneWidth: PropTypes.string.isRequired,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object,
    rowFilter: PropTypes.element,
    rowFilterFunction: PropTypes.func,
    stripes: PropTypes.object,
  };

  static defaultProps = {
    editable: true,
    nameKey: 'name',
    paneSetWidth: 'fill',
  };

  constructor(props) {
    super(props);

    this.activeLink = this.activeLink.bind(this);
    this.linkPath = this.linkPath.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  filteredRows(rows) {
    if (!this.props.rowFilterFunction) {
      return rows;
    }

    return rows.filter(row => this.props.rowFilterFunction(row));
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
      intl: { formatMessage },
      paneWidth,
      detailComponent,
      parentMutator,
      editable,
      clonable,
      parentResources,
    } = this.props;
    const ComponentToRender = detailComponent;
    const actionMenuItems = [];
    const lastMenu = (
      <PaneMenu>
        {editable && <IconButton
          icon="edit"
          onClick={() => this.props.onEdit(item)}
          id="clickable-edit-item"
          ariaLabel="edit"
          title={formatMessage({ id: 'stripes-components.button.edit' })}
          size="medium"
        />
        }
      </PaneMenu>
    );

    if (clonable) {
      actionMenuItems.push({
        label: formatMessage({ id: 'stripes-components.button.duplicate' }),
        onClick: () => this.props.onClone(item),
        id: 'clickable-copy-item',
      });
    }

    return (
      <Pane
        paneTitle={detailPaneTitle}
        actionMenuItems={actionMenuItems}
        lastMenu={lastMenu}
        defaultWidth={paneWidth}
        dismissible
        onClose={this.onClose}
      >
        <ComponentToRender
          {...this.props}
          stripes={stripes}
          parentResources={parentResources}
          initialValues={item}
          parentMutator={parentMutator}
        />
      </Pane>
    );
  }

  render() {
    const {
      addButtonTitle,
      contentData,
      paneTitle,
      nameKey,
      addMenu,
      paneSetWidth
    } = this.props;

    const rows = this.filteredRows(contentData);
    const links = _.sortBy(rows, [record => record[nameKey].toLowerCase()]).map(item => (
      <NavListItem
        key={item.id}
        to={this.linkPath(item.id)}
        onClick={() => this.props.onClick(item)}
      >
        {item[nameKey] || '[unnamed]'}
      </NavListItem>
    ));

    const routes = rows.map(item => (
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
      <Paneset defaultWidth={paneSetWidth}>
        <Pane defaultWidth="fill" lastMenu={LastMenu} paneTitle={paneTitle} noOverflow>
          {this.props.rowFilter}
          <NavList>
            <NavListSection activeLink={this.activeLink(links)} className={contentData.length ? 'hasEntries' : ''}>
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
