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

const AdvancedSearchRow = ({
  index,
  rowState,
  searchOptions,
  onChange,
  errorMessage,
  hasMatchSelection,
}) => {
  const intl = useIntl();

  const booleanOptions = useMemo(() => [{
    id: BOOLEAN_OPERATORS.AND,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.boolean.and' }),
    value: BOOLEAN_OPERATORS.AND,
  }, {
    id: BOOLEAN_OPERATORS.OR,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.boolean.or' }),
    value: BOOLEAN_OPERATORS.OR,
  }, {
    id: BOOLEAN_OPERATORS.NOT,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.boolean.not' }),
    value: BOOLEAN_OPERATORS.NOT,
  }], [intl]);

  const matchOptions = useMemo(() => [{
    id: MATCH_OPTIONS.EXACT_PHRASE,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.match.exactPhrase' }),
    value: MATCH_OPTIONS.EXACT_PHRASE,
  }, {
    id: MATCH_OPTIONS.CONTAINS_ALL,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.match.containsAll' }),
    value: MATCH_OPTIONS.CONTAINS_ALL,
  }, {
    id: MATCH_OPTIONS.STARTS_WITH,
    label: intl.formatMessage({ id: 'stripes-components.advancedSearch.match.startsWith' }),
    value: MATCH_OPTIONS.STARTS_WITH,
  }], [intl]);

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
            data-test-advanced-search-query
            aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.field.label' })}
            onChange={(e) => onChange(index, FIELD_NAMES.QUERY, e.target.value)}
            value={rowState[FIELD_NAMES.QUERY]}
            autoFocus={index === 0}
            data-testid="advanced-search-query"
          />
          <span className={styles.emptyRowErrorMessage}>{errorMessage}</span>
        </Col>
        {hasMatchSelection && (
          <Col xs={3}>
            <Select
              data-test-advanced-match
              aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.match.label' })}
              onChange={(e) => onChange(index, FIELD_NAMES.MATCH, e.target.value)}
              value={rowState[FIELD_NAMES.MATCH]}
              dataOptions={matchOptions}
              data-testid="advanced-match"
              id={`advanced-match-${index}`}
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
AdvancedSearchRow.defaultProps = {
  errorMessage: '',
};

export default AdvancedSearchRow;
