import React, { Fragment } from 'react';
import Icon from '../Icon';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => {
  return (
    <Fragment>
      <Headline size="x-large">
        <Icon icon="arrow-left">
          Back
        </Icon>
      </Headline>
      <Headline size="large">
        <Icon icon="arrow-right" iconPosition="end">
          Forward
        </Icon>
      </Headline>
      <Button>
        <Icon icon="plus-sign">
          Add
        </Icon>
      </Button>
      <br />
      <Button buttonStyle="primary">
        <Icon icon="chevron-double-right" iconPosition="end">
          Continue
        </Icon>
      </Button>
      <br />
      <a href="http://folio.org">
        <Icon icon="external-link" iconPosition="end">
          This is an external link
        </Icon>
      </a>
      <br />
      <br />
      <Headline size="small">
        <Icon icon="profile" iconPosition="end">
          Profile
        </Icon>
      </Headline>
      <Headline size="x-small">
        <Icon icon="gear">
          Settings
        </Icon>
      </Headline>
    </Fragment>
  );
};
