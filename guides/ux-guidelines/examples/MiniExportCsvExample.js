import React from 'react';
import ExportCsv from '../../../lib/ExportCsv';

const data = [
  { id: '1001', title: 'Sample record', status: 'Open' },
  { id: '1002', title: 'Second record', status: 'Closed' },
];

export default function MiniExportCsvExample() {
  return <ExportCsv data={data} onlyFields={['id', 'title', 'status']} />;
}
