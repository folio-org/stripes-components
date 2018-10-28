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
  'external-link': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} viewBox="0 0 16 16">
      <path d="M13.2 2H9.8c-.6 0-.9.4-.9.9s.4.9.9.9H11L5.4 9.3c-.4.4-.4.9 0 1.2.4.4.9.4 1.2 0L12.1 5v1.2c0 .5.4.9.9.9s.9-.4.9-.9V2.8c0-.7-.4-.8-.7-.8z" />
      <path d="M11.9 10c-.5 0-.9.4-.9.9v1.4H3.7V5h1.4c.6 0 .9-.4.9-.9s-.3-.9-.8-.9H2.8c-.5 0-.9.4-.9.9v9c0 .5.4.9.9.9h9c.5 0 .9-.4.9-.9v-2.3c.1-.5-.3-.8-.8-.8z" />
    </svg>
  ),
  'info': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 15.1c3.9 0 7.1-3.2 7.1-7.1S11.9.9 8 .9.9 4.1.9 8s3.2 7.1 7.1 7.1zM8 2.4c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6S2.4 11.1 2.4 8 4.9 2.4 8 2.4z" />
      <path d="M8 7.1c-.4 0-.8.3-.8.8v3c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-3c0-.5-.4-.8-.8-.8z" />
      <circle cx="8" cy="5.2" r=".9" />
    </svg>
  ),
  'plus-sign': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M7 13.6c0 .6.4 1 1 1s1-.4 1-1V9h4.6c.6 0 1-.4 1-1s-.4-1-1-1H9V2.4c0-.6-.4-1-1-1s-1 .4-1 1V7H2.4c-.6 0-1 .4-1 1s.4 1 1 1H7v4.6z" />
    </svg>
  ),
  'gear': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M15 8.8V7.2l-2-.4c-.1-.5-.3-.9-.6-1.4l1.1-1.7-1.2-1.2-1.7 1.1c-.4-.3-.9-.5-1.3-.6l-.5-2H7.2l-.5 2c-.4.1-.9.3-1.3.6L3.6 2.5 2.5 3.6l1.1 1.7c-.3.5-.5 1-.6 1.4l-2 .5v1.7l2 .4c.1.5.3.9.6 1.4l-1.1 1.7 1.2 1.2 1.7-1.1c.4.2.9.5 1.4.6l.4 2h1.7l.4-2c.5-.1.9-.3 1.4-.6l1.7 1.1 1.2-1.2-1.1-1.7c.2-.4.5-.9.6-1.4l1.9-.5zm-7 1.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
    </svg>
  ),
  'validation-check': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 1C4.1 1 1 4.1 1 8s3.2 7 7 7 7-3.2 7-7-3.1-7-7-7zm3.9 5.7L7.6 11c-.4.4-1 .4-1.4 0L4 8.8c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.5 1.5 3.6-3.6c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z" />
    </svg>
  ),
  'validation-error': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 1C4.1 1 1 4.1 1 8s3.2 7 7 7 7-3.2 7-7-3.1-7-7-7zM7 4.3c0-.6.4-1 1-1s1 .4 1 1v3.3c0 .6-.4 1-1 1s-1-.4-1-1V4.3zm1 8c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1c.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" />
    </svg>
  ),
  'default': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 15.2c3.9 0 7.2-3.2 7.2-7.2S11.9.8 8 .8.8 4.1.8 8s3.3 7.2 7.2 7.2zM8 2.8c2.8 0 5.2 2.3 5.2 5.2s-2.3 5.2-5.2 5.2S2.8 10.8 2.8 8 5.2 2.8 8 2.8z" />
    </svg>
  ),
  'clearX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 .8C4.1.8.8 4.1.8 8S4 15.2 8 15.2c3.9 0 7.2-3.2 7.2-7.2S11.9.8 8 .8zm3.2 9c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L8 9.4l-1.8 1.8c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L6.6 8 4.8 6.2c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 6.6l1.8-1.8c.4-.4 1-.4 1.4 0s.4 1 0 1.4L9.4 8l1.8 1.8z" />
    </svg>
  ),
  'closeX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M2.3 13.7c.4.4 1 .4 1.4 0L8 9.4l4.3 4.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L9.4 8l4.3-4.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 6.6 3.7 2.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L6.6 8l-4.3 4.3c-.4.4-.4 1 0 1.4z" />
    </svg>
  ),
  'calendar': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M14.2 13.6V3.1c0-.6-.4-1-1-1H11v-.3c0-.6-.4-1-1-1s-1 .4-1 1V2H7v-.2c0-.6-.4-1-1-1s-1 .4-1 1V2H2.8c-.6 0-1 .4-1 1v10.5c0 .6.4 1 1 1h10.5c.5.1.9-.4.9-.9zM5 4.1v.3c0 .6.4 1 1 1s1-.4 1-1v-.3h2v.3c0 .6.4 1 1 1s1-.4 1-1v-.3h1.3v2.2H3.8V4.1H5zm-1.2 8.5V8.2h8.5v4.3H3.8z" />
    </svg>
  ),
  'tag': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M15.7 3.1c0-1.5-1.2-2.7-2.7-2.7H9c-.7 0-1.4.3-1.9.8l-6 5.7C0 8 0 9.7 1.1 10.8l4.1 4.1c.5.5 1.2.8 1.9.8s1.4-.3 1.9-.8l5.8-5.8c.5-.5.8-1.2.8-2 .1 0 .1-4 .1-4zm-2.2 4.5l-5.8 5.8c-.3.3-.8.3-1 0l-4.2-4c-.3-.3-.3-.8 0-1.1l5.8-5.8c.1-.1.3-.2.5-.2h4c.4 0 .7.3.7.7v4c.2.3.1.5 0 .6z" />
      <circle cx="11" cy="5" r="1" />
    </svg>
  ),
  'trashBin': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M9.3 6c-.5 0-.9.4-.9.9v4.7c0 .5.4.9.9.9s.9-.4.9-.9V6.9c-.1-.5-.5-.9-.9-.9zM6.7 6c-.4 0-.8.4-.8.9v4.7c0 .5.4.9.9.9s.9-.4.9-.9V6.9c-.1-.5-.5-.9-1-.9zM6.8.8c-.5 0-.9.4-.9.9s.4.9.9.9h2.4c.5 0 .9-.4.9-.9S9.7.8 9.2.8H6.8z" />
      <path d="M12.7 13.3V4.8h.9c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H2.4c-.5.1-.9.5-.9 1s.4.9.9.9h.9v8.5c0 1 .8 1.9 1.9 1.9h5.7c1-.1 1.8-.9 1.8-2zm-7.7 0V4.8h6v8.5c0 .1-.1.2-.2.2H5.2c-.1 0-.2-.1-.2-.2z" />
    </svg>
  ),
  'comment': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M2.9 11.1H4V14c0 .6.4 1 1 1 .2 0 .5-.1.6-.2l4.5-3.7h3.1c1.4 0 2.6-1.2 2.6-2.6v-5c0-1.4-1.2-2.6-2.6-2.6H2.9C1.5 1 .3 2.1.3 3.6v5c0 1.4 1.2 2.5 2.6 2.5zm-.6-7.5c0-.4.3-.6.6-.6h10.2c.3 0 .6.3.6.6v5c0 .3-.3.6-.6.6H9.7c-.3-.1-.5 0-.7.1l-3.1 2.6v-1.8c0-.6-.4-1-1-1h-2c-.3 0-.6-.3-.6-.6V3.6z" />
    </svg>
  ),
  'bookmark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M3.3 15.1c.3.2.8.1 1.1-.1L8 12.1l3.6 2.9c.4.3 1.1.3 1.4-.2.1-.2.2-.4.2-.6V2.7c0-1.1-.9-1.9-1.9-1.9H4.7c-1.1 0-1.9.9-1.9 1.9v11.5c-.1.4.2.7.5.9zm8-12.4v9.4L8.6 10c-.4-.3-.9-.3-1.2 0l-2.6 2.1-.1-9.3 6.6-.1z" />
    </svg>
  ),
  'search': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M6.5 12.9c1.4 0 2.7-.4 3.8-1.2l4 4c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-4-4c1.8-2.5 1.6-6.1-.6-8.4C9.8.7 8.2 0 6.5 0S3.1.7 1.9 1.9C.7 3.1 0 4.7 0 6.5S.7 9.8 1.9 11c1.2 1.2 2.8 1.9 4.6 1.9zM3.3 3.3c.8-.8 2-1.3 3.2-1.3 1.2 0 2.3.5 3.1 1.3 1.7 1.7 1.7 4.6 0 6.3-1.7 1.7-4.6 1.7-6.3 0-.8-.8-1.3-2-1.3-3.1 0-1.2.5-2.4 1.3-3.2z" />
    </svg>
  ),
  'duplicate': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M15.3 14.3V6.2c0-.6-.4-1-1-1H6.2c-.6 0-1 .4-1 1v8.2c0 .6.4 1 1 1h8.2c.5-.1.9-.5.9-1.1zm-2-1H7.2V7.2h6.2v6.1z" />
      <path d="M2.7 2.7h6.2v.5h2V1.7c0-.6-.4-1-1-1H1.7c-.6 0-1 .4-1 1v8.2c0 .6.4 1 1 1h1.5v-2h-.5V2.7z" />
    </svg>
  ),
  'edit': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M2.3 14.9L7 13.4c.2 0 .3-.1.4-.2L14.7 6c.4-.4.4-1 0-1.4l-3.2-3.2c-.4-.4-1-.4-1.4 0L2.8 8.6c-.1.1-.2.2-.2.4l-1.5 4.7c-.2.5.1 1.1.7 1.3.1 0 .4 0 .5-.1zm2.1-5.1l6.3-6.3 1.8 1.8-6.3 6.3-2.6.8.8-2.6z" />
    </svg>
  ),
  'profile': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <circle cx="8" cy="6.2" r="2.1" />
      <path d="M8 .8C4 .8.8 4 .8 8S4 15.2 8 15.2 15.2 12 15.2 8 12 .8 8 .8zm3.7 12l-.5-2.4c-.2-.8-.8-1.3-1.5-1.5h-.3c-.4.2-.9.3-1.3.3-.5 0-.9-.1-1.3-.3-.1 0-.2-.1-.3 0-.7.2-1.3.8-1.5 1.5l-.5 2.4C2.9 11.7 2 9.9 2 8c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2-.9 3.7-2.3 4.8z" />
    </svg>
  ),
  'hollowX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 .8C4.1.8.8 4.1.8 8S4 15.2 8 15.2 15.2 12 15.2 8 11.9.8 8 .8zm0 12.4c-2.8 0-5.2-2.3-5.2-5.2S5.2 2.8 8 2.8s5.2 2.3 5.2 5.2-2.4 5.2-5.2 5.2z" />
      <path d="M10.7 5.3c-.4-.4-1-.4-1.4 0L8 6.6 6.7 5.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L6.6 8 5.3 9.3c-.4.4-.4 1 0 1.4s1 .4 1.4 0L8 9.4l1.3 1.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L9.4 8l1.3-1.3c.4-.4.4-1 0-1.4z" />
    </svg>
  ),
  'archive': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M14.3 1.4H1.7c-.5 0-.9.4-.9.9v3.5c0 .5.4.9.8.9v6.5c0 .5.4.9.9.9h10.9c.5 0 .9-.4.9-.9V6.7c.5 0 .8-.4.8-.9V2.3c.1-.5-.3-.9-.8-.9zM2.6 3.2h10.9V5H2.6V3.2zm.8 9.1V6.7h9.2v5.6H3.4z" />
      <path d="M9.3 7.6H6.7c-.4 0-.8.4-.8.9s.4.9.9.9h2.5c.5 0 .9-.4.9-.9s-.5-.9-.9-.9z" />
    </svg>
  ),
  'right-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M15.1 7.6c-.1-.1-.1-.2-.2-.3l-4.8-4.8c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L11.8 7h-10c-.6 0-1 .4-1 1s.4 1 1 1h10l-3.1 3.1c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l4.8-4.8c.1-.1.2-.2.2-.3.1-.3.1-.5 0-.8z" />
    </svg>
  ),
  'left-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M14.1 7.5h-10l3.1-3.1c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L1.1 7.8c-.4.4-.4 1 0 1.4L5.9 14c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L4.2 9.5h10c.6 0 1-.4 1-1s-.5-1-1.1-1z" />
    </svg>
  ),
  'down-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M3.9 8.6c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4.8 4.8c.3.3.7.4 1.1.2.1 0 .2 0 .3-.1l4.8-4.8c.4-.4.4-1 0-1.4s-1-.4-1.4 0L9 11.8v-10c0-.6-.4-1-1-1s-1 .4-1 1v10L3.9 8.6z" />
    </svg>
  ),
  'up-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8.7 1.1c-.4-.4-1-.4-1.4 0L2.5 5.9c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L7 4.2v10c0 .6.4 1 1 1s1-.4 1-1v-10l3.1 3.1c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4.1 0-4.8-4.8-4.8-4.8z" />
    </svg>
  ),
  'up-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M7.3 4.5L2.4 9.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L8 6.6l4.1 4.1c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L8.7 4.5c-.4-.4-1-.4-1.4 0z" />
    </svg>
  ),
  'down-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M7.3 11.5c.4.4 1 .4 1.4 0l4.8-4.8c.4-.4.4-1 0-1.4s-1-.4-1.4 0L8 9.4 3.9 5.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4-.1 0 4.8 4.8 4.8 4.8z" />
    </svg>
  ),
  'down-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 10.8L12.8 6H3.2L8 10.8z" />
    </svg>
  ),
  'up-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 5.2L3.2 10h9.7L8 5.2z" />
    </svg>
  ),
  'right-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8.7 7.3L3.8 2.4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L6.6 8l-4.1 4.1c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l4.8-4.8c.4-.4.4-1 0-1.4z" />
      <path d="M9.5 2.4c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L12.2 8l-4.1 4.1c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l4.8-4.8c.4-.4.4-1 0-1.4L9.5 2.4z" />
    </svg>
  ),
  'left-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M13.6 2.4c-.4-.4-1-.4-1.4 0L7.3 7.3c-.4.4-.4 1 0 1.4l4.8 4.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L9.4 8l4.1-4.1c.5-.4.5-1.1.1-1.5z" />
      <path d="M3.8 8l4.1-4.1c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L1.7 7.3c-.4.4-.4 1 0 1.4l4.8 4.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L3.8 8z" />
    </svg>
  ),
  'eye-open': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M14.6 9.9c.8-1.1.8-2.6 0-3.7-.9-1.3-3-3.4-6.6-3.4-3.6 0-5.7 2.1-6.6 3.4-.8 1.1-.8 2.6 0 3.7.9 1.3 3 3.4 6.6 3.4 3.6-.1 5.7-2.2 6.6-3.4zm-1.5-1.1c-.9 1.2-2.5 2.6-5.1 2.6S3.7 10 2.9 8.8c-.3-.5-.3-1.1 0-1.6C3.7 6 5.3 4.6 8 4.6c2.7 0 4.3 1.4 5.1 2.6.4.5.4 1.1 0 1.6z" />
      <circle cx="8" cy="8" r="1.9" />
    </svg>
  ),
  'eye-closed': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M14.6 9.9c.8-1.1.8-2.6 0-3.7-.5-.7-1.1-1.2-1.7-1.7l.9-.9c.4-.4.4-.9 0-1.3s-.9-.4-1.3 0l-1.2 1.2C10.2 3 9.1 2.8 8 2.8c-3.6 0-5.7 2.1-6.6 3.4-.8 1.1-.8 2.6 0 3.7.5.7 1.1 1.2 1.7 1.7l-.9.9c-.4.4-.4.9 0 1.3s.9.4 1.3 0l1.2-1.2c1 .5 2.1.7 3.3.7 3.6-.1 5.7-2.2 6.6-3.4zM2.9 8.8c-.3-.5-.3-1.1 0-1.6C3.7 6 5.3 4.6 8 4.6c.7 0 1.3.1 1.9.3L8.5 6.2c-.2 0-.3-.1-.5-.1-1 0-1.9.9-1.9 1.9 0 .2 0 .3.1.5l-1.8 1.8c-.6-.4-1.1-.9-1.5-1.5zm4.6 1c.2 0 .3.1.5.1C9 9.9 9.9 9 9.9 8c0-.2 0-.3-.1-.5l1.8-1.8c.6.4 1.1.9 1.5 1.5.3.5.3 1.1 0 1.6-.9 1.2-2.5 2.6-5.1 2.6-.6 0-1.3-.1-1.9-.3l1.4-1.3z" />
    </svg>
  ),
  'end-mark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M15 8.3c-.1-.1-.3-.2-.4-.2s-.3 0-.4.1l-.3.3c0 .1.1.2.1.3V9c0 .4-.1.6-.3.8-.2.2-.5.3-.8.3-.6 0-1-.8-1.3-2.2-.1-.4-.1-.8-.2-.9-.2-.8-.5-1.4-.9-1.8-.5-.4-1-.7-1.8-.7-.6 0-1 .2-1.4.5-.3.3-.5.7-.5 1.2 0 .2 0 .4.1.7.1.2.2.4.3.7-.4-.4-.7-.6-1-.8-.5-.1-.8-.2-1.3-.2-.2-.5-.6-.9-1.2-1.2-.1 0-.1-.1-.2-.1-.2-.1-.4-.3-.5-.5-.1-.2-.1-.3-.1-.5 0-.1 0-.2.1-.3l.2-.2c-.5 0-.8.1-1.1.2-.3.2-.5.5-.5.9 0 .3.1.5.3.7.2.1.5.2.8.4.1 0 .2 0 .3.1.7.2 1.1.4 1.3.8-.8.1-1.5.3-1.9.8-.5.5-.8 1.1-1 2-.2.1-.3.2-.4.4-.1.1-.1.3-.2.4l.4.2c.1.6.3.9.6 1.2.3.3.7.4 1 .4s.7-.1.8-.3c.2-.2.4-.5.4-.8v-.3c0-.1 0-.2-.1-.3-.1.1-.3.3-.4.3-.1-.1-.3 0-.4 0-.2 0-.4-.1-.6-.2-.1-.2-.3-.4-.3-.7.8-.4 1.5-.8 1.9-1.2.4-.5.7-1 .7-1.6.4 0 .8.1 1 .3.3.2.6.4.8.8-.3.1-.6.3-.8.5-.1.2-.2.5-.2.9 0 .8.4 1.3 1 1.8.7.5 1.5.8 2.5.8.8 0 1.6-.2 2.4-.5.8-.4 1.8-.9 2.8-1.7.3-.2.5-.5.7-.7.2-.2.2-.5.2-.7 0-.1-.1-.2-.2-.4zm-11.1.1c-.4.4-1 .6-1.6.8.1-.7.4-1.1.7-1.5.4-.3.8-.5 1.5-.7-.1.6-.3 1.1-.6 1.4z" />
    </svg>
  ),
  'diacritic': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M.8 12.5h14.4v2.4H.8v-2.4zM7.4 2.3l-3.3 8.4h1.3l.7-1.8h3.8l.7 1.8H12L8.6 2.3H7.4zm-.8 5.4L8 3.9l1.4 3.8H6.6z" />
    </svg>
  ),
  'indexes': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M5.9.8v3.1h2.3l-3.5 8.2H1.8v3.1H10v-3.1H7.8l3.5-8.2h2.9V.8H5.9z" />
    </svg>
  ),
  'print': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M13 5.1H3C1.8 5.1.8 6.1.8 7.3v4.3h2.9v2.9h8.6v-2.9h2.9V7.3c0-1.2-1-2.2-2.2-2.2zM10.9 13H5.1V9.4h5.8V13zM13 8c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7.1.4-.3.7-.7.7zm-.7-6.5H3.7v2.9h8.6V1.5z" />
    </svg>
  ),
  'ellipsis': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <circle cx="3.4" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="12.6" cy="8" r="1.5" />
    </svg>
  ),
  'spinner-ellipsis': ({ style, className }) => (
    <div style={style} className={classNames(dotSpinner.spinner, className)}>
      <div className={dotSpinner.bounce1} />
      <div className={dotSpinner.bounce2} />
      <div className={dotSpinner.bounce3} />
    </div>
  ),
  'clock': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8 .9c-.8 0-1.6.1-2.4.4h-.1l1.2 5.6c-.3.3-.4.7-.4 1.1 0 .9.7 1.7 1.7 1.7.3 0 .6-.1.9-.3l2.2.9.8-1.8-2.2-.9c-.1-.5-.5-.9-1-1.2l-.9-3.6h.1c2.9 0 5.2 2.4 5.2 5.2 0 2.9-2.4 5.2-5.2 5.2-2.9 0-5.2-2.4-5.2-5.2 0-1.6.7-3 1.9-4l-.8-1.8C2 3.5.8 5.6.8 8c0 3.9 3.2 7.2 7.2 7.2S15.2 12 15.2 8C15.2 4.1 11.9.9 8 .9z" />
    </svg>
  )
};
