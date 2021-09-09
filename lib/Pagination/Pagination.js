import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import css from './Pagination.css';

//  <    #    ...       # # #       ...      #      >
//      |_|  |___|     |_____|     |___|    |_|
//     OUTER BREAK     CENTER      BREAK   OUTER

const MINIMAL_DISPLAY_THRESHOLD = 6;
const MINIMAL_DISPLAY_COUNT = 3;
const EXTENDED_DISPLAY_COUNT = 6;
const MAX_EXTENDED_OUTER_PAGES = 1;

const propTypes = {
  /** Class to be applied to `<nav>` containter */
  className: PropTypes.string,
  /** Allows you to control the pagination and define the current page. */
  currentPage: PropTypes.number,
  /** fills width of container, placing previous/next buttons at either end */
  fillWidth: PropTypes.bool,
  /** The method called to generate the href attribute value for each page. */
  hrefBuilder: PropTypes.func.isRequired,
  id: PropTypes.string,
  /** Set accessible label for `nav` container */
  label: PropTypes.string,
  /** The method to call when a page is clicked. Exposes the current page object as an argument. */
  onPageChange: PropTypes.func,
  /** Total number of pages. */
  pageCount: PropTypes.number,
  /** Whether or not to show the previous and next labels */
  showLabels: PropTypes.bool,
};

const Pagination = ({
  id,
  pageCount,
  onPageChange,
  hrefBuilder,
  fillWidth,
  currentPage,
  label = 'pagination',
  showLabels = true,
  ...props
}) => {
  return (
    <nav id={id} data-testid="pagination-component" aria-label={label} data-test-pagination>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageCount < MINIMAL_DISPLAY_THRESHOLD ? EXTENDED_DISPLAY_COUNT : MINIMAL_DISPLAY_COUNT}
        marginPagesDisplayed={pageCount < MINIMAL_DISPLAY_THRESHOLD ? 0 : MAX_EXTENDED_OUTER_PAGES}
        nextLabel={(
          <div data-test-pagination-next>
            <Icon size="small" icon="caret-right" iconPosition="end">
              <FormattedMessage id="stripes-components.next">
                { (text) => <span className={`${showLabels ? '' : 'sr-only'}`}>{text}</span>}
              </FormattedMessage>
            </Icon>
          </div>
        )}
        previousLabel={(
          <div data-test-pagination-previous>
            <Icon size="small" icon="caret-left">
              <FormattedMessage id="stripes-components.previous">
                { (text) => <span className={`${showLabels ? '' : 'sr-only'}`}>{text}</span>}
              </FormattedMessage>
            </Icon>
          </div>
        )}
        breakLabel={<Icon icon="ellipsis" aria-label="ellipsis" />}
        onPageChange={onPageChange}
        pageClassName={css.paginationItem}
        containerClassName={`${css.pagination} ${fillWidth ? css.fillWidth : ''}`}
        pageLinkClassName={`${css.paginationLink} ${css.numberLink}`}
        activeLinkClassName={css.primary}
        nextLinkClassName={css.paginationLink}
        previousLinkClassName={css.paginationLink}
        breakLinkClassName={css.paginationLink}
        forcePage={currentPage}
        hrefBuilder={hrefBuilder}
        {...props}
      />
    </nav>
  );
};

Pagination.propTypes = propTypes;

export default Pagination;
