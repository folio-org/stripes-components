import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import exportToCsv from '@folio/stripes-util/lib/exportCsv';
import Button from '../Button';

class ExportCsv extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
    intl: PropTypes.object,
  }

  render() {
    const { data, options, intl } = this.props;
    return (
      <Button onClick={() => { exportToCsv(data, options, intl); }}>
        <FormattedMessage id="stripes-components.exportToCsv" />
      </Button>
    );
  }
}

export default ExportCsv;
