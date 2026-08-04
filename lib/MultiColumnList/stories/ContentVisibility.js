import React from 'react';
import faker from 'faker';
import MultiColumnList from '../MultiColumnList';
import { asyncGenerate } from './service';

// Mirrors ui-data-import's RecordsTable.js shape: virtualize={false} (the FOLIO
// default - virtualize=true is discouraged since it breaks browser find-in-page and
// causes flaky automated tests), ~150 rows, with a cell that renders a variable number
// of nested per-record items (like HoldingsCell/ItemCell), producing variable row
// heights - the representative real-world case for the experimentalContentVisibility
// prop (see MCLRenderer.js).
const generator = (start, res) => {
  const subItemCount = faker.random.number({ min: 1, max: 5 });
  return {
    index: (start || 0) + res.length,
    title: faker.random.words(),
    email: faker.internet.email(),
    date: faker.date.past().toString(),
    subItems: Array.from({ length: subItemCount }, () => faker.random.words(2)),
  };
};

export default class ContentVisibility extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  componentDidMount() {
    this.requestMore(3000, 0);
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 0, false, generator);
    this.setState({ data: newData });
  }

  formatter = {
    subItems: (row) => (
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {row.subItems.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    ),
  }

  render() {
    const { data } = this.state;
    const columnMapping = {
      index: 'Index',
      title: 'Title',
      email: 'Email',
      date: 'Date',
      subItems: 'Sub-items',
    };
    const visibleColumns = ['index', 'title', 'email', 'date', 'subItems'];

    return (
      <>
        <p>
          3000 rows, <code>virtualize=false</code> (the FOLIO default), variable-height rows
          via a nested sub-item list per row - mirrors ui-data-import&apos;s RecordsTable.js.
          Compare the two lists below with DevTools Performance/Rendering panels, and try
          browser find-in-page (Ctrl+F) against text in off-screen rows in the second list.
        </p>
        {/* <h3>Baseline (no content-visibility)</h3>
        <div style={{ height: '300px' }}>
           <MultiColumnList
            contentData={data}
            columnMapping={columnMapping}
            visibleColumns={visibleColumns}
            formatter={this.formatter}
            height="300px"
          />
        </div> */}
        <h3>experimentalContentVisibility enabled</h3>
        <div style={{ height: '300px' }}>
          <MultiColumnList
            contentData={data}
            columnMapping={columnMapping}
            visibleColumns={visibleColumns}
            formatter={this.formatter}
            experimentalContentVisibility
            height="300px"
            useCSSGrid
          />
        </div>
      </>
    );
  }
}
