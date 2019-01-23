import React from 'react';
import Button from '../Button';
import Icon from '../../Icon';

export default () => (
  <div style={{ maxWidth: '500px' }}>
    <h3>Colors</h3>
    <Button>Default</Button>
    <Button buttonStyle="primary">Primary</Button>
    <Button buttonStyle="danger">Danger</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <hr />
    <h3>Full width</h3>
    <Button fullWidth>Default</Button>
    <Button fullWidth buttonStyle="primary">Primary</Button>
    <Button fullWidth buttonStyle="danger">Danger</Button>
    <hr />
    <h3>Alignment</h3>
    <Button align="start" fullWidth buttonStyle="primary">Start</Button>
    <Button align="center" fullWidth buttonStyle="primary">Center (default)</Button>
    <Button align="end" fullWidth buttonStyle="primary">End</Button>
    <hr />
    <h3>Dropdown Item</h3>
    <Button buttonStyle="dropdownItem">
      <Icon icon="trash">Delete</Icon>
    </Button>
    <Button buttonStyle="dropdownItem">
      <Icon icon="edit">Batch edit</Icon>
    </Button>
    <Button buttonStyle="dropdownItem">
      <Icon icon="bookmark">Bookmark</Icon>
    </Button>
    <Button buttonStyle="dropdownItem">
      <Icon icon="duplicate">Duplicate</Icon>
    </Button>
  </div>
);
