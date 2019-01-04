export const restricted = [
  {
    key: 'ctrl+1',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+2',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+3',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+4',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+5',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+6',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+7',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+8',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+9',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+tab',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+shift+tab',
    desc: 'Multiple. switching tabs'
  },
  {
    key: 'ctrl+w ctrl+f4 mod+w mod+f4 command+w command+f4',
    desc: 'Multiple browsers. Switching tabs'
  },
  {
    key: 'ctrl+shift+t mod+shift+t',
    desc: 'Multiple browsers. switching tabs'
  },
  {
    key: 'ctrl+t mod+t command+t',
    desc: 'Multiple browsers. new tab'
  },
  {
    key: 'ctrl+n mod+n command+n',
    desc: 'Multiple browsers. new browser window'
  },
  {
    key: 'alt+f4',
    desc: 'All applications. close the current window'
  },
  {
    key: 'alt+right shift+backspace',
    desc: 'Multiple browsers. Forward'
  },
  {
    key: 'alt+f4',
    desc: 'All applications. close the current window'
  },
  {
    key: 'alt+left backspace',
    desc: 'Multiple browsers. Back.'
  },
  {
    key: 'f5',
    desc: 'Multiple browsers. Reload.'
  },
  {
    key: 'ctrl+f5 mod+f5 command+f5',
    desc: 'Multiple browsers. Reload and clear cache.'
  },
  {
    key: 'alt+home',
    desc: 'Multiple browsers. Open homepage. Access browser help.'
  },
  {
    key: 'ctrl+plus',
    desc: 'Multiple browsers. Zoom in.'
  },
  {
    key: 'ctrl+-',
    desc: 'Multiple browsers. Zoom out.'
  },
  {
    key: 'ctrl+plus',
    desc: 'Multiple browsers. Zoom in.'
  },
  {
    key: 'ctrl+0',
    desc: 'Multiple browsers. Reset zoom to defaults.'
  },
  {
    key: 'f11',
    desc: 'Multiple browsers. Fullscreen mode.'
  },
  {
    key: 'pagedown',
    desc: 'Multiple browsers. Scroll down one frame.'
  },
  {
    key: 'pageup',
    desc: 'Multiple browsers. Scroll up one frame.'
  },
  {
    key: 'ctrl+l alt+D f6 ctrl+k ctrl+e',
    desc: 'Multiple browsers. Focus address bar.'
  },
  {
    key: 'ctrl+f mod+f command+f f3',
    desc: 'Multiple browsers. Search within page.'
  },
  {
    key: 'ctrl+g mod+g command+g',
    desc: 'Multiple browsers. Find next match within page text (find-in browser).'
  },
  {
    key: 'shift+ctrl+g shift+mod+g shift+command+g',
    desc: 'Multiple browsers. Find previous match within page text (find-in browser).'
  },
  {
    key: 'ctrl+h mod+h command+h',
    desc: 'Multiple browsers. Open browsing history.'
  },
  {
    key: 'ctrl+j mod+j command+j',
    desc: 'Multiple browsers. Open download history.'
  },
  {
    key: 'ctrl+d mod+d command+d',
    desc: 'Multiple browsers. Bookmark the page.'
  },
  {
    key: 'shift+ctrl+del ctrl+shift+del shift+mod+del mod+shift+del command+shift+del shift+command+del',
    desc: 'Multiple browsers. Open clear browsing history window.'
  },
  {
    key: 'ctrl+p mod+p command+p',
    desc: 'Applications. Print the current page.'
  },
  {
    key: 'ctrl+s mod+s command+s',
    desc: 'Applications. Save the page to your computer.'
  },
  {
    key: 'ctrl+o mod+o command+o',
    desc: 'Applications. Open a file from your compunter.'
  },
  {
    key: 'ctrl+u mod+u command+u',
    desc: 'Multiple Browsers. View page source.'
  },
  {
    key: 'f12',
    desc: 'Multiple Browsers. Open developer tools.'
  }
];

export function isRestricted(str) {
  const keyIndex = restricted.findIndex(hk => {
    const list = hk.key.split(' ');
    return list.includes(str);
  });
  if (keyIndex === -1) {
    return keyIndex;
  } else {
    return restricted[keyIndex];
  }
}
