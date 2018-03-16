/**
 * Checkbox tests
 */

import React from 'react';
import Checkbox from '../../lib/Checkbox';

describe('Checkbox', () => {
  /**
   * Ensure that Checkbox always renders with a unique ID
   */
  it('should always render with a unique ID ', (done) => {
    const items = [];
    const found = [];
    const duplicates = [];
    for (let i = 0; i < 100; i++) {
      const myCustomId = i === 50 ? 'my-custom-id' : null;
      items.push(<Checkbox className="checkbox" id={myCustomId} key={i} />);
    }
    const wrapper = shallow(<div>{items}</div>);
    wrapper.find('.checkbox').forEach((node) => {
      const id = node.render().find('input')[0].attribs.id;
      if (found.indexOf(id) >= 0) {
        duplicates.push(id);
      }
      found.push(id);
    });

    // Check for duplicates
    expect(duplicates.length, 'duplicates').to.equal(0);

    // Check if custom ID was added
    expect(found, 'Custom ID is not added to Checkbox').to.include.members(['my-custom-id']);

    done();
  });

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
