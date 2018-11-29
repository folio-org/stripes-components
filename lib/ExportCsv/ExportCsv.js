import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { deprecated } from 'prop-types-extra';
import exportToCsv from '@folio/stripes-util/lib/exportCsv';
import Button from '../Button';

class ExportCsv extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    excludeKeys: deprecated(PropTypes.arrayOf(PropTypes.string), 'Use onlyFields to pass in the necessary fields'),
    onlyFields: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  }

  render() {
    const { data, excludeKeys, onlyFields } = this.props;
    const options = { excludeKeys, onlyFields };
    return (
      <Button onClick={() => { exportToCsv(data, options); }}>
        <FormattedMessage id="stripes-components.exportToCsv" />
      </Button>
    );
  }
}

export default ExportCsv;
