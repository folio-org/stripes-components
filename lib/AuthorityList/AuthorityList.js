import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '../Paneset';
import Pane from '../Pane';
import EditableList from '../structures/EditableList';

class AuthorityList extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      activeRecord: PropTypes.shape({
        update: PropTypes.func,
      }),
      values: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
    visibleFields: PropTypes.arrayOf(
      PropTypes.string,
    ),
    itemTemplate: PropTypes.object,
    nameKey: PropTypes.string,
  };

  static defaultProps = {
    visibleFields: ['name'],
    itemTemplate: { name: 'string' },
    nameKey: undefined,
  };

  static manifest = Object.freeze({
    values: {
      type: 'okapi',
      path: '!{baseUrl}',
      records: '!{records}',
      PUT: {
        path: '!{baseUrl}/%{activeRecord.id}',
      },
      DELETE: {
        path: '!{baseUrl}/%{activeRecord.id}',
      },
    },
    activeRecord: {},
  });

  constructor(props) {
    super(props);

    this.state = {};

    this.onCreateType = this.onCreateType.bind(this);
    this.onUpdateType = this.onUpdateType.bind(this);
    this.onDeleteType = this.onDeleteType.bind(this);
  }

  onCreateType(type) {
    console.log('ui-items - settings - onCreateType called');
    this.props.mutator.values.POST(type);
  }

  onUpdateType(type) {
    console.log('ui-items - settings - onUpdateType called');
    this.props.mutator.activeRecord.update({ id: type.id });
    this.props.mutator.values.PUT(type);
  }

  onDeleteType(typeId) {
    console.log('ui-items - settings - onDeleteType called');
    this.props.mutator.activeRecord.update({ id: typeId });
    this.props.mutator.values.DELETE(this.props.data.values.find(t => t.id === typeId));
  }

  render() {
    const suppressor = {
      // If a suppressor returns true, the control for that action will not appear
      delete: () => true,
      edit: () => false,
    };

    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
          <EditableList
            // TODO: not sure why we need this OR if there are no groups
            // Seems to load this once before the groups data from the manifest
            // is pulled in. This still causes a JS warning, but not an error
            contentData={this.props.data.values || []}
            createButtonLabel="+ Add type"
            visibleFields={this.props.visibleFields}
            itemTemplate={this.props.itemTemplate}
            actionSuppression={suppressor}
            onUpdate={this.onUpdateType}
            onCreate={this.onCreateType}
            onDelete={this.onDeleteType}
            isEmptyMessage={`There are no ${this.props.label}`}
            nameKey={this.props.nameKey}
          />
        </Pane>
      </Paneset>
    );
  }

}

export default AuthorityList;
