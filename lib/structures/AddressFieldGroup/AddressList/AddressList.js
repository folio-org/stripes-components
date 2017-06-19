import React from 'react';
import _ from 'lodash';

import AddressView from '../AddressView';
import AddressEdit from '../AddressEdit';
import Button from '../../../Button';
import { Row, Col } from '../../../LayoutGrid';
import Layout from '../../../Layout';
import Icon from '../../../Icon';

const propTypes = {

  /**
   *  Array of address objects with properties: id, country, addressLine1, addressLine2, city, stateRegion, zipCode....
   */
  addresses: React.PropTypes.arrayOf(React.PropTypes.object),

  /**
   *  Address Editing Privilege/Switch....
   */
  canEdit: React.PropTypes.bool,

  /**
   *  Address Deletion Privilege/Switch....
   */
  canDelete: React.PropTypes.bool,

  /**
   *  in case the unique identifier is something besides 'id' - defaults to 'id'
   */
  uniqueField: React.PropTypes.string,

  /**
   *  Displays a custom <h2> tag at top of listing. Default: 'Address'
   */
  sectionLabel: React.PropTypes.string,

  /**
   *  callback for new address record creation... should accept address object...
   */
  onCreate: React.PropTypes.func,

  /**
   *  callback for saving record... should accept address object...
   */
  onUpdate: React.PropTypes.func,

  /**
   *  callback for deleting record... should accept id or unique identifier...
   */
  onDelete: React.PropTypes.func,
  /**
   *  boolean for default to show all addresses or only show primary (defaults to false(primary Only));
   *  Toggleable by the 'show alternate addresses' button below the list...(appears if more than 1 address is stored)
   */
  showAll: React.PropTypes.bool,

  /**
   * object to match field names with custom labels for UI rendering.
   */
  labelMap: React.PropTypes.object,

  /**
   * fields from Address objects to render to the body of the display/form. Also specifies the order of fields. Header field is not included.
   */
  visibleFields: React.PropTypes.array,

  /**
   * header formatter in both view mode and edit mode. in view mode, it's a formatter in the form of
   *  (addressObject) => addressObject[addressProperty] - so it's possible to render a user-provided name or some other field of address info...
   *  for edit mode, a <Field> component can be passed with all of its necessary props.
   */
  headerFormatter: React.PropTypes.shape({
    view: React.PropTypes.func,
    edit: React.PropTypes.func,
  }),

  /**
   * maps field names to rendered components for edit mode.
   * ex { city:Select } will render a select dropdown for the city field.
   * components are passed through the redux-form Field component.
   */
  fieldComponents: React.PropTypes.object,
};

const defaultProps = {
  uniqueField: 'id',
  sectionLabel: 'Address',
};

class AddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newAddresses: [],
      editting: [],
      focusTarget: '',
      expanded: false,
    };

    this.container = null;

    this.handleCancelNew = this.handleCancelNew.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
    this.handleDeleteEdit = this.handleDeleteEdit.bind(this);
    this.onToggleExpansion = this.onToggleExpansion.bind(this);
  }

  componentWillMount() {
    this.setState({
      expanded: this.props.showAll,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focusTarget !== this.state.focusTarget) {
      if (typeof this.state.focusTarget === 'string') {
        const elem = document.getElementById(`addressEdit-${this.state.focusTarget}`).querySelector('input', 'select');
        if (elem) elem.focus();
      } else {  // can be set to an element - in this case, focus directly...
        this.state.focusTarget.focus();
      }
    }
  }

  onToggleExpansion() {
    const curExpanded = this.state.expanded;
    this.setState({
      expanded: !curExpanded,
    });
  }

  handleCancelNew(uiId) {
    const tempNew = this.state.newAddresses;
    const ind = tempNew.indexOf(uiId);
    if (ind !== -1) {
      tempNew.splice(ind, 1);
    }
    this.setState({
      newAddresses: tempNew,
      focusTarget: this.container,
    });
  }

  handleCancelEdit(uiId) {
    const tempEditting = this.state.editting;
    const ind = tempEditting.indexOf(uiId);
    if (ind !== -1) {
      tempEditting.splice(ind, 1);
    }
    this.setState({
      editting: tempEditting,
      focusTarget: this.container,
    });
  }

  handleEdit(uiId) {
    const tempEditting = this.state.editting;
    tempEditting.push(uiId);
    this.setState({
      editting: tempEditting,
      focusTarget: uiId,
    });
  }

  handleAddNew() {
    const newAdds = this.state.newAddresses;
    const newUiId = _.uniqueId();
    newAdds.push(newUiId);
    this.setState({
      newAddresses: newAdds,
      focusTarget: newUiId,
    });
  }

  handleSubmitEdit(values) {
    const tempEditting = this.state.editting;
    const ind = tempEditting.indexOf(values.id);
    tempEditting.splice(ind, 1);
    this.setState({
      editting: tempEditting,
      focusTarget: this.container,
    });
    delete values.guiid;
    this.props.onUpdate(values);
  }

  handleSubmitNew(values) {
    const tempNew = this.state.newAddresses;
    const ind = tempNew.indexOf(values.guiid);
    tempNew.splice(ind, 1);
    this.setState({
      newAddresses: tempNew,
      focusTarget: this.container,
    });
    delete values.guiid;
    this.props.onCreate(values);
  }

  handleDeleteEdit(uiId) {
    this.props.onDelete(uiId);
    this.setState({
      focusTarget: this.container,
    });
  }

  render() {
    const { addresses, uniqueField, sectionLabel, canDelete, canEdit, headerFormatter, ...viewProps } = this.props;
    const canToggleExpansion = (addresses.length > 1);
    const filteredAddresses = (this.state.expanded) ? addresses : _.take(addresses, 1);

    const addressBlocks = filteredAddresses.map((ad) => {
      if (this.state.editting.indexOf(ad[uniqueField]) === -1) {
        return (<AddressView key={ad[uniqueField]} headerFormatter={headerFormatter ? headerFormatter.view : undefined} handleEdit={this.handleEdit} uiId={ad[uniqueField]} addressObject={ad} canEdit={canEdit} {...viewProps} />);
      }

      return (<AddressEdit form={`addressForm-${ad[uniqueField]}`} key={ad[uniqueField]} headerComponent={headerFormatter ? headerFormatter.edit : undefined} addressObject={ad} handleCancel={this.handleCancelEdit} handleDelete={this.handleDeleteEdit} uiId={ad[uniqueField]} initialValues={ad} onSubmit={this.handleSubmitEdit} canDelete={canDelete} {...viewProps} />);
    });

    const newAddressBlocks = this.state.newAddresses.map(ad =>
      (<AddressEdit form={`addressForm-new-${ad}`} key={ad} addressObject={ad} headerComponent={headerFormatter ? headerFormatter.edit : undefined} handleCancel={this.handleCancelNew} uiId={ad} initialValues={{ guiid: ad }} onSubmit={this.handleSubmitNew} prevFocused={document.activeElement} />);
    );

    return (
      <div aria-label="Address Section" tabIndex="0" ref={ref => (this.container = ref)}>
        <Row>
          <Col xs={8}>
            <h2 style={{ marginTop: 0 }}>{sectionLabel}</h2>
          </Col>
          <Col xs={4}>
            <Layout className="right"><Button onClick={this.handleAddNew}>+ Add address</Button></Layout>
          </Col>
        </Row>
        <Layout className="indent">
          { addressBlocks }
          { newAddressBlocks }
        </Layout>
        { canToggleExpansion &&
          <div style={{ marginTop: '8px' }}>
            <Row>
              <Col xs={12}>
                <Button fullWidth buttonStyle="secondary noRadius" onClick={this.onToggleExpansion}>{(!this.state.expanded && <Layout className="flex centerContent"><Icon icon="down-arrow" />Show more addresses ({addresses.length - 1})</Layout>) || <Layout className="flex centerContent"><Icon icon="up-arrow" />Show less </Layout>}</Button>
              </Col>
            </Row>
          </div>
        }
      </div>
    );
  }
}

AddressList.propTypes = propTypes;
AddressList.defaultProps = defaultProps;

export default AddressList;
