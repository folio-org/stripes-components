import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import Select from '../../../Select';
import TextField from '../../../TextField';
import {
  Row,
  Col,
} from '../../../LayoutGrid';
import {
  FIELD_NAMES,
  BOOLEAN_OPERATORS,
} from '../../constants';

import styles from './AdvancedSearchRow.css';

const propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  rowState: PropTypes.arrayOf(PropTypes.object).isRequired,
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

  return (
    <Row>
      <Col xs={2}>
        {
          index === 0
            ? <b><FormattedMessage id="stripes-components.advancedSearch.searchFor" /></b>
            : (
              <Select
                aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.boolean.label' })}
                onChange={(e) => onChange(index, FIELD_NAMES.BOOL, e.target.value)}
                value={rowState[FIELD_NAMES.BOOL]}
                dataOptions={booleanOptions}
                id={`advance-search-bool-${index}`}
                data-testid={`advance-search-bool-${index}`}
                required
              />
            )
        }
      </Col>
      <Col xs>
        <TextField
          aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.field.label' })}
          onChange={(e) => onChange(index, FIELD_NAMES.QUERY, e.target.value)}
          value={rowState[FIELD_NAMES.QUERY]}
          id={`advance-search-query-${index}`}
          data-testid={`advance-search-query-${index}`}
        />
      </Col>
      <Col xs className={styles.searchInLabelCol}>
        <FormattedMessage id="stripes-components.advancedSearch.searchIn" />
      </Col>
      <Col xs={3}>
        <Select
          aria-label={intl.formatMessage({ id: 'stripes-components.advancedSearch.searchOptions.label' })}
          onChange={(e) => onChange(index, FIELD_NAMES.SEARCH_OPTION, e.target.value)}
          value={rowState[FIELD_NAMES.SEARCH_OPTION]}
          dataOptions={searchOptions}
          id={`advance-search-option-${index}`}
          data-testid={`advance-search-option-${index}`}
          required
        />
      </Col>
    </Row>
  );
};

AdvancedSearchRow.propTypes = propTypes;

export default AdvancedSearchRow;
