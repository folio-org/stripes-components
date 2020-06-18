/* a basic harness meant to set up scenarios for datepicker within an actual application
* where its props are fed to it by potentially dynamic sources.
*/
import React from 'react';
import PropTypes from 'prop-types';
import Datepicker from '../Datepicker';

class DatepickerAppHarness extends React.Component {
  static propTypes = {
    lateValue: PropTypes.string,
  }

  static defaultProps = {
    lateValue: '04/01/2019'
  }

  state = {
    value: '',
  }

  setValue = () => {
    this.setState({
      value: this.props.lateValue,
    });
  }

  render() {
    return (
      <div>
        <Datepicker value={this.state.value} {...this.props} />
        <button type="button" onClick={this.setValue} id="applylatevalue">set test value</button>
      </div>
    );
  }
}

export default DatepickerAppHarness;
