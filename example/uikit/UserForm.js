import React from 'react';
import Paneset from '@folio/stripes-components/lib/Paneset'
import Pane from '@folio/stripes-components/lib/Pane'
import PaneMenu from '@folio/stripes-components/lib/PaneMenu'
import {Row, Col} from 'react-bootstrap'
import Button from '@folio/stripes-components/lib/Button'
import TextField from '@folio/stripes-components/lib/TextField'
import Select from '@folio/stripes-components/lib/Select'
import RadioButtonGroup from '@folio/stripes-components/lib/RadioButtonGroup'
import RadioButton from '@folio/stripes-components/lib/RadioButton'

import { createStore, combineReducers } from 'redux'
import {Field, reducer as formReducer, reduxForm} from 'redux-form'

//const reducers={
//  form: formReducer
//}
//
//const reducer = combineReducers(reducers);
//const store = createStore(reducer);

const propTypes={
  onClose: React.PropTypes.func,
  newUser: React.PropTypes.bool
}

function UserForm(props){
  
  /*Menues for Add User workflow*/
  const addUserFirstMenu = <PaneMenu><button onClick={props.onCancel} title="close" aria-label="Close New User Dialog"><span style={{fontSize:'30px', color: '#999', lineHeight:"18px"}}>&times;</span></button></PaneMenu>
  const addUserLastMenu = <PaneMenu><Button type="submit" title="Create New User" disabled={pristine}>Create User</Button></PaneMenu>
    
  const {onSubmit, reset, pristine} = props;
    return(
      <form onSubmit={onSubmit}>
        <Paneset>

          <Pane defaultWidth="100%" firstMenu={addUserFirstMenu} lastMenu={addUserLastMenu} paneTitle="New User">
            <Row>
              <Col sm={5} smOffset={1}>
                <h2>User Record</h2>
                <Field label="UserName" name="username" id="adduser_username" component={TextField} required fullWidth/>
                <Field label="Active" name="active" component={RadioButtonGroup}>
                  <RadioButton label ="Yes" id="useractiveYesRB" inline />
                  <RadioButton label ="No" id="useractiveNoRB" inline />
                </Field>
                <fieldset>
                  <legend>Personal Info</legend>
                  <Field label="Full Name" name="full_name" id="adduser_fullname" component={TextField} required fullWidth/>
                  <Field label="Primary Email" name="primary_email" id="adduser_primaryemail" component={TextField} required fullWidth/>
                  <Field label="Secondary Email" name="secondary_email" id="adduser_secondemail" component={TextField} fullWidth/>
                </fieldset>
                <Field label="Type" name="type" id="adduser_type" component={Select} fullWidth
                  dataOptions={[{label:'Patron', value:'Patron'}]}
                />
                <Field label="Group" name="patron_group" id="adduser_group" component={Select} fullWidth
                        dataOptions={[{label:'On-campus', value:'on_campus'}]}
                />
              </Col>
            </Row>
          </Pane>

        </Paneset>
      </form>
  )
}

UserForm.propTypes = propTypes;

export default reduxForm({
  form: 'userRecord'
})(UserForm);
