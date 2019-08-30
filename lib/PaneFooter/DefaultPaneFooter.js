import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';

import css from './DefaultPaneFooter.css';

export default class DefaultPaneFooter extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    footerContentClass: PropTypes.string,
    onCancel: PropTypes.func,
    renderPosition: PropTypes.string,
  }

  getDefaultPaneFooterStyle = () => {
    const {
      footerContentClass,
      renderPosition,
    } = this.props;

    return className(
      footerContentClass,
      { [`${css.renderStart}`]: renderPosition === 'start' },
      { [`${css.renderEnd}`]: renderPosition === 'end' },
    );
  }

  render() {
    const {
      disabled,
      onCancel,
    } = this.props;

    return (
      <div className={this.getDefaultPaneFooterStyle()}>
        <Button
          data-test-user-form-cancel-button
          marginBottom0
          id="clickable-cancel"
          buttonStyle="default mega"
          onClick={onCancel}
        >
          <FormattedMessage id="ui-users.cancel" />
        </Button>
        <Button
          data-test-user-form-submit-button
          marginBottom0
          id="clickable-save"
          buttonStyle="primary mega"
          type="submit"
          disabled={disabled}
        >
          <FormattedMessage id="ui-users.saveAndClose" />
        </Button>
      </div>
    );
  }
}
