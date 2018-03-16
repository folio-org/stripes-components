/**
 * Checkbox tests
 */

 import React from 'react';
import Checkbox from '../../lib/Checkbox';

describe('Checkbox', () => {

  /**
   * Ensure that Checkbox always renders with a unique ID
   */
  it('should never render with the same id ', (done) => {
    let items = [];
    const found = [];
    const duplicates = [];
    for (var i = 0; i < 100; i++) {
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
    expect(duplicates, 'duplicates').to.be.empty;
    done();
  });
});
