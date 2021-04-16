/**
 * Pagination Component: Basic Usage
 */

import React from 'react';
import Pagination from '..';
// eslint-disable-next-line
const handlePageClick = () => alert('page clicked');

export default () => (
  <div>
    <h3>20 pages</h3>
    <Pagination
      pageCount={20}
      onPageChange={handlePageClick}
      hrefBuilder={() => '#'}
    />
    <h3>3 or fewer pages, hidden previous and next labels</h3>
    <Pagination
      pageCount={3}
      onPageChange={handlePageClick}
      hrefBuilder={() => '#'}
      showLabels={false}
    />
    <h3>Fill width of container</h3>
    <div style={{ width: '600px', border: '1px solid #ccc' }}>
      <Pagination
        pageCount={3}
        onPageChange={handlePageClick}
        hrefBuilder={() => '#'}
        fillWidth
      />
    </div>
  </div>
);
