import React, { useMemo, useState } from 'react';
import Button from '../../../lib/Button';
import IconButton from '../../../lib/IconButton';
import Checkbox from '../../../lib/Checkbox';
import TextLink from '../../../lib/TextLink';
import MultiColumnList from '../../../lib/MultiColumnList';
import css from './ColorContrastTool.css';

const BUTTON_STYLES = ['default', 'primary', 'success', 'warning', 'danger'];
const ICONS = ['edit', 'download', 'info'];

const data = [
  { id: 1, name: 'Alpha Report', category: 'Reports', dateAdded: '2026-01-14' },
  { id: 2, name: 'Beta Dataset', category: 'Data', dateAdded: '2026-03-02' },
  { id: 3, name: 'Gamma Summary', category: 'Reports', dateAdded: '2025-11-20' },
];

const columnMapping = {
  select: 'Select',
  name: 'Name',
  category: 'Category',
  dateAdded: 'Date added',
  deselected: 'Deselected',
  button: 'Button',
  icons: 'Icons',
};

export default function ComponentExamples() {
  const [selectedId, setSelectedId] = useState(data[0].id);
  const [sortedColumn, setSortedColumn] = useState('dateAdded');
  const [sortDirection, setSortDirection] = useState('ascending');

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (a[sortedColumn] < b[sortedColumn]) return -1;
      if (a[sortedColumn] > b[sortedColumn]) return 1;
      return 0;
    });
    return sortDirection === 'ascending' ? sorted : sorted.reverse();
  }, [sortedColumn, sortDirection]);

  const selectedRow = data.find((row) => row.id === selectedId);

  const onHeaderClick = (e, { name }) => {
    if (name === sortedColumn) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortedColumn(name);
      setSortDirection('ascending');
    }
  };

  const isSelected = ({ item }) => item.id === selectedId;

  const formatter = {
    select: (item) => (
      <Checkbox
        aria-label={`Select ${item.name}`}
        checked={item.id === selectedId}
        onChange={() => setSelectedId(item.id === selectedId ? null : item.id)}
      />
    ),
    name: (item) => <TextLink href="#">{item.name}</TextLink>,
    deselected: (item) => (
      <Checkbox
        aria-label={`Select ${item.name}`}
        checked={item.id !== selectedId}
      />
    ),
    button: (item) => (
      <>
        <Button>Example</Button>
        <Button buttonStyle="primary">Example</Button>
      </>
    ),
    icons: (item) => (
      <>
        {ICONS.map((icon) => (
          <IconButton key={icon} icon={icon} aria-label={icon} />
        ))}
      </>
    ),
  };

  return (
    <div className={css.componentExamples}>
      <h4>Button</h4>
      <div className={css.exampleRow}>
        {BUTTON_STYLES.map((style) => (
          <Button key={style} buttonStyle={style}>
            {style}
          </Button>
        ))}
      </div>

      <h4>IconButton</h4>
      <div className={css.exampleRow}>
        {ICONS.map((icon) => (
          <IconButton key={icon} icon={icon} aria-label={icon} />
        ))}
      </div>

      <h4>MultiColumnList</h4>
      <div style={{ height: '220px', width: '100%' }}>
        <MultiColumnList
          contentData={sortedData}
          columnMapping={columnMapping}
          formatter={formatter}
          visibleColumns={['select', 'deselected', 'name', 'category', 'dateAdded', 'button', 'icons']}
          nonInteractiveHeaders={['select', 'deselected']}
          sortableFields={['name', 'category', 'dateAdded']}
          showSortIndicator
          sortedColumn={sortedColumn}
          sortDirection={sortDirection}
          onHeaderClick={onHeaderClick}
          isSelected={isSelected}
          selectedRow={selectedRow}
        />
      </div>
    </div>
  );
}
