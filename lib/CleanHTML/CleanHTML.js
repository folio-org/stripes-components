import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import sanitizeHTML from 'sanitize-html';

// for presentational markup/formatting.
const styledHTMLSettings = {
  allowedStyles: {
    '*': {
      'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^[a-z]+$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      'padding': [/^\d+(?:px|em|%)$/],
      'font-size': [/^\d+(?:px|em|%)$/],
    },
  },
  allowedAttributes: {
    'p': ['style'],
    'div': ['style'],
    'a': ['style'],
    'span': ['style']
  }
};

const allowedLinkSettings = {
  allowedAttributes: {
    a: ['href', 'rel']
  }
}

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
  allowedStyles: {
    '*' : {
      'fill': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^[a-z]+$/],
      'stroke': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^[a-z]+$/],
      'stroke-width': [/^\d+$/],
    }
  },
  parser: {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  },
};

const mergeCustomizer = (objValue, srcValue) => { // eslint-disable-line consistent-return
  if (isArray(objValue)) {
    return [...objValue, ...srcValue];
  }
};

const getConfiguration = ({ includeDefaults = true, allowSVG, allowLinks, config }) => {
  const sanitizeParams = { includeDefaults, ...config };
  const base = includeDefaults ? sanitizeHTML.defaults : {}
  const parserSettings = allowSVG ? svgSettings : {};
  const linkSettings = allowLinks ? allowedLinkSettings : {};
  const configuration = mergeWith(
    {},
    base,
    linkSettings,
    styledHTMLSettings,
    { ...sanitizeParams },
    parserSettings,
    mergeCustomizer
  );
  return configuration;
};

export const sanitizeMarkup = (markup, options) => {
  const sanitizeConfiguration = getConfiguration(options);
  return sanitizeHTML(markup, sanitizeConfiguration);
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
  allowLinks: PropTypes.bool,
  allowProtocolRelative: PropTypes.bool,
  allowSVG: PropTypes.bool,
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
}

const CleanHTML = ({
  markup,
  allowLinks,
  useSanitizeDefault = true,
  allowSVG,
  containerProps,
  ...sanitizeProps
}) => {
  const sanitizeParameters = JSON.stringify({ ...sanitizeProps })
  const configuration = useMemo(() => {
    const config = getConfiguration({
      includeDefaults: useSanitizeDefault,
      allowSVG,
      allowLinks,
      config: { ...sanitizeProps }
    });
    return config;
  }, [sanitizeParameters, allowSVG, allowLinks]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(markup, configuration) }} {...containerProps} />; // eslint-disable-line
}

CleanHTML.propTypes = propTypes;

export default CleanHTML;
