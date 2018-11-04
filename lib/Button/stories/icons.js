import React from 'react';
import Button from '../Button';
import Icon from '../../Icon';
import Badge from '../../Badge';

const Icons = () => {
  return (
    <div>
      <h3>Medium</h3>
      <Button buttonStyle="plain">
        <Icon icon="closeX" />
      </Button>
      <Button buttonStyle="plain">
        <Icon icon="comment">
          <Badge>9+</Badge>
        </Icon>
      </Button>
      <Button buttonStyle="plain">
        <Icon icon="search" />
      </Button>
      <Button buttonStyle="plain">
        <Icon icon="edit" />
      </Button>
      <Button buttonStyle="plain">
        <Icon icon="duplicate" />
      </Button>
      <br />
      <h3>Small</h3>
      <Button buttonStyle="plain" size="small">
        <Icon icon="closeX" />
      </Button>
      <Button buttonStyle="plain" size="small">
        <Icon icon="comment">
          <Badge>9+</Badge>
        </Icon>
      </Button>
      <Button buttonStyle="plain" size="small">
        <Icon icon="search" />
      </Button>
      <Button buttonStyle="plain" size="small">
        <Icon icon="edit" />
      </Button>
      <Button buttonStyle="plain" size="small">
        <Icon icon="duplicate" />
      </Button>
    </div>
  );
};

export default Icons;
