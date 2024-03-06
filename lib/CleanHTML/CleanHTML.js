import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import sanitize from 'sanitize-html';

// for presentational markup/formatting.
const styledHTMLSettings = {
  allowedStyles: {
    '*': {
      'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^[a-z]+$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      'padding': [/^\d+(?:px|em|%)$/],
      'font-size': [/^\d+(?:px|em|%)$/]
    },
  },
  allowedAttributes: {
    'p': ['style'],
    'div': ['style'],
    'a': ['style'],
    'span': ['style']
  }
};

// for rendering presentational SVG's. any embedded script tags are removed.
const svgSettings =
{
  allowedTags: ['svg', 'rect', 'path', 'circle'],
  allowedAttributes: {
    'svg': ['width', 'height', 'style', 'viewBox'],
    'rect': ['width', 'height', 'style', 'fill', 'stroke'],
    'path': ['d', 'fill', 'stroke'],
    'polygon': ['points', 'fill', 'stroke'],
    'circle': ['cx', 'cy', 'r', 'fill', 'stroke']
  },
  parser: {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  },
};

/** Most props align with fields for sanitize-html's configuration.
 * Documentation and a set of default values can be seen at
 * https://github.com/apostrophecms/sanitize-html?tab=readme-ov-file#default-options */
const propTypes = {
  allowedAttributes: PropTypes.object,
  allowedSchemes: PropTypes.arrayOf(PropTypes.string),
  allowedSchemesAppliedToAttributes: PropTypes.arrayOf(PropTypes.string),
  allowedSchemesByTag:  PropTypes.object,
  allowedTags: PropTypes.arrayOf(PropTypes.string),
  allowProtocolRelative: PropTypes.bool,
  /** props that will be passed directly to the containing element... classnames, data-attributes, etc. */
  containerProps: PropTypes.object,
  disallowedTagsMode: PropTypes.string,
  enforceHtmlBoundary: PropTypes.bool,
  markup: PropTypes.string,
  nonBooleanAttributes: PropTypes.arrayOf(PropTypes.string),
  parseStyleAttributes: PropTypes.bool,
  selfClosing: PropTypes.arrayOf(PropTypes.string),
  /** merge default options in among all supplied props. defaults to true. */
  useSanitizeDefault: PropTypes.bool,
  /** use if SVG rendering is a requirement for the presentation. */
  useSVG: PropTypes.bool,
}

const CleanHTML = ({
  markup,
  useSanitizeDefault = true,
  useSVG,
  containerProps,
  ...sanitizeProps
}) => {
  const container = useRef();
  const sanitizeParameters = JSON.stringify({ ...sanitizeProps })
  const configuration = useMemo(() => {
    const sanitizeParams = { useSanitizeDefault, ...sanitizeProps };
    const base = useSanitizeDefault ? sanitize.defaults : {}
    const parserSettings = useSVG ? svgSettings : {};
    return merge(
      base,
      styledHTMLSettings,
      { ...sanitizeParams },
      parserSettings,
    );
  }, [sanitizeParameters, useSVG]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    container.current.innerHTML = sanitize(markup, configuration);
  }, [markup, configuration]);

  return <div ref={container} {...containerProps} />;
}

CleanHTML.propTypes = propTypes;

export default CleanHTML;
