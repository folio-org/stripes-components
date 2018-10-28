import React, { Fragment } from 'react';
import Icon from '../Icon';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => {
  return (
    <Fragment>
      <Headline size="x-large">
        <Icon icon="left-arrow">
          Back
        </Icon>
      </Headline>
      <br />
      <Button>
        <Icon icon="plus-sign">
          Add
        </Icon>
      </Button>
      <br />
      <Button buttonStyle="primary">
        <Icon icon="right-double-chevron" iconPosition="end">
          Continue
        </Icon>
      </Button>
      <br />
      <a href="http://folio.org">
        <Icon icon="external-link" iconPosition="end">
          This is an external link
        </Icon>
      </a>
    </Fragment>
  );
};
