/**
 * Radio Button tests
 */

 import React from 'react';
import RadioButton from '../../lib/RadioButton';

describe('RadioButton', () => {

  /**
   * Ensure that RadioButton always renders with a unique ID
   */
  it('should always render with a unique ID ', (done) => {
    let items = [];
    const found = [];
    const duplicates = [];
    for (var i = 0; i < 100; i++) {
      const myCustomId = i === 50 ? 'my-custom-id' : null;
      items.push(<RadioButton className="radio-button" id={myCustomId} key={i} />);
    }
    const wrapper = shallow(<div>{items}</div>);
    wrapper.find('.radio-button').forEach((node) => {
      const id = node.render().find('input')[0].attribs.id;
      if (found.indexOf(id) >= 0) {
        duplicates.push(id);
      }
      found.push(id);
    });

    // Check for duplicates
    expect(duplicates.length, 'duplicates').to.equal(0);

    // Check if custom ID was attached
    expect(found, 'Custom ID is not added to RadioButton').to.include.members(['my-custom-id']);

    done();
  });
});
