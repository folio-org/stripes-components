/**
 * Checkbox tests
 */

import React from 'react';
import Checkbox from '../../lib/Checkbox';

describe('Checkbox', () => {
  /**
   * Test for redux-form compabillity
   * (redux-form injects a prop of 'input' which contains event handlers such as onChange, onBlur etc.)
   */
  it('should work with both props.onChange/props.value and props.input.onChange/props.input.value', (done) => {
    const state = {
      value1: '',
      value2: '',
    };
    const expectedValue = 'bananas';
    const checkboxes = mount(
      <div>
        <Checkbox
          input={{
            value: state.value1,
            onChange: () => {
              state.value1 = expectedValue;
            },
          }}
        />
        <Checkbox
          value={state.value2}
          onChange={() => { state.value2 = expectedValue; }}
        />
      </div>,
    );

    // Simulate changes on inputs
    checkboxes.find(Checkbox).forEach(node => node.find('input').simulate('change'));

    // Check for expected values
    expect(state.value1, 'this.props.input.onChange is not working').to.equal(expectedValue);
    expect(state.value2, 'this.props.onChange is not working').to.equal(expectedValue);

    done();
  });
});
