import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from '../LayoutGrid';
import Datepicker from '../Datepicker/Datepicker';
import Timepicker from '../Timepicker/Timepicker';

class DateTimePicker extends React.Component {
  static propTypes = {
    dateProps: PropTypes.object,
    timeProps: PropTypes.object,
  }

  render() {
    const { dateProps, timeProps } = this.props;

    return (
      <form>
        <Row>
          <Col xs={12} sm={6} md={3}>
            <Field
              name="date"
              component={Datepicker}
              ignoreLocalOffset
              {...dateProps}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Field
              name="time"
              component={Timepicker}
              timezone="UTC"
              {...timeProps}
            />
          </Col>
        </Row>
      </form>
    );
  }
}

export default reduxForm({
  form: 'DateTimePicker',
})(DateTimePicker);
