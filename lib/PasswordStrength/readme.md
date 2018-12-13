# PasswordStrength

## Introduction

Password strength component is a wrapper around `TextField`, which indicates password complexity.

### Properties

Properties are the same as in `TextField`. But it also uses three own properties: 
  * inputColProps: PropTypes.object,
  > Properties for column that includes `TextField`
  * passwordMeterColProps: PropTypes.object,
  > Properties for column that includes password strength meter
  * passwordStrengthHidden: PropTypes.bool
  > Is password strength meter hidden
## Usage
Just put PasswordStrength as component to 'redux form' field.
The following code shows how to use password strength meter.

```javascript
import { PasswordStrength } from '@folio/stripes-components';
import { Field } from 'redux-form';
 
 <Field
    component={PasswordStrength}
    type="password"
    id="current-password"
    name="currentPassword"
    label="test"
    autoFocus
  />
```
