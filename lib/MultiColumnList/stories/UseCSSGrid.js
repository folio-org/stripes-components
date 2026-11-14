import React, { useState } from 'react';
import MultiColumnList from '../MultiColumnList';
import { syncGenerate } from './service';

/* Feasibility spike only - side-by-side comparison of real MCL (JS-measured column
 * widths) against GridColumnWidthSpike (CSS Grid/subgrid, zero measurement), using the
 * same data/columnWidths shapes as existing stories, to visually assess whether native
 * grid track sizing is a viable replacement. See the plan doc for full context and the
 * "Verification" section for what to look for.
 */

const basicData = syncGenerate(6, 0);

const hintsGenerator = () => ({
  status: Math.random() > 0.5,
  hrid: Math.floor(Math.random() * 100000),
  requester: 'Jane Requester',
  supplier: 'Acme Supply Co',
});
const hintsData = syncGenerate(6, 0, hintsGenerator);
const numericColumnWidths = {
  status: { min: 24, max: 24 },
  hrid: { min: 50, max: 60 },
  requester: { min: 60, max: 80 },
  supplier: { min: 60, max: 80 },
};
const stringColumnWidths = {
  status: { min: '24px', max: '24px' },
  hrid: { min: '50px', max: '60px' },
  requester: { min: '60px', max: '80px' },
  supplier: { min: '60px', max: '80px' },
};

const stickyData = syncGenerate(200, 0);

const basicColumnOrders = [
  ['active', 'title', 'email'],
  ['email', 'active', 'title'],
  ['title', 'email', 'active'],
];
const basicColumnWidths = { active: '60px', title: '40%', email: '40%' };
const basicColumnMapping = { active: 'Active', title: 'Title', email: 'Email' };

const Section = ({ title, children }) => ( // eslint-disable-line react/prop-types
  <div style={{ marginBottom: '2rem' }}>
    <h3>{title}</h3>
    {children}
  </div>
);

const UseCSSGrid = () => {
  const [basicOrderIndex, setBasicOrderIndex] = useState(0);
  const basicColumns = basicColumnOrders[basicOrderIndex];

  return (
    <div>
      <Section title="1. Basic fixed px/% columns">
        <p>
          Column order: {basicColumns.join(', ')} - the last column (no `max` hint) should
          always be the one that stretches, in both MCL and the grid spike, regardless of
          which one that is.
        </p>
        <button
          type="button"
          onClick={() => setBasicOrderIndex((i) => (i + 1) % basicColumnOrders.length)}
        >
          Reorder columns
        </button>
        <p>Real MCL:</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={basicData}
            columnWidths={basicColumnWidths}
            visibleColumns={basicColumns}
            columnMapping={basicColumnMapping}
            maxHeight="220px"
          />
        </div>
        <p>Grid spike (identical columnWidths, zero measurement):</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={basicData}
            columnWidths={basicColumnWidths}
            visibleColumns={basicColumns}
            columnMapping={basicColumnMapping}
            maxHeight="220px"
            useCSSGrid
          />
        </div>
      </Section>

      <Section title="2. Numeric {min,max} hints (ColumnWidthHints-equivalent)">
        <p>Real MCL (calculateColumnWidth3q heuristic):</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            striped
            contentData={hintsData}
            columnWidths={numericColumnWidths}
            visibleColumns={['status', 'hrid', 'requester', 'supplier']}
            maxHeight="220px"
            columnMapping={{ status: 'Status', hrid: 'HRID', requester: 'Requester', supplier: 'Supplier' }}
          />
        </div>
        <p>Grid spike (minmax() - expect this to size closer to true content width, not the 3rd-quartile heuristic):</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={hintsData}
            visibleColumns={['status', 'hrid', 'requester', 'supplier']}
            columnWidths={numericColumnWidths}
            columnMapping={{ status: 'Status', hrid: 'HRID', requester: 'Requester', supplier: 'Supplier' }}
            maxHeight="220px"
            useCSSGrid
          />
        </div>
      </Section>

      <Section title="3. String {min,max} hints, e.g. '50px' (VariableWidthHints-equivalent)">
        <p>Real MCL (note: calculateWidth.js&apos;s string-min bug means only max is actually enforced today):</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            striped
            contentData={hintsData}
            columnWidths={stringColumnWidths}
            visibleColumns={['status', 'hrid', 'requester', 'supplier']}
            maxHeight="220px"
            columnMapping={{ status: 'Status', hrid: 'HRID', requester: 'Requester', supplier: 'Supplier' }}
          />
        </div>
        <p>Grid spike (string units pass straight into minmax() - no min-hint bug by construction):</p>
        <div style={{ width: '500px', height: '220px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={hintsData}
            visibleColumns={['status', 'hrid', 'requester', 'supplier']}
            columnWidths={stringColumnWidths}
            columnMapping={{ status: 'Status', hrid: 'HRID', requester: 'Requester', supplier: 'Supplier' }}
            maxHeight="220px"
            useCSSGrid
          />
        </div>
      </Section>

      <Section title="4. Sticky first column + omitted/auto columns">
        <p>Real MCL:</p>
        <div style={{ width: '400px', height: '260px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={stickyData}
            visibleColumns={['index', 'title', 'email', 'date']}
            columnMapping={{ index: 'Index', title: 'Title', email: 'Email', date: 'Date' }}
            stickyFirstColumn
            maxHeight="260px"
          />
        </div>
        <p>Grid spike (auto columns via minmax(min-content, max-content), sticky via position:sticky):</p>
        <div style={{ width: '400px', height: '260px', marginBottom: '1rem' }}>
          <MultiColumnList
            contentData={stickyData}
            visibleColumns={['index', 'title', 'email', 'date']}
            columnMapping={{ index: 'Index', title: 'Title', email: 'Email', date: 'Date' }}
            stickyFirstColumn
            maxHeight="260px"
            useCSSGrid
          />
        </div>
      </Section>
    </div>
  );
};

export default UseCSSGrid;
