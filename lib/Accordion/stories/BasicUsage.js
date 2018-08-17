/**
 * Accordion: Basic Usage
 */

/* eslint-disable max-len */

import React from 'react';
import { AccordionSet, Accordion } from '..';
import Button from '../../Button';

const BasicUsage = () => (
  <AccordionSet>
    <Accordion label="Information" displayWhenOpen={<Button icon="plus-sign">Add</Button>}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      Ut eu velit a mi suscipit malesuada. Sed sollicitudin magna sed leo dignissim, vel fringilla quam placerat. Donec tempor id orci et posuere. Nam at erat at urna lobortis congue vitae at mauris. Maecenas rutrum ex tempor felis dignissim, sit amet varius lacus porttitor. Ut imperdiet sapien eu rutrum placerat. Donec eget interdum leo, quis interdum augue. Duis interdum aliquet semper. Donec aliquam molestie ipsum, quis interdum mi ullamcorper id. Vivamus in ligula eu turpis venenatis mattis. Praesent accumsan ultricies ante, nec pulvinar nunc iaculis eu.
    </Accordion>
    <Accordion label="Extended Information">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      Ut eu velit a mi suscipit malesuada. Sed sollicitudin magna sed leo dignissim, vel fringilla quam placerat. Donec tempor id orci et posuere. Nam at erat at urna lobortis congue vitae at mauris. Maecenas rutrum ex tempor felis dignissim, sit amet varius lacus porttitor. Ut imperdiet sapien eu rutrum placerat. Donec eget interdum leo, quis interdum augue. Duis interdum aliquet semper. Donec aliquam molestie ipsum, quis interdum mi ullamcorper id. Vivamus in ligula eu turpis venenatis mattis. Praesent accumsan ultricies ante, nec pulvinar nunc iaculis eu.
    </Accordion>
    <Accordion label="Proxy">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      Ut eu velit a mi suscipit malesuada. Sed sollicitudin magna sed leo dignissim, vel fringilla quam placerat. Donec tempor id orci et posuere. Nam at erat at urna lobortis congue vitae at mauris. Maecenas rutrum ex tempor felis dignissim, sit amet varius lacus porttitor. Ut imperdiet sapien eu rutrum placerat. Donec eget interdum leo, quis interdum augue. Duis interdum aliquet semper. Donec aliquam molestie ipsum, quis interdum mi ullamcorper id. Vivamus in ligula eu turpis venenatis mattis. Praesent accumsan ultricies ante, nec pulvinar nunc iaculis eu.
    </Accordion>
    <Accordion label="Loans">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae fringilla felis, sed commodo tellus. Sed bibendum mi id lorem sagittis sodales. Quisque ac lectus gravida, viverra ante et, iaculis sapien. Praesent eget ligula tortor. Praesent vitae ipsum placerat, blandit quam quis, tempus tortor. Aliquam erat volutpat. Fusce hendrerit lectus sed ex dictum, in pretium eros vestibulum. Nulla semper vehicula leo at varius. Quisque bibendum mauris sit amet tellus lobortis ultricies. Mauris eleifend sapien vel est posuere tincidunt. Proin ut nunc ut enim rhoncus elementum vitae in mauris. Nullam ultrices dictum nulla in commodo. Suspendisse potenti. Donec et velit ac quam consequat cursus. Pellentesque quis elit magna. Fusce velit libero, mattis ac placerat eget, aliquam a ante.
      <br />
      <br />
      Ut eu velit a mi suscipit malesuada. Sed sollicitudin magna sed leo dignissim, vel fringilla quam placerat. Donec tempor id orci et posuere. Nam at erat at urna lobortis congue vitae at mauris. Maecenas rutrum ex tempor felis dignissim, sit amet varius lacus porttitor. Ut imperdiet sapien eu rutrum placerat. Donec eget interdum leo, quis interdum augue. Duis interdum aliquet semper. Donec aliquam molestie ipsum, quis interdum mi ullamcorper id. Vivamus in ligula eu turpis venenatis mattis. Praesent accumsan ultricies ante, nec pulvinar nunc iaculis eu.
    </Accordion>
  </AccordionSet>
);

export default BasicUsage;
