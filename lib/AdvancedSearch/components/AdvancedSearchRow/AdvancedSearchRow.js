import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import Select from '../../../Select';
import TextArea from '../../../TextArea';
import {
  Row,
  Col,
} from '../../../LayoutGrid';
import {
  FIELD_NAMES,
  BOOLEAN_OPERATORS,
  MATCH_OPTIONS,
} from '../../constants';

import styles from './AdvancedSearchRow.css';

const propTypes = {
  errorMessage: PropTypes.string,
  hasMatchSelection: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  rowState: PropTypes.shape({
    [FIELD_NAMES.BOOL]: PropTypes.string.isRequired,
    [FIELD_NAMES.QUERY]: PropTypes.string.isRequired,
    [FIELD_NAMES.SEARCH_OPTION]: PropTypes.string.isRequired,
  }).isRequired,
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
};

const TEXTAREA_HEIGHT = 1;

const AdvancedSearchRow = ({
  index,
  isActive,
  rowState,
  searchOptions,
  onChange,
  errorMessage = '',
  hasMatchSelection,
}) => {
  const intl = useIntl();

  const booleanOptions = useMemo(() => Object.values(BOOLEAN_OPERATORS).map(boolOption => ({
    id: boolOption,
    label: intl.formatMessage({ id: `stripes-components.advancedSearch.boolean.${boolOption}` }),
    value: boolOption,
  })), [intl]);

  const matchOptions = useMemo(() => Object.values(MATCH_OPTIONS).map(matchOption => ({
    id: matchOption,
    label: intl.formatMessage({ id: `stripes-components.advancedSearch.match.${matchOption}` }),
    value: matchOption,
  })), [intl]);

  return (
    <div
      className={styles.AdvancedSearchRow}
      data-row-index={index}
    >
      <Row>
        <Col xs={2}>
          {
            index === 0
              ? <b><FormattedMessage id="stripes-components.advancedSearch.searchFor" /></b>
              : (
                <Select
                  data-test-advanced-search-bool
                  aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.boolean.label' })}
                  onChange={(e) => onChange(index, FIELD_NAMES.BOOL, e.target.value)}
                  value={rowState[FIELD_NAMES.BOOL]}
                  dataOptions={booleanOptions}
                  id={`advanced-search-bool-${index}`}
                  data-testid="advanced-search-bool"
                  required
                />
              )
          }
        </Col>
        <Col xs>
          <TextArea
            isCursorAtEnd
            rows={TEXTAREA_HEIGHT}
            data-test-advanced-search-query
            aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.field.label' })}
            onChange={(e) => onChange(index, FIELD_NAMES.QUERY, e.target.value)}
            value={rowState[FIELD_NAMES.QUERY]}
            autoFocus={isActive}
            data-testid="advanced-search-query"
          />
          <span className={styles.emptyRowErrorMessage}>{errorMessage}</span>
        </Col>
        {hasMatchSelection && (
          <Col xs={3}>
            <Select
              data-test-advanced-search-match
              aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.match.label' })}
              onChange={(e) => onChange(index, FIELD_NAMES.MATCH, e.target.value)}
              value={rowState[FIELD_NAMES.MATCH]}
              dataOptions={matchOptions}
              data-testid="advanced-search-match"
              id={`advanced-search-match-${index}`}
              required
            />
          </Col>
        )}
        <Col xs className={styles.searchInLabelCol}>
          <FormattedMessage id="stripes-components.advancedSearch.searchIn" />
        </Col>
        <Col xs={3}>
          <Select
            data-test-advanced-search-option
            aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.label' })}
            onChange={(e) => onChange(index, FIELD_NAMES.SEARCH_OPTION, e.target.value)}
            value={rowState[FIELD_NAMES.SEARCH_OPTION]}
            dataOptions={searchOptions}
            data-testid="advanced-search-option"
            id={`advanced-search-option-${index}`}
            required
          />
        </Col>
      </Row>
    </div>
  );
};

AdvancedSearchRow.propTypes = propTypes;

export default AdvancedSearchRow;
