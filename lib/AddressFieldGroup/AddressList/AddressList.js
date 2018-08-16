import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import _ from 'lodash';

import injectIntl from '../../InjectIntl';
import AddressView from '../AddressView';
import AddressEdit from '../AddressEdit';
import Button from '../../Button';
import { Row, Col } from '../../LayoutGrid';
import Layout from '../../Layout';
import Icon from '../../Icon';
import Headline from '../../Headline';

const propTypes = {
  /**
   *  Array of address objects with properties: id, country, addressLine1, addressLine2, city, stateRegion, zipCode....
   */
  addresses: PropTypes.arrayOf(PropTypes.object),

  /**
   *  Address Deletion Privilege/Switch....
   */
  canDelete: PropTypes.bool,

  /**
   *  Address Editing Privilege/Switch....
   */
  canEdit: PropTypes.bool,

  displayHeading: PropTypes.bool,

  /**
   * maps field names to rendered components for edit mode.
   * ex { city:Select } will render a select dropdown for the city field.
   * components are passed through the redux-form Field component.
   */
  fieldComponents: PropTypes.object,

  /**
   * header formatter in both view mode and edit mode. in view mode, it's a formatter in the form of
   *  (addressObject) => addressObject[addressProperty] - so it's possible to render a user-provided
   *  name or some other field of address info...
   *  for edit mode, a <Field> component can be passed with all of its necessary props.
   */
  headerFormatter: PropTypes.shape({
    edit: PropTypes.func,
    view: PropTypes.func,
  }),

  intl: intlShape.isRequired,

  /**
   *  Displays a custom <h2> tag at top of listing. Default: 'Address'
   */
  label: PropTypes.string,

  /**
   * object to match field names with custom labels for UI rendering.
   */
  labelMap: PropTypes.object,

  /**
   *  callback for new address record creation... should accept address object...
   */
  onCreate: PropTypes.func,

  /**
   *  callback for deleting record... should accept id or unique identifier...
   */
  onDelete: PropTypes.func,

  /**
   *  callback for saving record... should accept address object...
   */
  onUpdate: PropTypes.func,

  sectionLabel: PropTypes.string,

  /**
   *  boolean for default to show all addresses or only show primary (defaults to false(primary Only));
   *  Toggleable by the 'show alternate addresses' button below the list...(appears if more than 1 address is stored)
   */
  showAll: PropTypes.bool,

  /**
   *  in case the unique identifier is something besides 'id' - defaults to 'id'
   */
  uniqueField: PropTypes.string,

  /**
   * fields from Address objects to render to the body of the display/form. Also specifies the order of fields.
   * Header field is not included.
   */
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  displayHeading: true,
  sectionLabel: 'Address',
  uniqueField: 'id',
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

  componentWillMount() { // eslint-disable-line react/no-deprecated
    this.setState({
      expanded: this.props.showAll,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.focusTarget) return;

    if (prevState.focusTarget !== this.state.focusTarget) {
      if (typeof this.state.focusTarget === 'string') {
        const elem = document.getElementById(`addressEdit-${this.state.focusTarget}`).querySelector('input', 'select');
        if (elem) elem.focus();
      } else { // can be set to an element - in this case, focus directly...
        this.state.focusTarget.focus();
      }
    }
  }

  onToggleExpansion() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  handleCancelNew(uiId) {
    this.setState(prevState => {
      const tempNew = prevState.newAddresses;
      const ind = tempNew.indexOf(uiId);
      if (ind !== -1) {
        tempNew.splice(ind, 1);
      }
      return {
        newAddresses: tempNew,
        focusTarget: this.container,
      };
    });
  }

  handleCancelEdit(uiId) {
    this.setState(prevState => {
      const tempEditting = prevState.editting;
      const ind = tempEditting.indexOf(uiId);
      if (ind !== -1) {
        tempEditting.splice(ind, 1);
      }
      return {
        editting: tempEditting,
        focusTarget: this.container,
      };
    });
  }

  handleEdit(uiId) {
    this.setState(prevState => {
      const tempEditting = prevState.editting;
      tempEditting.push(uiId);
      return {
        editting: tempEditting,
        focusTarget: uiId,
      };
    });
  }

  handleAddNew() {
    this.setState(prevState => {
      const newAdds = prevState.newAddresses;
      const newUiId = _.uniqueId();
      newAdds.push(newUiId);
      return {
        newAddresses: newAdds,
        focusTarget: newUiId,
      };
    });
  }

  handleSubmitEdit(values) {
    const { onUpdate } = this.props;
    this.setState(prevState => {
      const tempEditting = prevState.editting;
      const ind = tempEditting.indexOf(values.id);
      tempEditting.splice(ind, 1);
      return {
        editting: tempEditting,
        focusTarget: this.container,
      };
    });
    delete values.guiid;
    onUpdate(values);
  }

  handleSubmitNew(values) {
    const { onCreate } = this.props;
    this.setState(prevState => {
      const tempNew = prevState.newAddresses;
      const ind = tempNew.indexOf(values.guiid);
      tempNew.splice(ind, 1);
      return {
        newAddresses: tempNew,
        focusTarget: this.container,
      };
    });
    delete values.guiid;
    onCreate(values);
  }

  handleDeleteEdit(uiId) {
    this.props.onDelete(uiId);
    this.setState({
      focusTarget: this.container,
    });
  }

  render() {
    const {
      addresses,
      uniqueField,
      label,
      canDelete,
      canEdit,
      headerFormatter,
      intl,
      ...viewProps
    } = this.props;

    const canToggleExpansion = (addresses.length > 1);
    const filteredAddresses = (this.state.expanded) ? addresses : _.take(addresses, 1);
    const addressBlocks = filteredAddresses.map((ad) => {
      if (this.state.editting.indexOf(ad[uniqueField]) === -1) {
        return (
          <AddressView
            key={ad[uniqueField]}
            headerFormatter={headerFormatter ? headerFormatter.view : undefined}
            handleEdit={this.handleEdit}
            uiId={ad[uniqueField]}
            addressObject={ad}
            canEdit={canEdit}
            {...viewProps}
          />
        );
      }
      return (
        <AddressEdit
          form={`addressForm-${ad[uniqueField]}`}
          addresses={addresses}
          key={ad[uniqueField]}
          headerComponent={headerFormatter ? headerFormatter.edit : undefined}
          addressObject={ad}
          handleCancel={this.handleCancelEdit}
          handleDelete={this.handleDeleteEdit}
          uiId={ad[uniqueField]}
          initialValues={ad}
          onSubmit={this.handleSubmitEdit}
          canDelete={canDelete}
          {...viewProps}
        />
      );
    });

    const newAddressBlocks = this.state.newAddresses.map(ad => (
      <AddressEdit
        form={`addressForm-new-${ad}`}
        addresses={addresses}
        key={ad}
        addressObject={{ id: ad }}
        headerComponent={headerFormatter ? headerFormatter.edit : undefined}
        handleCancel={this.handleCancelNew}
        uiId={ad}
        initialValues={{ guiid: ad }}
        onSubmit={this.handleSubmitNew}
        prevFocused={document.activeElement}
        {...viewProps}
      />
    ));

    let addAddressButton = null;
    if (this.props.canEdit) {
      addAddressButton = (
        <Button onClick={this.handleAddNew} marginBottom0>
          <FormattedMessage id="stripes-components.addNew" />
        </Button>);
    }

    return (
      <div>
        <Headline tag="h4" size="medium">{label}</Headline>
        {addAddressButton}
        <div
          aria-label={intl.formatMessage({ id: 'stripes-components.addressSection' })}
          tabIndex="0"
          role="tabpanel"
          ref={(ref) => { this.container = ref; }}
        >
          <Layout className="indent">
            { addressBlocks }
            { newAddressBlocks }
          </Layout>
          { canToggleExpansion &&
            <div style={{ marginTop: '8px' }}>
              <Row>
                <Col xs={12}>
                  <Button fullWidth onClick={this.onToggleExpansion}>
                    {!this.state.expanded ? (
                      <Layout className="flex centerContent">
                        <Icon icon="down-arrow" />
                        <FormattedMessage id="stripes-components.showMoreAddresses" />
                        {`(${addresses.length - 1})`}
                      </Layout>
                    ) : (
                      <Layout className="flex centerContent">
                        <Icon icon="up-arrow" />
                        <FormattedMessage id="stripes-components.showLessAddresses" />
                      </Layout>
                    )}
                  </Button>
                </Col>
              </Row>
            </div>
          }
        </div>
      </div>
    );
  }
}

AddressList.propTypes = propTypes;
AddressList.defaultProps = defaultProps;

export default injectIntl(AddressList);
