(self.webpackChunk_folio_stripes_components=self.webpackChunk_folio_stripes_components||[]).push([[8222],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval("/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BN: () => (/* binding */ MDXContext),\n/* harmony export */   RP: () => (/* binding */ useMDXComponents),\n/* harmony export */   gz: () => (/* binding */ withMDXComponents),\n/* harmony export */   xA: () => (/* binding */ MDXProvider)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./node_modules/react/index.js\");\n/**\n * @typedef {import('react').ReactNode} ReactNode\n * @typedef {import('mdx/types.js').MDXComponents} Components\n *\n * @typedef Props\n *   Configuration.\n * @property {Components | MergeComponents | null | undefined} [components]\n *   Mapping of names for JSX components to React components.\n * @property {boolean | null | undefined} [disableParentContext=false]\n *   Turn off outer component context.\n * @property {ReactNode | null | undefined} [children]\n *   Children.\n *\n * @callback MergeComponents\n *   Custom merge function.\n * @param {Components} currentComponents\n *   Current components from the context.\n * @returns {Components}\n *   Merged components.\n */\n\n\n\n/**\n * @type {import('react').Context<Components>}\n * @deprecated\n *   This export is marked as a legacy feature.\n *   That means it’s no longer recommended for use as it might be removed\n *   in a future major release.\n *\n *   Please use `useMDXComponents` to get context based components and\n *   `MDXProvider` to set context based components instead.\n */\nconst MDXContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({})\n\n/**\n * @param {import('react').ComponentType<any>} Component\n * @deprecated\n *   This export is marked as a legacy feature.\n *   That means it’s no longer recommended for use as it might be removed\n *   in a future major release.\n *\n *   Please use `useMDXComponents` to get context based components instead.\n */\nfunction withMDXComponents(Component) {\n  return boundMDXComponent\n\n  /**\n   * @param {Record<string, unknown> & {components?: Components | null | undefined}} props\n   * @returns {JSX.Element}\n   */\n  function boundMDXComponent(props) {\n    const allComponents = useMDXComponents(props.components)\n    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, {...props, allComponents})\n  }\n}\n\n/**\n * Get current components from the MDX Context.\n *\n * @param {Components | MergeComponents | null | undefined} [components]\n *   Additional components to use or a function that takes the current\n *   components and filters/merges/changes them.\n * @returns {Components}\n *   Current components.\n */\nfunction useMDXComponents(components) {\n  const contextComponents = react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext)\n\n  // Memoize to avoid unnecessary top-level context changes\n  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {\n    // Custom merge via a function prop\n    if (typeof components === 'function') {\n      return components(contextComponents)\n    }\n\n    return {...contextComponents, ...components}\n  }, [contextComponents, components])\n}\n\n/** @type {Components} */\nconst emptyObject = {}\n\n/**\n * Provider for MDX context\n *\n * @param {Props} props\n * @returns {JSX.Element}\n */\nfunction MDXProvider({components, children, disableParentContext}) {\n  /** @type {Components} */\n  let allComponents\n\n  if (disableParentContext) {\n    allComponents =\n      typeof components === 'function'\n        ? components({})\n        : components || emptyObject\n  } else {\n    allComponents = useMDXComponents(components)\n  }\n\n  return react__WEBPACK_IMPORTED_MODULE_0__.createElement(\n    MDXContext.Provider,\n    {value: allComponents},\n    children\n  )\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQG1keC1qcy9yZWFjdC9saWIvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0Bmb2xpby9zdHJpcGVzLWNvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvQG1keC1qcy9yZWFjdC9saWIvaW5kZXguanM/YTM0NyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ3JlYWN0JykuUmVhY3ROb2RlfSBSZWFjdE5vZGVcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ21keC90eXBlcy5qcycpLk1EWENvbXBvbmVudHN9IENvbXBvbmVudHNcbiAqXG4gKiBAdHlwZWRlZiBQcm9wc1xuICogICBDb25maWd1cmF0aW9uLlxuICogQHByb3BlcnR5IHtDb21wb25lbnRzIHwgTWVyZ2VDb21wb25lbnRzIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2NvbXBvbmVudHNdXG4gKiAgIE1hcHBpbmcgb2YgbmFtZXMgZm9yIEpTWCBjb21wb25lbnRzIHRvIFJlYWN0IGNvbXBvbmVudHMuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkfSBbZGlzYWJsZVBhcmVudENvbnRleHQ9ZmFsc2VdXG4gKiAgIFR1cm4gb2ZmIG91dGVyIGNvbXBvbmVudCBjb250ZXh0LlxuICogQHByb3BlcnR5IHtSZWFjdE5vZGUgfCBudWxsIHwgdW5kZWZpbmVkfSBbY2hpbGRyZW5dXG4gKiAgIENoaWxkcmVuLlxuICpcbiAqIEBjYWxsYmFjayBNZXJnZUNvbXBvbmVudHNcbiAqICAgQ3VzdG9tIG1lcmdlIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtDb21wb25lbnRzfSBjdXJyZW50Q29tcG9uZW50c1xuICogICBDdXJyZW50IGNvbXBvbmVudHMgZnJvbSB0aGUgY29udGV4dC5cbiAqIEByZXR1cm5zIHtDb21wb25lbnRzfVxuICogICBNZXJnZWQgY29tcG9uZW50cy5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbi8qKlxuICogQHR5cGUge2ltcG9ydCgncmVhY3QnKS5Db250ZXh0PENvbXBvbmVudHM+fVxuICogQGRlcHJlY2F0ZWRcbiAqICAgVGhpcyBleHBvcnQgaXMgbWFya2VkIGFzIGEgbGVnYWN5IGZlYXR1cmUuXG4gKiAgIFRoYXQgbWVhbnMgaXTigJlzIG5vIGxvbmdlciByZWNvbW1lbmRlZCBmb3IgdXNlIGFzIGl0IG1pZ2h0IGJlIHJlbW92ZWRcbiAqICAgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS5cbiAqXG4gKiAgIFBsZWFzZSB1c2UgYHVzZU1EWENvbXBvbmVudHNgIHRvIGdldCBjb250ZXh0IGJhc2VkIGNvbXBvbmVudHMgYW5kXG4gKiAgIGBNRFhQcm92aWRlcmAgdG8gc2V0IGNvbnRleHQgYmFzZWQgY29tcG9uZW50cyBpbnN0ZWFkLlxuICovXG5leHBvcnQgY29uc3QgTURYQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoe30pXG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJ3JlYWN0JykuQ29tcG9uZW50VHlwZTxhbnk+fSBDb21wb25lbnRcbiAqIEBkZXByZWNhdGVkXG4gKiAgIFRoaXMgZXhwb3J0IGlzIG1hcmtlZCBhcyBhIGxlZ2FjeSBmZWF0dXJlLlxuICogICBUaGF0IG1lYW5zIGl04oCZcyBubyBsb25nZXIgcmVjb21tZW5kZWQgZm9yIHVzZSBhcyBpdCBtaWdodCBiZSByZW1vdmVkXG4gKiAgIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuXG4gKlxuICogICBQbGVhc2UgdXNlIGB1c2VNRFhDb21wb25lbnRzYCB0byBnZXQgY29udGV4dCBiYXNlZCBjb21wb25lbnRzIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoTURYQ29tcG9uZW50cyhDb21wb25lbnQpIHtcbiAgcmV0dXJuIGJvdW5kTURYQ29tcG9uZW50XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgdW5rbm93bj4gJiB7Y29tcG9uZW50cz86IENvbXBvbmVudHMgfCBudWxsIHwgdW5kZWZpbmVkfX0gcHJvcHNcbiAgICogQHJldHVybnMge0pTWC5FbGVtZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gYm91bmRNRFhDb21wb25lbnQocHJvcHMpIHtcbiAgICBjb25zdCBhbGxDb21wb25lbnRzID0gdXNlTURYQ29tcG9uZW50cyhwcm9wcy5jb21wb25lbnRzKVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgey4uLnByb3BzLCBhbGxDb21wb25lbnRzfSlcbiAgfVxufVxuXG4vKipcbiAqIEdldCBjdXJyZW50IGNvbXBvbmVudHMgZnJvbSB0aGUgTURYIENvbnRleHQuXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnRzIHwgTWVyZ2VDb21wb25lbnRzIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2NvbXBvbmVudHNdXG4gKiAgIEFkZGl0aW9uYWwgY29tcG9uZW50cyB0byB1c2Ugb3IgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBjdXJyZW50XG4gKiAgIGNvbXBvbmVudHMgYW5kIGZpbHRlcnMvbWVyZ2VzL2NoYW5nZXMgdGhlbS5cbiAqIEByZXR1cm5zIHtDb21wb25lbnRzfVxuICogICBDdXJyZW50IGNvbXBvbmVudHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VNRFhDb21wb25lbnRzKGNvbXBvbmVudHMpIHtcbiAgY29uc3QgY29udGV4dENvbXBvbmVudHMgPSBSZWFjdC51c2VDb250ZXh0KE1EWENvbnRleHQpXG5cbiAgLy8gTWVtb2l6ZSB0byBhdm9pZCB1bm5lY2Vzc2FyeSB0b3AtbGV2ZWwgY29udGV4dCBjaGFuZ2VzXG4gIHJldHVybiBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICAvLyBDdXN0b20gbWVyZ2UgdmlhIGEgZnVuY3Rpb24gcHJvcFxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudHMoY29udGV4dENvbXBvbmVudHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsuLi5jb250ZXh0Q29tcG9uZW50cywgLi4uY29tcG9uZW50c31cbiAgfSwgW2NvbnRleHRDb21wb25lbnRzLCBjb21wb25lbnRzXSlcbn1cblxuLyoqIEB0eXBlIHtDb21wb25lbnRzfSAqL1xuY29uc3QgZW1wdHlPYmplY3QgPSB7fVxuXG4vKipcbiAqIFByb3ZpZGVyIGZvciBNRFggY29udGV4dFxuICpcbiAqIEBwYXJhbSB7UHJvcHN9IHByb3BzXG4gKiBAcmV0dXJucyB7SlNYLkVsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBNRFhQcm92aWRlcih7Y29tcG9uZW50cywgY2hpbGRyZW4sIGRpc2FibGVQYXJlbnRDb250ZXh0fSkge1xuICAvKiogQHR5cGUge0NvbXBvbmVudHN9ICovXG4gIGxldCBhbGxDb21wb25lbnRzXG5cbiAgaWYgKGRpc2FibGVQYXJlbnRDb250ZXh0KSB7XG4gICAgYWxsQ29tcG9uZW50cyA9XG4gICAgICB0eXBlb2YgY29tcG9uZW50cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IGNvbXBvbmVudHMoe30pXG4gICAgICAgIDogY29tcG9uZW50cyB8fCBlbXB0eU9iamVjdFxuICB9IGVsc2Uge1xuICAgIGFsbENvbXBvbmVudHMgPSB1c2VNRFhDb21wb25lbnRzKGNvbXBvbmVudHMpXG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICBNRFhDb250ZXh0LlByb3ZpZGVyLFxuICAgIHt2YWx1ZTogYWxsQ29tcG9uZW50c30sXG4gICAgY2hpbGRyZW5cbiAgKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/@mdx-js/react/lib/index.js\n")},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   W8: () => (/* reexport safe */ _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.W8)\n/* harmony export */ });\n/* harmony import */ var _chunk_HLWAVYOI_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-HLWAVYOI.mjs");\n/* harmony import */ var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs");\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQHN0b3J5Ym9vay9hZGRvbi1kb2NzL2Rpc3QvaW5kZXgubWpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0Bmb2xpby9zdHJpcGVzLWNvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvQHN0b3J5Ym9vay9hZGRvbi1kb2NzL2Rpc3QvaW5kZXgubWpzP2ViNmEiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgRG9jc1JlbmRlcmVyIH0gZnJvbSAnLi9jaHVuay1ITFdBVllPSS5tanMnO1xuZXhwb3J0ICogZnJvbSAnQHN0b3J5Ym9vay9ibG9ja3MnO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/@storybook/addon-docs/dist/index.mjs\n')},"./guides/AboutStripesComponents.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   __namedExportsOrder: () => (/* binding */ __namedExportsOrder),\n/* harmony export */   __page: () => (/* binding */ __page),\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");\n/* harmony import */ var _home_runner_work_stripes_components_stripes_components_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mdx-js/react/lib/index.js");\n/* harmony import */ var _storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/react/jsx-runtime.js");\n\n\n\n\n\n\n\n\nfunction _createMdxContent(props) {\n  const _components = Object.assign({\n    h1: "h1",\n    p: "p"\n  }, (0,_home_runner_work_stripes_components_stripes_components_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_3__/* .useMDXComponents */ .RP)(), props.components);\n  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {\n    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__/* .Meta */ .W8, {\n      title: "About Stripes Components"\n    }), "\\n", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components.h1, {\n      id: "welcome-to-the-stripes-components-storybook",\n      children: "Welcome to the Stripes-Components Storybook"\n    }), "\\n", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components.p, {\n      children: "The basic building blocks of FOLIO UI. See our developer guides and component listing in the navigation to the left."\n    })]\n  });\n}\nfunction MDXContent(props = {}) {\n  const {\n    wrapper: MDXLayout\n  } = Object.assign({}, (0,_home_runner_work_stripes_components_stripes_components_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_3__/* .useMDXComponents */ .RP)(), props.components);\n  return MDXLayout ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(MDXLayout, {\n    ...props,\n    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\n/* ========= */\nconst __page = () => {\n  throw new Error("Docs-only story");\n};\n__page.parameters = {\n  docsOnly: true\n};\nconst componentMeta = {\n  title: \'About Stripes Components\',\n  tags: [\'stories-mdx\'],\n  includeStories: ["__page"]\n};\ncomponentMeta.parameters = componentMeta.parameters || {};\ncomponentMeta.parameters.docs = {\n  ...(componentMeta.parameters.docs || {}),\n  page: MDXContent\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (componentMeta);;const __namedExportsOrder = ["__page"];//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ndWlkZXMvQWJvdXRTdHJpcGVzQ29tcG9uZW50cy5zdG9yaWVzLm1keCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0Bmb2xpby9zdHJpcGVzLWNvbXBvbmVudHMvLi9ndWlkZXMvQWJvdXRTdHJpcGVzQ29tcG9uZW50cy5zdG9yaWVzLm1keD8yNjkzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgdXNlTURYQ29tcG9uZW50cyBhcyBfcHJvdmlkZUNvbXBvbmVudHMgfSBmcm9tIFwiL2hvbWUvcnVubmVyL3dvcmsvc3RyaXBlcy1jb21wb25lbnRzL3N0cmlwZXMtY29tcG9uZW50cy9ub2RlX21vZHVsZXMvQHN0b3J5Ym9vay9hZGRvbi1kb2NzL2Rpc3Qvc2hpbXMvbWR4LXJlYWN0LXNoaW1cIjtcbmltcG9ydCB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1kb2NzJztcbmltcG9ydCB7IGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgeyBGcmFnbWVudCBhcyBfRnJhZ21lbnQgfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmltcG9ydCB7IGpzeHMgYXMgX2pzeHMgfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmZ1bmN0aW9uIF9jcmVhdGVNZHhDb250ZW50KHByb3BzKSB7XG4gIGNvbnN0IF9jb21wb25lbnRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgaDE6IFwiaDFcIixcbiAgICBwOiBcInBcIlxuICB9LCBfcHJvdmlkZUNvbXBvbmVudHMoKSwgcHJvcHMuY29tcG9uZW50cyk7XG4gIHJldHVybiAvKiNfX1BVUkVfXyovX2pzeHMoX0ZyYWdtZW50LCB7XG4gICAgY2hpbGRyZW46IFsvKiNfX1BVUkVfXyovX2pzeChNZXRhLCB7XG4gICAgICB0aXRsZTogXCJBYm91dCBTdHJpcGVzIENvbXBvbmVudHNcIlxuICAgIH0pLCBcIlxcblwiLCAvKiNfX1BVUkVfXyovX2pzeChfY29tcG9uZW50cy5oMSwge1xuICAgICAgaWQ6IFwid2VsY29tZS10by10aGUtc3RyaXBlcy1jb21wb25lbnRzLXN0b3J5Ym9va1wiLFxuICAgICAgY2hpbGRyZW46IFwiV2VsY29tZSB0byB0aGUgU3RyaXBlcy1Db21wb25lbnRzIFN0b3J5Ym9va1wiXG4gICAgfSksIFwiXFxuXCIsIC8qI19fUFVSRV9fKi9fanN4KF9jb21wb25lbnRzLnAsIHtcbiAgICAgIGNoaWxkcmVuOiBcIlRoZSBiYXNpYyBidWlsZGluZyBibG9ja3Mgb2YgRk9MSU8gVUkuIFNlZSBvdXIgZGV2ZWxvcGVyIGd1aWRlcyBhbmQgY29tcG9uZW50IGxpc3RpbmcgaW4gdGhlIG5hdmlnYXRpb24gdG8gdGhlIGxlZnQuXCJcbiAgICB9KV1cbiAgfSk7XG59XG5mdW5jdGlvbiBNRFhDb250ZW50KHByb3BzID0ge30pIHtcbiAgY29uc3Qge1xuICAgIHdyYXBwZXI6IE1EWExheW91dFxuICB9ID0gT2JqZWN0LmFzc2lnbih7fSwgX3Byb3ZpZGVDb21wb25lbnRzKCksIHByb3BzLmNvbXBvbmVudHMpO1xuICByZXR1cm4gTURYTGF5b3V0ID8gLyojX19QVVJFX18qL19qc3goTURYTGF5b3V0LCB7XG4gICAgLi4ucHJvcHMsXG4gICAgY2hpbGRyZW46IC8qI19fUFVSRV9fKi9fanN4KF9jcmVhdGVNZHhDb250ZW50LCB7XG4gICAgICAuLi5wcm9wc1xuICAgIH0pXG4gIH0pIDogX2NyZWF0ZU1keENvbnRlbnQocHJvcHMpO1xufVxuLyogPT09PT09PT09ICovXG5leHBvcnQgY29uc3QgX19wYWdlID0gKCkgPT4ge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJEb2NzLW9ubHkgc3RvcnlcIik7XG59O1xuX19wYWdlLnBhcmFtZXRlcnMgPSB7XG4gIGRvY3NPbmx5OiB0cnVlXG59O1xuY29uc3QgY29tcG9uZW50TWV0YSA9IHtcbiAgdGl0bGU6ICdBYm91dCBTdHJpcGVzIENvbXBvbmVudHMnLFxuICB0YWdzOiBbJ3N0b3JpZXMtbWR4J10sXG4gIGluY2x1ZGVTdG9yaWVzOiBbXCJfX3BhZ2VcIl1cbn07XG5jb21wb25lbnRNZXRhLnBhcmFtZXRlcnMgPSBjb21wb25lbnRNZXRhLnBhcmFtZXRlcnMgfHwge307XG5jb21wb25lbnRNZXRhLnBhcmFtZXRlcnMuZG9jcyA9IHtcbiAgLi4uKGNvbXBvbmVudE1ldGEucGFyYW1ldGVycy5kb2NzIHx8IHt9KSxcbiAgcGFnZTogTURYQ29udGVudFxufTtcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudE1ldGE7O2V4cG9ydCBjb25zdCBfX25hbWVkRXhwb3J0c09yZGVyID0gW1wiX19wYWdlXCJdOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./guides/AboutStripesComponents.stories.mdx\n')},"./node_modules/memoizerific sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/memoizerific sync recursive",module.exports=webpackEmptyContext}}]);