/**
 * Label
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import css from './Label.css';

const Label = ({ children, htmlFor, id, readOnly, required, ...rest }) => {
  const renderReadOnly = readOnly ? (
    <Icon size="small" icon="lock">
      <span className="sr-only">
        <FormattedMessage id="stripes-components.readonly" />
      </span>
    </Icon>
  ) : null;

  const renderRequired = required ? (
    <span className={css.asterisk}>*</span>
  ) : null;

  return (
    <label
      htmlFor={htmlFor}
      id={id}
      {...rest}
    >
      {children}
      {renderRequired}
      {renderReadOnly}
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
