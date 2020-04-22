/**
 * Class name mapping of CSS properties
 */

const variables = {
  '--gutter': '16px',
  '--max-width-container': '80rem',
};

export default {
  'centerContent': 'justify-content: center;',
  'centered': 'margin: auto;',
  'display-flex': 'display: flex;',
  'display-inline-flex': 'display: inline-flex;',
  'flex': 'display: flex; align-items: center;',
  'flex-align-items-center': 'align-items: center;',
  'flex-align-items-end': 'align-items: flex-end;',
  'flex-align-items-start': 'align-items: flex-start;',
  'flex-direction-column': 'flex-direction: column;',
  'flex-wrap--wrap': 'flex-wrap: wrap;',
  'full': 'width: 100%;',
  'indent': 'padding-left: 0.4rem; padding-right: 0.4rem;',
  'justified': 'justify-content: space-between;',
  'justify-end': 'justify-content: flex-end;',
  'left': 'float: left;',
  'margin-both-auto': 'margin: auto;',
  'margin-both-gutter': `margin: ${variables['--gutter']};`,
  'margin-end-auto': 'margin-right: auto;',
  'margin-end-gutter': `margin-right: ${variables['--gutter']};`,
  'margin-start-auto': 'margin-left: auto;',
  'margin-start-gutter': `margin-left: ${variables['--gutter']};`,
  'marginTop1': 'margin-top: 1rem;',
  'marginTopHalf': 'margin-top: 0.5rem;',
  'marginTopLabelSpacer': 'margin-top: 21px;',
  'max-width-container': `max-width: ${variables['--max-width-container']};`,
  'padding-all-gutter': `padding: ${variables['--gutter']};`,
  'padding-bottom-gutter': `padding-bottom: ${variables['--gutter']};`,
  'padding-end-gutter': `padding-right: ${variables['--gutter']};`,
  'padding-start-gutter': `padding-left: ${variables['--gutter']};`,
  'padding-top-gutter': `padding-top: ${variables['--gutter']};`,
  'right': 'float: right;',
  'textCentered': 'text-align: center;',
  'textRight': 'text-align: right;'
};
