import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import exportToCsv from '@folio/stripes-util/lib/exportCsv';
import Button from '../Button';

class ExportCsv extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    excludeKeys: PropTypes.arrayOf(PropTypes.string),
  }

  render() {
    const { data, excludeKeys } = this.props;
    return (
      <Button onClick={() => { exportToCsv(data, excludeKeys); }}>
        <FormattedMessage id="stripes-components.exportToCsv" />
      </Button>
    );
  }
}

export default ExportCsv;
