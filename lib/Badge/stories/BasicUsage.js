/**
 * Badge: Basic Usage
 */

import React from 'react';
import Badge from '../Badge';

const BasicUsage = () => (
  <div>
    <Badge size="small">9+</Badge>
    <br />
    <br />
    <Badge>9+</Badge>
    <br />
    <br />
    <hr />
    <br />
    <Badge color="primary" size="small">9+</Badge>
    <br />
    <br />
    <Badge color="primary">9+</Badge>
    <br />
    <br />
    <hr />
    <br />
    <Badge color="red" size="small">9+</Badge>
    <br />
    <br />
    <Badge color="red">9+</Badge>
    <br />
    <br />
    <hr />
    <br />
    <Badge>1</Badge>
    <br />
    <br />
    <Badge>78</Badge>
    <br />
    <br />
    <Badge>Very long label</Badge>
    <br />
    <br />
    <br />
    <Badge size="small">1</Badge>
    <br />
    <br />
    <Badge size="small">78</Badge>
    <br />
    <br />
    <Badge size="small">Very long label</Badge>
    <br />
    <br />
  </div>
);

export default BasicUsage;
