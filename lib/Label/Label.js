/**
 * Label
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';

const Label = ({ children, htmlFor, id, readOnly, ...rest }) => {
  return (
    <label
      htmlFor={htmlFor}
      id={id}
      {...rest}
    >
      {children}
      { readOnly && (
        <Icon size="small" icon="lock">
          <span className="sr-only">
            <FormattedMessage id="stripes-components.readonly" />
          </span>
        </Icon>
      ) }
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
