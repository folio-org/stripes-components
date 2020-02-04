import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import exportToCsv from './exportToCsv';
import Button from '../Button';

class ExportCsv extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    onlyFields: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  }

  render() {
    const { data, onlyFields } = this.props;
    const options = { onlyFields };
    return (
      <Button
        data-test-export-csv
        onClick={() => { exportToCsv(data, options); }}
      >
        <FormattedMessage id="stripes-components.exportToCsv" />
      </Button>
    );
  }
}

export default ExportCsv;
