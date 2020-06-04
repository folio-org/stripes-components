import React, { Component } from 'react';
import RepeatableField from '../RepeatableField';
import TextField from '../../TextField';
import { Row, Col } from '../../LayoutGrid';
import Checkbox from '../../Checkbox';
import Datepicker from '../../Datepicker';
import Timepicker from '../../Timepicker';
import {FormattedMessage} from 'react-intl';
import Card from '../../Card';
import Pane from '../../Pane';
import Paneset from '../../Paneset';

export default class BasicUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: []
    };
  }

  handleAdd = () => {
    this.setState(({ fields }) => ({
      fields: fields.concat({})
    }));
  }

  handleRemove = (index) => {
    this.setState(({ fields }) => ({
      fields: [...fields.slice(0, index), ...fields.slice(index + 1)]
    }));
  }

  render() {
    const { fields } = this.state;
    return (
      <Paneset id="pset">
        <Pane defaultWidth="fill" id="pane" paneTitle="cards">
        <Card>
        <form>
        <Row>
      <Col xs={4}>
      <Checkbox
        name="status"
        type="checkbox"
        label="status"
      />
      </Col>
      <Col xs={4}>
      <RepeatableField
        id="author-form"
        legend="times"
        emptyMessage="No authors yet."
        addLabel="Add time"
        fields={fields}
        onAdd={this.handleAdd}
        onRemove={this.handleRemove}
        renderField={() => (
          <Col xs={12}>
            <FormattedMessage id="ui-rs.pullslipNotification.times">
              {placeholder => (
                <Timepicker
                  name="times"
                  label="times"
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
        )}
        />
        </Col>
        <Col xs={4}>
        <TextField
          name="days"
          label="days"
          placeholder="days"
        />
          </Col></Row>
        </form>
      </Card>

        </Pane>
      </Paneset>
     
      );
  }
}
