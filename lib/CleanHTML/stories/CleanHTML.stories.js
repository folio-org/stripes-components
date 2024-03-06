import React, { useState } from 'react';
import CleanHTML from '../CleanHTML';
import TextArea from '../../TextArea';
import Checkbox from '../../Checkbox';
import Button from '../../Button';
import Headline from '../../Headline';
import bad from './bad.svg';

/* eslint-disable max-len */

const customSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="50">
<path d="M28.4 27.5v-21c0-1.2-.8-2-2-2H22v-.6c0-1.2-.8-2-2-2s-2 .8-2 2v.4h-4v-.4c0-1.2-.8-2-2-2s-2 .8-2 2v.4H5.6c-1.2 0-2 .8-2 2v21c0 1.2.8 2 2 2h21c1 .2 1.8-.8 1.8-1.8zM10 8.5v.6c0 1.2.8 2 2 2s2-.8 2-2v-.6h4v.6c0 1.2.8 2 2 2s2-.8 2-2v-.6h2.6v4.4h-17V8.5H10zm-2.4 17v-8.8h17v8.6h-17v.2z"/>
</svg>
`;

const xssSVG = `<p> open me in a new tab </p>
<img src=${bad} onError="alert('xss')" />
`
const xssImg = '<img src="" onError="alert(\'xss\')" />';

const styled = `<p style="color: red">This text is <strong>styled</strong></p>
<div style="text-align: center"><strong>center</strong>-alignment</div>
<div style="text-align: right; color: blue;"><strong>right<strong>-alignment</div>
`;


/**
 * CleanHTML: Basic Usage
 */

export default {
  title: 'CleanHTML',
};

export const BasicUsage = () => {
  const [markup, updateMarkup] = useState(styled);
  const [sanitize, updateSanitize] = useState(true);

  return (
    <>
      <Headline>CleanHTML</Headline>
      <p>The checkbox will enable/disable santization of markup input for presentation. Each of the buttons represent a preset value that illustrates a particular use-case.</p>
      <Checkbox label="sanitize input" checked={sanitize} onChange={e => updateSanitize(e.target.checked)} />
      <Button onClick={() => updateMarkup(styled)}>Styled content</Button>
      <Button onClick={() => updateMarkup(customSVG)}>SVG</Button>
      <Button onClick={() => updateMarkup(xssSVG)}>XSS SVG</Button>
      <Button onClick={() => updateMarkup(xssImg)}>XSS img</Button>
      <TextArea value={markup} onChange={(e) => updateMarkup(e.target.value)} rows="5" />
      <div style={{ border: '1px solid #000', minHeight: '200px' }}>
        <div>rendered mark-up:</div>
        {sanitize ?
          <CleanHTML markup={markup} useSVG /> :
          <div dangerouslySetInnerHTML={{ __html: markup }} /> // eslint-disable-line react/no-danger
        }

      </div>
    </>
  );
}
