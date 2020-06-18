import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import camelCase from 'lodash/camelCase';
import noop from 'lodash/noop';

import { FormattedMessage } from 'react-intl';

import TextField from '../TextField';
import InfoPopover from '../InfoPopover';

import {
  Col,
  Row,
} from '../LayoutGrid';

import css from './PasswordSrength.css';

const passwordStrengthTypes = ['VERY_WEAK', 'WEAK', 'REASONABLE', 'STRONG', 'VERY_STRONG'];
const defaultPasswordStrengthType = camelCase(passwordStrengthTypes[0]);

class PasswordStrength extends Component {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.string,
    }),
    /**
     * Properties for column that includes textInput
     */
    inputColProps: PropTypes.object,
    meta: PropTypes.shape({
      dirty: PropTypes.bool,
      valid: PropTypes.bool,
    }),
    /**
     * Properties for column that includes password strength meter
     */
    passwordMeterColProps: PropTypes.object,
    /**
     * Is password strength meter hidden
     */
    passwordStrengthHidden: PropTypes.bool
  };

  static defautlProps = {
    inputColProps: {},
    passwordMeterColProps: {},
    passwordStrengthHidden: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
    };

    this.strengthTester = {
      check: noop,
    };

    this.outputTypes = this.getOutputTypes();
  }

  componentDidMount() {
    this._isMounted = true;
    this.initPasswordStrength();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initPasswordStrength() {
    import('tai-password-strength').then(taiPasswordStrength => {
      this.strengthTester = new taiPasswordStrength.PasswordStrength();
      this.strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
      this.strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);
      if (this._isMounted) {
        this.setState({ hasLoaded: true });
      }
    });
  }

  getOutputTypes() {
    return passwordStrengthTypes.reduce((result, element) => {
      return {
        ...result,
        [element]: camelCase(element),
      };
    }, {});
  }

  render() {
    const {
      meta: {
        valid,
        dirty,
      },
      input: { value },
    } = this.props;
    const {
      inputColProps,
      passwordMeterColProps,
      passwordStrengthHidden,
      ...rest
    } = this.props;
    const { hasLoaded } = this.state;
    const isVisible = valid && !passwordStrengthHidden && dirty;
    const { strengthCode } = (hasLoaded && this.strengthTester.check(value)) || {};
    const output = this.outputTypes[strengthCode] || defaultPasswordStrengthType;

    return (
      <Row>
        <Col
          xs={6}
          {...inputColProps}
        >
          <TextField {...rest} />
        </Col>
        <Col
          xs={4}
          aria-live="polite"
          {...passwordMeterColProps}
        >
          {isVisible &&
          <div className="password-strength">
            <div className={css['password-strength__label']}>
              <FormattedMessage
                id="stripes-components.passwordStrength.label"
              />
            </div>
            <div
              className={classNames(css.indicator__container, css[`indicator__container--${output}`])}
            >
              <div className={css.indicator__item} />
              <div className={css.indicator__item} />
              <div className={css.indicator__item} />
              <div className={css.indicator__item} />
              <div className={css.indicator__item} />
            </div>
            <div className={css['password-strength-text__wrapper']}>
              <FormattedMessage
                id={`stripes-components.passwordStrength.${output}`}
              />
              <InfoPopover
                content={
                  <FormattedMessage
                    id="stripes-components.passwordStrength.infoPopoverText"
                  />
                }
              />
            </div>
          </div>
          }
        </Col>
      </Row>
    );
  }
}

export default PasswordStrength;
