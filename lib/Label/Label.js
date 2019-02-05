/**
 * Label
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import Asterisk from './components/Asterisk';
import css from './Label.css';

const Label = ({ children, htmlFor, id, readOnly, required, ...rest }) => (
  <label
    htmlFor={htmlFor}
    id={id}
    {...rest}
  >
    {children}
    {required && <Asterisk />}
    {readOnly && (
      <Icon size="small" icon="lock">
        <span className="sr-only">
          <FormattedMessage id="stripes-components.readonly" />
        </span>
      </Icon>
    )}
  </label>
);

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
