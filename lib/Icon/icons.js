/**
 * Available icons
 * Usage: Add new key to object that returns a component
 */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';
import dotSpinner from './DotSpinner.css';

export default {
  'down-caret-inline': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path d="M12.6 4.3c-.4-.4-1-.4-1.4 0L7 8.4 2.9 4.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4.8 4.8c.2.2.5.3.7.3s.5-.1.7-.3l4.8-4.8c.4-.4.4-1 .1-1.4z" />
    </svg>
  ),
  'up-caret-inline': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path d="M1.4 10.6c.4.4 1 .4 1.4 0L7 6.4l4.1 4.1c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L7.7 4.3C7.5 4.1 7.3 4 7 4s-.5.1-.7.3L1.4 9.2c-.3.3-.3 1 0 1.4z" />
    </svg>
  ),
  'external-link': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} viewBox="0 0 14 14">
      <path d="M13.689.852a1.003 1.003 0 0 0-.923-.618H9.008a1 1 0 0 0 0 2h1.344L4.124 8.462a.999.999 0 1 0 1.414 1.414l6.228-6.228v1.343a1 1 0 0 0 2 0V1.234c0-.13-.027-.26-.077-.382z" />
      <path d="M11.356 9.19a1 1 0 0 0-1 1v1.576H2.235V3.645H3.81a1 1 0 0 0 0-2H1.235a1 1 0 0 0-1 1v10.121a1 1 0 0 0 1 1h10.121a1 1 0 0 0 1-1V10.19a1 1 0 0 0-1-1z" />
    </svg>
  ),
  'info': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path d="M7 14.101c3.915 0 7.101-3.186 7.101-7.101S10.915-.101 7-.101-.101 3.085-.101 7 3.085 14.101 7 14.101zM7 1.399c3.088 0 5.601 2.512 5.601 5.601S10.088 12.601 7 12.601 1.399 10.088 1.399 7 3.912 1.399 7 1.399z" />
      <path d="M7 6.102a.75.75 0 0 0-.75.75v3.033a.75.75 0 0 0 1.5 0V6.852a.75.75 0 0 0-.75-.75z" />
      <circle cx="7" cy="4.237" r=".913" />
    </svg>
  ),
  'plus-sign': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path d="M6 12.625a1 1 0 0 0 2 0V8h4.625a1 1 0 0 0 0-2H8V1.375a1 1 0 0 0-2 0V6H1.375a1 1 0 0 0 0 2H6v4.625z" />
    </svg>
  ),
  'gear': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 12.84v-1.681l-2.007-.42a4.81 4.81 0 0 0-.576-1.37l1.12-1.728-1.182-1.183-1.726 1.122a5.341 5.341 0 0 0-1.369-.576l-.42-2.008h-1.68l-.42 2.008a4.803 4.803 0 0 0-1.369.576L7.645 6.459 6.462 7.642l1.12 1.728c-.249.42-.451.887-.576 1.37L5 11.159v1.681l2.007.42c.125.482.311.949.576 1.37l-1.12 1.728 1.182 1.183 1.727-1.121c.42.249.887.451 1.369.576l.42 2.008h1.68l.42-2.008a4.832 4.832 0 0 0 1.369-.576l1.727 1.121 1.182-1.183-1.12-1.728c.249-.42.451-.887.576-1.37L19 12.84zm-7 1.463c-1.276 0-2.302-1.027-2.302-2.303S10.725 9.696 12 9.696s2.302 1.027 2.302 2.304-1.026 2.303-2.302 2.303z" />
    </svg>
  ),
  'validation-check': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.956a7.044 7.044 0 1 0 0 14.089 7.044 7.044 0 0 0 0-14.089zm3.937 5.731l-4.344 4.344a.997.997 0 0 1-1.414 0l-2.21-2.209a.999.999 0 1 1 1.414-1.414l1.503 1.502 3.637-3.637a.999.999 0 1 1 1.414 1.414z" />
    </svg>
  ),
  'validation-error': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.956a7.044 7.044 0 1 0 0 14.089 7.044 7.044 0 0 0 0-14.089zm-1 3.319a1 1 0 1 1 2 0v3.319a1 1 0 1 1-2 0V8.275zm1 8.075a1.146 1.146 0 1 1 0-2.292 1.146 1.146 0 0 1 0 2.292z" />
    </svg>
  ),
  'default': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 19.153c3.944 0 7.153-3.209 7.153-7.153S15.944 4.847 12 4.847 4.847 8.056 4.847 12 8.056 19.153 12 19.153zm0-12.306c2.842 0 5.153 2.312 5.153 5.153S14.842 17.153 12 17.153 6.847 14.841 6.847 12 9.158 6.847 12 6.847z" />
    </svg>
  ),
  'clearX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.847c-3.944 0-7.153 3.209-7.153 7.153S8.056 19.153 12 19.153c3.945 0 7.154-3.209 7.154-7.153S15.945 4.847 12 4.847zm3.228 8.966a.999.999 0 1 1-1.414 1.414L12 13.414l-1.814 1.814a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414L10.586 12l-1.814-1.813a.999.999 0 1 1 1.414-1.414L12 10.586l1.814-1.814a.999.999 0 1 1 1.414 1.414L13.414 12l1.814 1.813z" />
    </svg>
  ),
  'closeX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6.284 17.716a.997.997 0 0 0 1.414 0L12 13.414l4.302 4.302a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L13.414 12l4.302-4.302a.999.999 0 1 0-1.414-1.414L12 10.586 7.698 6.284a.999.999 0 1 0-1.414 1.414L10.586 12l-4.302 4.302a.999.999 0 0 0 0 1.414z" />
    </svg>
  ),
  'calendar': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18.25 17.563v-10.5a1 1 0 0 0-1-1h-2.254v-.239a1 1 0 1 0-2 0v.239h-1.992v-.239a1 1 0 1 0-2 0v.239H6.75a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h10.5a1 1 0 0 0 1-1zm-9.246-9.5v.304a1 1 0 1 0 2 0v-.304h1.992v.304a1 1 0 1 0 2 0v-.304h1.254v2.163h-8.5V8.063h1.254zm-1.254 8.5v-4.337h8.5v4.337h-8.5z" />
    </svg>
  ),
  'tag': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g>
        <path d="M19.666 7.06a2.753 2.753 0 0 0-2.725-2.725L12.9 4.309h-.018c-.733 0-1.422.285-1.94.803l-5.83 5.83a2.745 2.745 0 0 0 0 3.879l4.067 4.067c.518.518 1.207.803 1.94.803s1.422-.285 1.94-.803l5.83-5.83a2.76 2.76 0 0 0 .803-1.957l-.026-4.041zm-2.192 4.584l-5.83 5.83a.74.74 0 0 1-1.05 0l-4.067-4.067a.744.744 0 0 1 0-1.051l5.83-5.83a.743.743 0 0 1 .525-.218h.005l4.041.026a.743.743 0 0 1 .738.738l.026 4.041a.745.745 0 0 1-.218.531z" />
        <circle cx="15.019" cy="8.981" r="1.02" />
      </g>
    </svg>
  ),
  'trashBin': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M13.5 8.402a1 1 0 0 0-1 1v5.469a1 1 0 1 0 2 0V9.402a1 1 0 0 0-1-1zM10.5 8.402a1 1 0 0 0-1 1v5.469a1 1 0 1 0 2 0V9.402a1 1 0 0 0-1-1zM10.594 2.292a1 1 0 1 0 0 2h2.812a1 1 0 1 0 0-2h-2.812z" />
      <path d="M17.531 16.982v-9.94h1.062a1 1 0 1 0 0-2H5.406a1 1 0 1 0 0 2h1.052v9.94c0 1.214.988 2.202 2.203 2.202h6.668a2.203 2.203 0 0 0 2.202-2.202zm-9.073 0v-9.94h7.073v9.94a.203.203 0 0 1-.202.202H8.661a.202.202 0 0 1-.203-.202z" />
    </svg>
  ),
  'comment': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6.886 16.119H7.94v2.924a1 1 0 0 0 1.639.77l4.453-3.693h3.082a2.597 2.597 0 0 0 2.594-2.594V8.552a2.596 2.596 0 0 0-2.594-2.594H6.886a2.597 2.597 0 0 0-2.594 2.594v4.973a2.597 2.597 0 0 0 2.594 2.594zm-.594-7.567c0-.328.267-.594.594-.594h10.229c.327 0 .594.267.594.594v4.973a.595.595 0 0 1-.594.594h-3.442c-.233 0-.459.082-.639.23L9.94 16.914v-1.795a1 1 0 0 0-1-1H6.886a.595.595 0 0 1-.594-.594V8.552z" />
    </svg>
  ),
  'bookmark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M7.313 19.114a.998.998 0 0 0 1.058-.121L12 16.085l3.629 2.908a1 1 0 0 0 1.625-.78V6.718a1.933 1.933 0 0 0-1.93-1.931H8.676c-1.064 0-1.93.866-1.93 1.931v11.494c0 .385.221.735.567.902zm7.941-12.396v9.411l-2.629-2.106a.999.999 0 0 0-1.25 0L8.733 16.14l-.057-9.352 6.578-.07z" />
    </svg>
  ),
  'search': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M10.451 16.898a6.436 6.436 0 0 0 3.794-1.24l4.048 4.048a.994.994 0 0 0 1.414.001.999.999 0 0 0 0-1.414l-4.048-4.048c1.838-2.522 1.628-6.081-.646-8.355C13.794 4.671 12.174 4 10.451 4s-3.343.671-4.561 1.89C4.671 7.108 4 8.728 4 10.451s.671 3.343 1.89 4.562a6.43 6.43 0 0 0 4.561 1.885zM7.304 7.304A4.42 4.42 0 0 1 10.451 6c1.189 0 2.307.463 3.147 1.304a4.456 4.456 0 0 1 0 6.294 4.455 4.455 0 0 1-6.294 0A4.42 4.42 0 0 1 6 10.451a4.42 4.42 0 0 1 1.304-3.147z" />
    </svg>
  ),
  'duplicate': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20.125 17.818V9.662a1 1 0 0 0-1-1h-8.157a1 1 0 0 0-1 1v8.157a1 1 0 0 0 1 1h8.157a1 1 0 0 0 1-1.001zm-2-1h-6.157v-6.157h6.157v6.157z" />
      <path d="M7.5 6.193h6.157v.466h2V5.193a1 1 0 0 0-1-1H6.5a1 1 0 0 0-1 1v8.157a1 1 0 0 0 1 1h1.466v-2H7.5V6.193z" />
    </svg>
  ),
  'edit': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6.348 18.906l4.686-1.474a1.01 1.01 0 0 0 .407-.247l7.219-7.219a.999.999 0 0 0 0-1.414l-3.211-3.211a.999.999 0 0 0-1.414 0L6.814 12.56a.987.987 0 0 0-.247.407l-1.474 4.686a.999.999 0 0 0 1.255 1.253zm2.054-5.105l6.339-6.339 1.797 1.797-6.339 6.338-2.622.825.825-2.621z" />
    </svg>
  ),
  'profile': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="10.2" r="2.1" />
      <path d="M12 4.8C8 4.8 4.8 8 4.8 12S8 19.2 12 19.2s7.2-3.2 7.2-7.2S16 4.8 12 4.8zm3.7 12l-.5-2.4c-.2-.8-.8-1.3-1.5-1.5h-.3c-.4.2-.9.3-1.3.3-.5 0-.9-.1-1.3-.3-.1 0-.2-.1-.3 0-.7.2-1.3.8-1.5 1.5l-.5 2.4C6.9 15.7 6 13.9 6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2-.9 3.7-2.3 4.8z" />
    </svg>
  ),
  'hollowX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.847c-3.944 0-7.153 3.209-7.153 7.153S8.056 19.153 12 19.153s7.153-3.209 7.153-7.153S15.944 4.847 12 4.847zm0 12.306c-2.841 0-5.153-2.312-5.153-5.153S9.159 6.847 12 6.847 17.153 9.158 17.153 12 14.841 17.153 12 17.153z" />
      <path d="M14.707 9.293a.999.999 0 0 0-1.414 0L12 10.586l-1.293-1.293a.999.999 0 1 0-1.414 1.414L10.586 12l-1.293 1.293a.999.999 0 1 0 1.414 1.414L12 13.414l1.293 1.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L13.414 12l1.293-1.293a.999.999 0 0 0 0-1.414z" />
    </svg>
  ),
  'archive': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19.138 4.844H4.862a1 1 0 0 0-1 1v3.991c0 .535.422.963.95.99v7.331a1 1 0 0 0 1 1h12.375a1 1 0 0 0 1-1v-7.331a.994.994 0 0 0 .95-.99V5.844a.998.998 0 0 0-.999-1zm-13.276 2h12.275v1.991H5.862V6.844zm.95 10.312v-6.321h10.375v6.321H6.812z" />
      <path d="M13.417 11.809h-2.834a1 1 0 1 0 0 2h2.834a1 1 0 1 0 0-2z" />
    </svg>
  ),
  'right-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18.61 11.618a1.021 1.021 0 0 0-.217-.327L13.55 6.449a.999.999 0 1 0-1.414 1.414L15.272 11H5.313a1 1 0 1 0 0 2h9.959l-3.137 3.137a.999.999 0 1 0 1.414 1.414l4.842-4.842a.99.99 0 0 0 .217-.326.995.995 0 0 0 .002-.765z" />
    </svg>
  ),
  'left-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18.687 11H8.728l3.137-3.137a.999.999 0 1 0-1.414-1.414l-4.842 4.842a1.001 1.001 0 0 0 0 1.416l4.842 4.842a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L8.728 13h9.959a1 1 0 1 0 0-2z" />
    </svg>
  ),
  'down-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M8.161 11.838a.999.999 0 1 0-1.414 1.414l4.842 4.843a1.004 1.004 0 0 0 1.093.217.993.993 0 0 0 .323-.217l4.842-4.843a.999.999 0 1 0-1.414-1.414l-3.137 3.137v-9.96a1 1 0 1 0-2 0v9.96l-3.135-3.137z" />
    </svg>
  ),
  'up-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12.409 5.308a.997.997 0 0 0-1.414 0l-4.843 4.844a.999.999 0 1 0 1.414 1.414l3.137-3.137v9.96a1 1 0 1 0 2 0v-9.96l3.137 3.137a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-4.845-4.844z" />
    </svg>
  ),
  'up-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11.293 8.454l-4.844 4.844a.999.999 0 1 0 1.414 1.414L12 10.575l4.137 4.137a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-4.844-4.844a.999.999 0 0 0-1.414 0z" />
    </svg>
  ),
  'down-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11.293 15.546a.997.997 0 0 0 1.414 0l4.844-4.844a.999.999 0 1 0-1.414-1.414L12 13.425 7.863 9.288a.999.999 0 1 0-1.414 1.414l4.844 4.844z" />
    </svg>
  ),
  'down-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 14.839l4.844-4.844H7.156z" />
    </svg>
  ),
  'up-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 9.161l-4.844 4.844h9.688z" />
    </svg>
  ),
  'right-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12.674 11.293L7.83 6.449a.999.999 0 1 0-1.414 1.414L10.553 12l-4.137 4.137a.999.999 0 1 0 1.414 1.414l4.844-4.844a1 1 0 0 0 0-1.414z" />
      <path d="M13.49 6.449a.999.999 0 1 0-1.414 1.414L16.213 12l-4.137 4.137a.999.999 0 1 0 1.414 1.414l4.844-4.844a.999.999 0 0 0 0-1.414L13.49 6.449z" />
    </svg>
  ),
  'left-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M17.584 6.449a.999.999 0 0 0-1.414 0l-4.844 4.844a.997.997 0 0 0 0 1.414l4.844 4.844a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L13.447 12l4.137-4.137a.999.999 0 0 0 0-1.414z" />
      <path d="M7.787 12l4.137-4.137a.999.999 0 1 0-1.414-1.414l-4.844 4.844a.996.996 0 0 0 0 1.414l4.844 4.844a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.787 12z" />
    </svg>
  ),
  'eye-open': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19.212 14.023a3.46 3.46 0 0 0-.001-4.052C18.215 8.592 15.955 6.277 12 6.277c-3.956 0-6.217 2.318-7.212 3.7a3.46 3.46 0 0 0 .001 4.052c.996 1.38 3.256 3.695 7.211 3.695 3.956-.001 6.217-2.319 7.212-3.701zm-1.623-1.169c-.943 1.309-2.678 2.869-5.589 2.869-2.911 0-4.646-1.558-5.589-2.865-.37-.512-.37-1.2 0-1.712C7.354 9.837 9.088 8.277 12 8.277c2.911 0 4.646 1.558 5.589 2.865.369.512.369 1.2 0 1.712z" />
      <circle cx="12" cy="12" r="2.043" />
    </svg>
  ),
  'eye-closed': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19.212 14.023a3.46 3.46 0 0 0-.001-4.052 9.362 9.362 0 0 0-1.861-1.908l.989-.989a.999.999 0 1 0-1.414-1.414l-1.351 1.351A8.8 8.8 0 0 0 12 6.277c-3.956 0-6.217 2.318-7.212 3.7a3.46 3.46 0 0 0 .001 4.052 9.362 9.362 0 0 0 1.861 1.908l-.989.989a.999.999 0 1 0 1.414 1.414l1.351-1.351a8.782 8.782 0 0 0 3.574.735c3.956-.001 6.217-2.319 7.212-3.701zM6.411 12.858c-.37-.512-.37-1.2 0-1.712C7.354 9.837 9.088 8.277 12 8.277c.752 0 1.423.107 2.025.284l-1.479 1.479A2.015 2.015 0 0 0 12 9.957 2.043 2.043 0 0 0 9.957 12c0 .19.034.371.083.546l-1.965 1.965a7.243 7.243 0 0 1-1.664-1.653zm5.043 1.102c.175.049.356.083.546.083A2.043 2.043 0 0 0 14.043 12c0-.19-.034-.371-.083-.546l1.965-1.965a7.203 7.203 0 0 1 1.664 1.653c.37.512.37 1.2 0 1.712-.943 1.309-2.678 2.869-5.589 2.869a7.129 7.129 0 0 1-2.025-.284l1.479-1.479z" />
    </svg>
  ),
  'end-mark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19.4 12.3c-.1-.1-.3-.2-.4-.2-.1 0-.3 0-.4.1l-.3.3c0 .1.1.2.1.3v.3c0 .4-.1.6-.3.8-.2.2-.5.3-.8.3-.6 0-1.1-.8-1.4-2.3-.1-.4-.1-.8-.2-1-.2-.9-.5-1.5-1-1.9-.5-.4-1.1-.7-1.9-.7-.6 0-1.1.2-1.5.5-.4.3-.6.8-.6 1.3 0 .2 0 .4.1.7.1.2.2.5.3.8-.4-.4-.7-.6-1.1-.8-.4-.2-.8-.3-1.3-.3-.2-.5-.6-.9-1.3-1.3-.1 0-.1-.1-.2-.1-.2-.1-.4-.3-.5-.5s-.1-.3-.1-.5c0-.1 0-.2.1-.3 0-.1.1-.2.2-.3-.5 0-.9.1-1.2.3-.3.2-.5.5-.5.9 0 .3.1.5.3.7.2.1.5.2.9.4.1 0 .2 0 .3.1.7.2 1.2.4 1.4.8-.9.2-1.6.5-2.1 1s-.9 1.2-1.1 2.1c-.1.1-.2.2-.3.4-.1.1-.1.3-.2.4l.4.2c.1.6.3 1 .6 1.3s.7.4 1.1.4c.4 0 .7-.1.9-.3.2-.2.4-.5.4-.9V15c0-.1 0-.2-.1-.3-.1.1-.3.3-.4.3-.1-.1-.3 0-.4 0-.2 0-.4-.1-.6-.2-.1-.2-.3-.4-.3-.7.9-.4 1.6-.8 2-1.3.4-.5.7-1.1.7-1.7.4 0 .8.1 1.1.3s.6.4.9.8c-.5.2-.8.4-1 .6-.2.3-.3.6-.3 1 0 .8.4 1.4 1.1 1.9.7.5 1.6.8 2.7.8.8 0 1.7-.2 2.6-.5.9-.4 1.9-1 3-1.8.3-.2.5-.5.7-.7.2-.2.2-.5.2-.7-.1-.2-.2-.3-.3-.5zm-11.8.1c-.4.4-1 .7-1.7.9.1-.7.4-1.2.7-1.6.4-.3.9-.5 1.6-.7 0 .6-.2 1.1-.6 1.4z" />
    </svg>
  ),
  'diacritic': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fillOpacity=".36" d="M0 20h24v4H0z" />
      <path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z" />
    </svg>
  ),
  'indexes': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
    </svg>
  ),
  'print': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
    </svg>
  ),
  'ellipsis': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="7.384" cy="12" r="1.473" />
      <circle cx="12" cy="12" r="1.473" />
      <circle cx="16.616" cy="12" r="1.473" />
    </svg>),
  'spinner-ellipsis': ({ style, className }) => (
    <div style={style} className={classNames(dotSpinner.spinner, className)}>
      <div className={dotSpinner.bounce1} />
      <div className={dotSpinner.bounce2} />
      <div className={dotSpinner.bounce3} />
    </div>),
  'clock': ({ style, className }) => (
    <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.9c-.8 0-1.6.1-2.4.4h-.1l1.2 5.6c-.3.3-.4.7-.4 1.1 0 .9.7 1.7 1.7 1.7.3 0 .6-.1.9-.3l2.2.9.8-1.8-2.2-.9c-.1-.5-.5-.9-1-1.2l-.9-3.6h.1c2.9 0 5.2 2.4 5.2 5.2 0 2.9-2.4 5.2-5.2 5.2-2.9 0-5.2-2.4-5.2-5.2 0-1.6.7-3 1.9-4l-.8-1.8c-1.8 1.3-3 3.4-3 5.8 0 3.9 3.2 7.2 7.2 7.2s7.2-3.2 7.2-7.2c0-3.9-3.3-7.1-7.2-7.1z" />
    </svg>
  )
};
