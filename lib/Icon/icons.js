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
    <svg focusable="false" style={style} className={className} viewBox="0 0 32 32">
      <path d="M26.5 4h-6.8c-1.2 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h2.4l-11.2 11c-.8.8-.8 1.8 0 2.4.8.8 1.8.8 2.4 0l11-11v2.4c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8V5.6c0-1.4-.8-1.6-1.4-1.6z" />
      <path d="M23.9 20c-1 0-1.8.8-1.8 1.8v2.8H7.5V10h2.8c1.2 0 1.8-.8 1.8-1.8s-.6-1.8-1.6-1.8H5.7c-1 0-1.8.8-1.8 1.8v18c0 1 .8 1.8 1.8 1.8h18c1 0 1.8-.8 1.8-1.8v-4.6c.2-1-.6-1.6-1.6-1.6z" />
    </svg>
  ),
  'info': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 30.2c7.8 0 14.2-6.4 14.2-14.2S23.8 1.8 16 1.8 1.8 8.2 1.8 16 8.2 30.2 16 30.2zm0-25.4c6.2 0 11.2 5 11.2 11.2s-5 11.2-11.2 11.2S4.8 22.2 4.8 16 9.8 4.8 16 4.8z" />
      <path d="M16 14.2c-.8 0-1.6.6-1.6 1.6v6c0 .8.6 1.6 1.6 1.6.8 0 1.6-.6 1.6-1.6v-6c0-1-.8-1.6-1.6-1.6z" />
      <circle cx="16" cy="10.4" r="1.8" />
    </svg>
  ),
  'plus-sign': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M14 27.2c0 1.2.8 2 2 2s2-.8 2-2V18h9.2c1.2 0 2-.8 2-2s-.8-2-2-2H18V4.8c0-1.2-.8-2-2-2s-2 .8-2 2V14H4.8c-1.2 0-2 .8-2 2s.8 2 2 2H14v9.2z" />
    </svg>
  ),
  'gear': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M30 17.6v-3.2l-4-.8c-.2-1-.6-1.8-1.2-2.8L27 7.3l-2.4-2.4-3.4 2.2c-.8-.6-1.8-1-2.6-1.2l-1-4h-3.2l-1 4c-.8.2-1.8.6-2.6 1.2L7.2 5 5 7.2l2.2 3.4c-.6 1-1 2-1.2 2.8l-4 1v3.4l4 .8c.2 1 .6 1.8 1.2 2.8L5 24.8l2.4 2.4 3.4-2.2c.8.4 1.8 1 2.8 1.2l.8 4h3.4l.8-4c1-.2 1.8-.6 2.8-1.2l3.4 2.2 2.4-2.4-2.2-3.4c.4-.8 1-1.8 1.2-2.8l3.8-1zm-14 3c-2.6 0-4.6-2-4.6-4.6s2-4.6 4.6-4.6 4.6 2 4.6 4.6-2 4.6-4.6 4.6z" />
    </svg>
  ),
  'validation-check': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 2C8.2 2 2 8.2 2 16s6.4 14 14 14 14-6.4 14-14S23.8 2 16 2zm7.8 11.4L15.2 22c-.8.8-2 .8-2.8 0L8 17.6c-.8-.8-.8-2 0-2.8s2-.8 2.8 0l3 3 7.2-7.2c.8-.8 2-.8 2.8 0s.8 2 0 2.8z" />
    </svg>
  ),
  'validation-error': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 2C8.2 2 2 8.2 2 16s6.4 14 14 14 14-6.4 14-14S23.8 2 16 2zm-2 6.6c0-1.2.8-2 2-2s2 .8 2 2v6.6c0 1.2-.8 2-2 2s-2-.8-2-2V8.6zm2 16c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z" />
    </svg>
  ),
  'default': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 30.4c7.8 0 14.4-6.4 14.4-14.4S23.8 1.6 16 1.6 1.6 8.2 1.6 16 8.2 30.4 16 30.4zm0-24.8c5.6 0 10.4 4.6 10.4 10.4S21.8 26.4 16 26.4 5.6 21.6 5.6 16 10.4 5.6 16 5.6z" />
    </svg>
  ),
  'clearX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 1.6C8.2 1.6 1.6 8.2 1.6 16S8 30.4 16 30.4c7.8 0 14.4-6.4 14.4-14.4S23.8 1.6 16 1.6zm6.4 18c.8.8.8 2 0 2.8s-2 .8-2.8 0L16 18.8l-3.6 3.6c-.8.8-2 .8-2.8 0s-.8-2 0-2.8l3.6-3.6-3.6-3.6c-.8-.8-.8-2 0-2.8s2-.8 2.8 0l3.6 3.6 3.6-3.6c.8-.8 2-.8 2.8 0s.8 2 0 2.8L18.8 16l3.6 3.6z" />
    </svg>
  ),
  'closeX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M4.6 27.4c.8.8 2 .8 2.8 0l8.6-8.6 8.6 8.6c.8.8 2 .8 2.8 0s.8-2 0-2.8L18.8 16l8.6-8.6c.8-.8.8-2 0-2.8s-2-.8-2.8 0L16 13.2 7.4 4.6c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l8.6 8.6-8.6 8.6c-.8.8-.8 2 0 2.8z" />
    </svg>
  ),
  'lock': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M16.7 10.3v-.4c0-3.6-2.1-6.5-4.8-6.5S7.2 6.3 7.2 9.9v.4c-1 .2-1.8.9-1.8 1.8v6.7c0 1 1 1.9 2.2 1.9h8.7c1.2 0 2.2-.8 2.2-1.9v-6.7c0-.9-.7-1.7-1.8-1.8zm-7.5-.4c0-2.4 1.3-4.5 2.8-4.5 1.5 0 2.8 2.1 2.8 4.5v.4H9.2v-.4zm7.3 2.2v6.7s-.1.1-.2.1H7.7c-.1 0-.2-.1-.2-.1v-6.7s.1-.1.2-.1h8.7c.1 0 .1.1.1.1z" />
    </svg>
  ),
  'calendar': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M28.4 27.5v-21c0-1.2-.8-2-2-2H22v-.6c0-1.2-.8-2-2-2s-2 .8-2 2v.4h-4v-.4c0-1.2-.8-2-2-2s-2 .8-2 2v.4H5.6c-1.2 0-2 .8-2 2v21c0 1.2.8 2 2 2h21c1 .2 1.8-.8 1.8-1.8zM10 8.5v.6c0 1.2.8 2 2 2s2-.8 2-2v-.6h4v.6c0 1.2.8 2 2 2s2-.8 2-2v-.6h2.6v4.4h-17V8.5H10zm-2.4 17v-8.8h17v8.6h-17v.2z" />
    </svg>
  ),
  'tag': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M31.4 6.2c0-3-2.4-5.4-5.4-5.4h-8c-1.4 0-2.8.6-3.8 1.6l-12 11.4C0 16 0 19.4 2.2 21.6l8.2 8.2c1 1 2.4 1.6 3.8 1.6s2.8-.6 3.8-1.6l11.6-11.6c1-1 1.6-2.4 1.6-4 .2-.1.2-8.1.2-8zM27 15.1L15.4 26.8c-.6.6-1.6.6-2 0l-8.4-8c-.6-.6-.6-1.6 0-2.2L16.6 4.9c.2-.2.6-.4 1-.4h8c.8 0 1.4.6 1.4 1.4v8c.4.6.2 1 0 1.2z" />
      <circle cx="22" cy="9.9" r="2" />
    </svg>
  ),
  'trashBin': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M18.6 12c-1 0-1.8.8-1.8 1.8v9.4c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-9.4c-.2-1-1-1.8-1.8-1.8zm-5.2 0c-.8 0-1.6.8-1.6 1.8v9.4c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-9.4c-.2-1-1-1.8-2-1.8zm.2-10.4c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h4.8c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8h-4.8z" />
      <path d="M25.4 26.6v-17h1.8c1 0 1.8-.8 1.8-1.8S28.2 6 27.2 6H4.8C3.8 6.2 3 7 3 8s.8 1.8 1.8 1.8h1.8v17c0 2 1.6 3.8 3.8 3.8h11.4c2-.3 3.6-1.8 3.6-4zm-15.4 0v-17h12v17c0 .2-.2.4-.4.4H10.4c-.2 0-.4-.2-.4-.4z" />
    </svg>
  ),
  'comment': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M5.7 22.2h2.2V28c0 1.2.8 2 2 2 .4 0 1-.2 1.2-.4l9-7.4h6.2c2.8 0 5.2-2.4 5.2-5.2V7c0-2.8-2.4-5.2-5.2-5.2H5.7C2.9 2 .5 4.2.5 7.2v10c0 2.8 2.4 5 5.2 5zM4.5 7.3c0-.8.6-1.2 1.2-1.2h20.4c.6 0 1.2.6 1.2 1.2v10c0 .6-.6 1.2-1.2 1.2h-6.8c-.6-.2-1 0-1.4.2l-6.2 5.2v-3.6c0-1.2-.8-2-2-2h-4c-.6 0-1.2-.6-1.2-1.2V7.3z" />
    </svg>
  ),
  'bookmark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M6.6 30.2c.6.4 1.6.2 2.2-.2l7.2-5.8 7.2 5.8c.8.6 2.2.6 2.8-.4.2-.4.4-.8.4-1.2v-23c0-2.2-1.8-3.8-3.8-3.8H9.4c-2.2 0-3.8 1.8-3.8 3.8v23c-.2.8.4 1.4 1 1.8zm16-24.8v18.8L17.2 20c-.8-.6-1.8-.6-2.4 0l-5.2 4.2-.2-18.6 13.2-.2z" />
    </svg>
  ),
  'search': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M13 25.8c2.8 0 5.4-.8 7.6-2.4l8 8c.8.8 2 .8 2.8 0 .8-.8.8-2 0-2.8l-8-8c3.6-5 3.2-12.2-1.2-16.8C19.6 1.4 16.4 0 13 0S6.2 1.4 3.8 3.8 0 9.4 0 13s1.4 6.6 3.8 9 5.6 3.8 9.2 3.8zM6.6 6.6C8.2 5 10.6 4 13 4s4.6 1 6.2 2.6c3.4 3.4 3.4 9.2 0 12.6s-9.2 3.4-12.6 0C5 17.6 4 15.2 4 13c0-2.4 1-4.8 2.6-6.4z" />
    </svg>
  ),
  'duplicate': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M30.6 28.6V12.3c0-1.2-.8-2-2-2H12.4c-1.2 0-2 .8-2 2v16.4c0 1.2.8 2 2 2h16.4c1-.2 1.8-.9 1.8-2.1zm-4-2H14.4V14.3h12.4v12.2l-.2.1z" />
      <path d="M5.4 5.4h12.4v1h4v-3c0-1.2-.8-2-2-2H3.4c-1.2 0-2 .8-2 2v16.4c0 1.2.8 2 2 2h3v-4h-1V5.4z" />
    </svg>
  ),
  'edit': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M4.6 29.8l9.4-3c.4 0 .6-.2.8-.4L29.4 12c.8-.8.8-2 0-2.8L23 2.7c-.8-.8-2-.8-2.8 0L5.6 17.2c-.2.2-.4.4-.4.8l-3 9.4c-.4 1 .2 2.2 1.4 2.6.2 0 .8 0 1-.2zm4.2-10.3L21.4 6.9l3.6 3.6-12.6 12.6-5.2 1.6c0 .1 1.6-5.2 1.6-5.2z" />
    </svg>
  ),
  'profile': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="12.4" r="4.2" />
      <path d="M16 1.6C8 1.6 1.6 8 1.6 16S8 30.4 16 30.4 30.4 24 30.4 16 24 1.6 16 1.6zm7.4 24l-1-4.8c-.4-1.6-1.6-2.6-3-3h-.6c-.8.4-1.8.6-2.6.6-1 0-1.8-.2-2.6-.6-.2 0-.4-.2-.6 0-1.4.4-2.6 1.6-3 3l-1 4.8c-3.2-2.2-5-5.8-5-9.6C4 9.4 9.4 4 16 4s12 5.4 12 12c0 4-1.8 7.4-4.6 9.6z" />
    </svg>
  ),
  'hollowX': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 1.6C8.2 1.6 1.6 8.2 1.6 16S8 30.4 16 30.4 30.4 24 30.4 16 23.8 1.6 16 1.6zm0 24.8c-5.6 0-10.4-4.6-10.4-10.4S10.4 5.6 16 5.6 26.4 10.2 26.4 16 21.6 26.4 16 26.4z" />
      <path d="M21.4 10.6c-.8-.8-2-.8-2.8 0L16 13.2l-2.6-2.6c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l2.6 2.6-2.6 2.6c-.8.8-.8 2 0 2.8s2 .8 2.8 0l2.6-2.6 2.6 2.6c.8.8 2 .8 2.8 0s.8-2 0-2.8L18.8 16l2.6-2.6c.8-.8.8-2 0-2.8z" />
    </svg>
  ),
  'archive': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M28.6 3H3.4c-1 0-1.8.8-1.8 1.8v7c0 1 .8 1.8 1.6 1.8v13c0 1 .8 1.8 1.8 1.8h21.8c1 0 1.8-.8 1.8-1.8v-13c1 0 1.6-.8 1.6-1.8v-7c.2-1-.6-1.8-1.6-1.8zM5.2 6.7H27v3.6H5.2V6.7zm1.6 18.2V13.6h18.4v11.2s-18.4 0-18.4.1z" />
      <path d="M18.6 15.4h-5.2c-.8 0-1.6.8-1.6 1.8s.8 1.8 1.8 1.8h5c1 0 1.8-.8 1.8-1.8s-1-1.8-1.8-1.8z" />
    </svg>
  ),
  'right-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M30.2 15.2c-.2-.2-.2-.4-.4-.6L20.2 5c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l6.2 6.2h-20c-1.2 0-2 .8-2 2s.8 2 2 2h20l-6.2 6.2c-.8.8-.8 2 0 2.8s2 .8 2.8 0l9.6-9.6c.2-.2.4-.4.4-.6.2-.6.2-1 0-1.6z" />
    </svg>
  ),
  'left-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M28.2 14.5h-20l6.2-6.2c.8-.8.8-2 0-2.8s-2-.8-2.8 0l-9.4 9.6c-.8.8-.8 2 0 2.8l9.6 9.6c.8.8 2 .8 2.8 0s.8-2 0-2.8l-6.2-6.2h20c1.2 0 2-.8 2-2s-1-2-2.2-2z" />
    </svg>
  ),
  'down-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M7.8 17.2c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l9.6 9.6c.6.6 1.4.8 2.2.4.2 0 .4 0 .6-.2l9.6-9.6c.8-.8.8-2 0-2.8s-2-.8-2.8 0L18 23.6v-20c0-1.2-.8-2-2-2s-2 .8-2 2v20l-6.2-6.4z" />
    </svg>
  ),
  'up-arrow': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M17.4 2.2c-.8-.8-2-.8-2.8 0L5 11.8c-.8.8-.8 2 0 2.8s2 .8 2.8 0L14 8.4v20c0 1.2.8 2 2 2s2-.8 2-2v-20l6.2 6.2c.8.8 2 .8 2.8 0s.8-2 0-2.8c.2 0-9.6-9.6-9.6-9.6z" />
    </svg>
  ),
  'up-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M14.7 9.4L4.9 19c-.8.8-.8 2 0 2.8s2 .8 2.8 0l8.4-8.2 8.2 8.2c.8.8 2 .8 2.8 0s.8-2 0-2.8l-9.6-9.6c-.9-.8-2.1-.8-2.8 0z" />
    </svg>
  ),
  'down-caret': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M14.6 22.6c.8.8 2 .8 2.8 0L27 13c.8-.8.8-2 0-2.8s-2-.8-2.8 0L16 18.4l-8.2-8.2c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8c-.2 0 9.6 9.6 9.6 9.6z" />
    </svg>
  ),
  'down-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 21.2l9.6-9.6H6.4l9.6 9.6z" />
    </svg>
  ),
  'up-triangle': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M15.9 10.8l-9.6 9.6h19.4l-9.8-9.6z" />
    </svg>
  ),
  'right-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M17 14.7L7.2 4.9c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l8.4 8.4-8.2 8.2c-.8.8-.8 2 0 2.8s2 .8 2.8 0l9.6-9.6c.9-.9.9-2.1 0-2.8z" />
      <path d="M18.6 4.9c-.8-.8-2-.8-2.8 0-.8.8-.8 2 0 2.8L24 16l-8.2 8.2c-.8.8-.8 2 0 2.8.8.8 2 .8 2.8 0l9.6-9.6c.8-.8.8-2 0-2.8l-9.6-9.7z" />
    </svg>
  ),
  'left-double-chevron': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M27.6 4.9c-.8-.8-2-.8-2.8 0L15 14.7c-.8.8-.8 2 0 2.8l9.6 9.6c.8.8 2 .8 2.8 0s.8-2 0-2.8L19.2 16l8.2-8.2c1-.7 1-2.1.2-2.9z" />
      <path d="M8 16l8.2-8.2c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0l-9.6 9.6c-.8.8-.8 2 0 2.8l9.6 9.6c.8.8 2 .8 2.8 0 .8-.8.8-2 0-2.8L8 16z" />
    </svg>
  ),
  'eye-open': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M29.2 19.8c1.6-2.2 1.6-5.2 0-7.4-1.8-2.6-6-6.8-13.2-6.8S4.6 9.8 2.8 12.4c-1.6 2.2-1.6 5.2 0 7.4 1.8 2.6 6 6.8 13.2 6.8 7.2-.3 11.4-4.5 13.2-6.8zm-3-2.3c-1.8 2.4-5 5.2-10.2 5.2S7.4 20 5.8 17.6c-.6-1-.6-2.2 0-3.2C7.4 12 10.6 9.2 16 9.2s8.6 2.8 10.2 5.2c.8 1 .8 2.2 0 3.1z" />
      <circle cx="16" cy="16" r="3.8" />
    </svg>
  ),
  'eye-closed': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M29.2 19.8c1.6-2.2 1.6-5.2 0-7.4C28.2 11 27 10 25.8 9l1.8-1.8c.8-.8.8-1.8 0-2.6s-1.8-.8-2.6 0L22.6 7c-2.2-1-4.4-1.4-6.6-1.4-7.2 0-11.4 4.2-13.2 6.8-1.6 2.2-1.6 5.2 0 7.4 1 1.4 2.2 2.4 3.4 3.4L4.4 25c-.8.8-.8 1.8 0 2.6s1.8.8 2.6 0l2.4-2.4c2 1 4.2 1.4 6.6 1.4 7.2-.3 11.4-4.5 13.2-6.8zM5.8 17.6c-.6-1-.6-2.2 0-3.2C7.4 12 10.6 9.2 16 9.2c1.4 0 2.6.2 3.8.6L17 12.4c-.4 0-.6-.2-1-.2-2 0-3.8 1.8-3.8 3.8 0 .4 0 .6.2 1l-3.6 3.6c-1.2-.8-2.2-1.8-3-3zm9.2 2c.4 0 .6.2 1 .2 2 0 3.8-1.8 3.8-3.8 0-.4 0-.6-.2-1l3.6-3.6c1.2.8 2.2 1.8 3 3 .6 1 .6 2.2 0 3.2-1.8 2.4-5 5.2-10.2 5.2-1.2 0-2.6-.2-3.8-.6 0-.1 2.8-2.7 2.8-2.6z" />
    </svg>
  ),
  'end-mark': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M30 16.6c-.2-.2-.6-.4-.8-.4s-.6 0-.8.2l-.6.6c0 .2.2.4.2.6v.4c0 .8-.2 1.2-.6 1.6s-1 .6-1.6.6c-1.2 0-2-1.6-2.6-4.4-.2-.8-.2-1.6-.4-1.8-.4-1.6-1-2.8-1.8-3.6-1-.8-2-1.4-3.6-1.4-1.2 0-2 .4-2.8 1-.6.6-1 1.4-1 2.4 0 .4 0 .8.2 1.4.2.4.4.8.6 1.4-.8-.8-1.4-1.2-2-1.6-1-.2-1.6-.4-2.6-.4-.4-1-1.2-1.8-2.4-2.4-.2 0-.2-.2-.4-.2-.4-.2-.8-.6-1-1s-.2-.6-.2-1c0-.2 0-.4.2-.6l.4-.4c-1 0-1.6.2-2.2.4-.6.4-1 1-1 1.8 0 .6.2 1 .6 1.4.4.2 1 .4 1.6.8.2 0 .4 0 .6.2 1.4.4 2.2.8 2.6 1.6-1.6.2-3 .6-3.8 1.6-1 1-1.6 2.2-2 4-.4.2-.6.4-.8.8-.2.2-.2.6-.4.8l.8.4c.2 1.2.6 1.8 1.2 2.4s1.4.8 2 .8 1.4-.2 1.6-.6c.4-.4.8-1 .8-1.6v-.6c0-.2 0-.4-.2-.6-.2.2-.6.6-.8.6-.2-.2-.6 0-.8 0-.4 0-.8-.2-1.2-.4-.2-.4-.6-.8-.6-1.4 1.6-.8 3-1.6 3.8-2.4.8-1 1.4-2 1.4-3.2.8 0 1.6.2 2 .6.6.4 1.2.8 1.6 1.6-.6.2-1.2.6-1.6 1-.2.4-.4 1-.4 1.8 0 1.6.8 2.6 2 3.6 1.4 1 3 1.6 5 1.6 1.6 0 3.2-.4 4.8-1 1.6-.8 3.6-1.8 5.6-3.4.6-.4 1-1 1.4-1.4s.4-1 .4-1.4c0-.3-.2-.4-.4-.8zm-22.2.2c-.8.8-2 1.2-3.2 1.6.2-1.4.8-2.2 1.4-3 .8-.6 1.6-1 3-1.4-.2 1.2-.6 2.2-1.2 2.8z" />
    </svg>
  ),
  'diacritic': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M1.6 24.4h28.8v4.8H1.6v-4.8zM14.8 4L8.2 20.8h2.6l1.4-3.6h7.6l1.4 3.6H24L17.2 4h-2.4zm-1.6 10.8L16 7.2l2.8 7.6h-5.6z" />
    </svg>
  ),
  'indexes': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M11.8 1.6v6.2h4.6l-7 16.4H3.6v6.2H20v-6.2h-4.4l7-16.4h5.8V1.6H11.8z" />
    </svg>
  ),
  'print': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M26 10.2H6c-2.4 0-4.4 2-4.4 4.4v8.6h5.8V29h17.2v-5.8h5.8v-8.6c0-2.4-2-4.4-4.4-4.4zM21.8 26H10.2v-7.2h11.6V26zM26 16c-.8 0-1.4-.6-1.4-1.4 0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4c.2.8-.6 1.4-1.4 1.4zM24.6 3H7.4v5.8h17.2V3z" />
    </svg>
  ),
  'ellipsis': ({ style, className }) => (
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="6.8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
      <circle cx="25.2" cy="16" r="3" />
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
    <svg focusable="false" style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 1.8c-1.6 0-3.2.2-4.8.8H11l2.4 11.2c-.6.6-.8 1.4-.8 2.2 0 1.8 1.4 3.4 3.4 3.4.6 0 1.2-.2 1.8-.6l4.4 1.8 1.6-3.6-4.4-1.8c-.2-1-1-1.8-2-2.4l-1.8-7.2h.2c5.8 0 10.4 4.8 10.4 10.4 0 5.8-4.8 10.4-10.4 10.4C10 26.4 5.4 21.6 5.4 16c0-3.2 1.4-6 3.8-8L7.6 4.3c-3.6 2.6-6 6.8-6 11.6C1.6 23.8 8 30.4 16 30.4S30.4 24 30.4 15.9c0-7.8-6.6-14.1-14.4-14.1z" />
    </svg>
  )
};
