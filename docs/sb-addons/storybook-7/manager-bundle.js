try{
(()=>{var Xe=__STORYBOOK_API__,{ActiveTabs:Ze,Consumer:Ve,ManagerContext:et,Provider:tt,addons:N,combineParameters:rt,controlOrMetaKey:at,controlOrMetaSymbol:ot,eventMatchesShortcut:nt,eventToShortcut:st,isMacLike:it,isShortcutTaken:pt,keyToSymbol:lt,merge:dt,mockChannel:ut,optionOrAltSymbol:ft,shortcutMatchesShortcut:ct,shortcutToHumanString:bt,types:mt,useAddonState:gt,useArgTypes:ht,useArgs:yt,useChannel:vt,useGlobalTypes:xt,useGlobals:wt,useParameter:Ft,useSharedState:St,useStoryPrepared:kt,useStorybookApi:Ct,useStorybookState:Pt}=__STORYBOOK_API__;var G=(()=>{let e;return typeof window<"u"?e=window:typeof globalThis<"u"?e=globalThis:typeof window<"u"?e=window:typeof self<"u"?e=self:e={},e})();var zt=__STORYBOOK_CLIENT_LOGGER__,{deprecate:Mt,logger:L,once:At,pretty:Dt}=__STORYBOOK_CLIENT_LOGGER__;function v(){return v=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},v.apply(this,arguments)}function ae(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e,t){return x=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},x(e,t)}function oe(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,x(e,t)}function M(e){return M=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},M(e)}function ne(e){try{return Function.toString.call(e).indexOf("[native code]")!==-1}catch{return typeof e=="function"}}function U(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(U=function(){return!!e})()}function se(e,t,r){if(U())return Reflect.construct.apply(null,arguments);var a=[null];a.push.apply(a,t);var o=new(e.bind.apply(e,a));return r&&x(o,r.prototype),o}function A(e){var t=typeof Map=="function"?new Map:void 0;return A=function(r){if(r===null||!ne(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(r))return t.get(r);t.set(r,a)}function a(){return se(r,arguments,M(this).constructor)}return a.prototype=Object.create(r.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),x(a,r)},A(e)}var ie={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function pe(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[0],o=[],n;for(n=1;n<t.length;n+=1)o.push(t[n]);return o.forEach(function(s){a=a.replace(/%[a-z]/,s)}),a}var u=function(e){oe(t,e);function t(r){for(var a,o=arguments.length,n=new Array(o>1?o-1:0),s=1;s<o;s++)n[s-1]=arguments[s];return a=e.call(this,pe.apply(void 0,[ie[r]].concat(n)))||this,ae(a)}return t}(A(Error));function _(e){return Math.round(e*255)}function le(e,t,r){return _(e)+","+_(t)+","+_(r)}function w(e,t,r,a){if(a===void 0&&(a=le),t===0)return a(r,r,r);var o=(e%360+360)%360/60,n=(1-Math.abs(2*r-1))*t,s=n*(1-Math.abs(o%2-1)),p=0,l=0,d=0;o>=0&&o<1?(p=n,l=s):o>=1&&o<2?(p=s,l=n):o>=2&&o<3?(l=n,d=s):o>=3&&o<4?(l=s,d=n):o>=4&&o<5?(p=s,d=n):o>=5&&o<6&&(p=n,d=s);var h=r-n/2,y=p+h,f=l+h,I=d+h;return a(y,f,I)}var Y={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function de(e){if(typeof e!="string")return e;var t=e.toLowerCase();return Y[t]?"#"+Y[t]:e}var ue=/^#[a-fA-F0-9]{6}$/,fe=/^#[a-fA-F0-9]{8}$/,ce=/^#[a-fA-F0-9]{3}$/,be=/^#[a-fA-F0-9]{4}$/,B=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,me=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,ge=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,he=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function O(e){if(typeof e!="string")throw new u(3);var t=de(e);if(t.match(ue))return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16)};if(t.match(fe)){var r=parseFloat((parseInt(""+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16),alpha:r}}if(t.match(ce))return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16)};if(t.match(be)){var a=parseFloat((parseInt(""+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16),alpha:a}}var o=B.exec(t);if(o)return{red:parseInt(""+o[1],10),green:parseInt(""+o[2],10),blue:parseInt(""+o[3],10)};var n=me.exec(t.substring(0,50));if(n)return{red:parseInt(""+n[1],10),green:parseInt(""+n[2],10),blue:parseInt(""+n[3],10),alpha:parseFloat(""+n[4])>1?parseFloat(""+n[4])/100:parseFloat(""+n[4])};var s=ge.exec(t);if(s){var p=parseInt(""+s[1],10),l=parseInt(""+s[2],10)/100,d=parseInt(""+s[3],10)/100,h="rgb("+w(p,l,d)+")",y=B.exec(h);if(!y)throw new u(4,t,h);return{red:parseInt(""+y[1],10),green:parseInt(""+y[2],10),blue:parseInt(""+y[3],10)}}var f=he.exec(t.substring(0,50));if(f){var I=parseInt(""+f[1],10),te=parseInt(""+f[2],10)/100,re=parseInt(""+f[3],10)/100,q="rgb("+w(I,te,re)+")",S=B.exec(q);if(!S)throw new u(4,t,q);return{red:parseInt(""+S[1],10),green:parseInt(""+S[2],10),blue:parseInt(""+S[3],10),alpha:parseFloat(""+f[4])>1?parseFloat(""+f[4])/100:parseFloat(""+f[4])}}throw new u(5)}function ye(e){var t=e.red/255,r=e.green/255,a=e.blue/255,o=Math.max(t,r,a),n=Math.min(t,r,a),s=(o+n)/2;if(o===n)return e.alpha!==void 0?{hue:0,saturation:0,lightness:s,alpha:e.alpha}:{hue:0,saturation:0,lightness:s};var p,l=o-n,d=s>.5?l/(2-o-n):l/(o+n);switch(o){case t:p=(r-a)/l+(r<a?6:0);break;case r:p=(a-t)/l+2;break;default:p=(t-r)/l+4;break}return p*=60,e.alpha!==void 0?{hue:p,saturation:d,lightness:s,alpha:e.alpha}:{hue:p,saturation:d,lightness:s}}function J(e){return ye(O(e))}var ve=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},D=ve;function g(e){var t=e.toString(16);return t.length===1?"0"+t:t}function R(e){return g(Math.round(e*255))}function xe(e,t,r){return D("#"+R(e)+R(t)+R(r))}function C(e,t,r){return w(e,t,r,xe)}function we(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return C(e,t,r);if(typeof e=="object"&&t===void 0&&r===void 0)return C(e.hue,e.saturation,e.lightness);throw new u(1)}function Fe(e,t,r,a){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?C(e,t,r):"rgba("+w(e,t,r)+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?C(e.hue,e.saturation,e.lightness):"rgba("+w(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new u(2)}function H(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return D("#"+g(e)+g(t)+g(r));if(typeof e=="object"&&t===void 0&&r===void 0)return D("#"+g(e.red)+g(e.green)+g(e.blue));throw new u(6)}function F(e,t,r,a){if(typeof e=="string"&&typeof t=="number"){var o=O(e);return"rgba("+o.red+","+o.green+","+o.blue+","+t+")"}else{if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?H(e,t,r):"rgba("+e+","+t+","+r+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?H(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new u(7)}var Se=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},ke=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},Ce=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Pe=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function Q(e){if(typeof e!="object")throw new u(8);if(ke(e))return F(e);if(Se(e))return H(e);if(Pe(e))return Fe(e);if(Ce(e))return we(e);throw new u(8)}function X(e,t,r){return function(){var a=r.concat(Array.prototype.slice.call(arguments));return a.length>=t?e.apply(this,a):X(e,t,a)}}function j(e){return X(e,e.length,[])}function T(e,t,r){return Math.max(e,Math.min(t,r))}function Oe(e,t){if(t==="transparent")return t;var r=J(t);return Q(v({},r,{lightness:T(0,1,r.lightness-parseFloat(e))}))}var je=j(Oe),Te=je;function Ie(e,t){if(t==="transparent")return t;var r=J(t);return Q(v({},r,{lightness:T(0,1,r.lightness+parseFloat(e))}))}var _e=j(Ie),Be=_e;function Re(e,t){if(t==="transparent")return t;var r=O(t),a=typeof r.alpha=="number"?r.alpha:1,o=v({},r,{alpha:T(0,1,(a*100+parseFloat(e)*100)/100)});return F(o)}var Yt=j(Re);function Ee(e,t){if(t==="transparent")return t;var r=O(t),a=typeof r.alpha=="number"?r.alpha:1,o=v({},r,{alpha:T(0,1,+(a*100-parseFloat(e)*100).toFixed(2)/100)});return F(o)}var ze=j(Ee),Me=ze,i={primary:"#FF4785",secondary:"#029CFD",tertiary:"#FAFBFC",ancillary:"#22a699",orange:"#FC521F",gold:"#FFAE00",green:"#66BF3C",seafoam:"#37D5D3",purple:"#6F2CAC",ultraviolet:"#2A0481",lightest:"#FFFFFF",lighter:"#F7FAFC",light:"#EEF3F6",mediumlight:"#ECF4F9",medium:"#D9E8F2",mediumdark:"#73828C",dark:"#5C6870",darker:"#454E54",darkest:"#2E3438",border:"hsla(203, 50%, 30%, 0.15)",positive:"#66BF3C",negative:"#FF4400",warning:"#E69D00",critical:"#FFFFFF",defaultText:"#2E3438",inverseText:"#FFFFFF",positiveText:"#448028",negativeText:"#D43900",warningText:"#A15C20"},K={app:"#F6F9FC",bar:i.lightest,content:i.lightest,preview:i.lightest,gridCellSize:10,hoverable:Me(.9,i.secondary),positive:"#E1FFD4",negative:"#FEDED2",warning:"#FFF5CF",critical:"#FF4400"},P={fonts:{base:['"Nunito Sans"',"-apple-system",'".SFNSText-Regular"','"San Francisco"',"BlinkMacSystemFont",'"Segoe UI"','"Helvetica Neue"',"Helvetica","Arial","sans-serif"].join(", "),mono:["ui-monospace","Menlo","Monaco",'"Roboto Mono"','"Oxygen Mono"','"Ubuntu Monospace"','"Source Code Pro"','"Droid Sans Mono"','"Courier New"',"monospace"].join(", ")},weight:{regular:400,bold:700},size:{s1:12,s2:14,s3:16,m1:20,m2:24,m3:28,l1:32,l2:40,l3:48,code:90}},Ae={base:"light",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:K.app,appContentBg:i.lightest,appPreviewBg:i.lightest,appBorderColor:i.border,appBorderRadius:4,fontBase:P.fonts.base,fontCode:P.fonts.mono,textColor:i.darkest,textInverseColor:i.lightest,textMutedColor:i.dark,barTextColor:i.mediumdark,barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:i.lightest,buttonBg:K.app,buttonBorder:i.medium,booleanBg:i.mediumlight,booleanSelectedBg:i.lightest,inputBg:i.lightest,inputBorder:i.border,inputTextColor:i.darkest,inputBorderRadius:4},W=Ae,De={base:"dark",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:"#222425",appContentBg:"#1B1C1D",appPreviewBg:i.lightest,appBorderColor:"rgba(255,255,255,.1)",appBorderRadius:4,fontBase:P.fonts.base,fontCode:P.fonts.mono,textColor:"#C9CDCF",textInverseColor:"#222425",textMutedColor:"#798186",barTextColor:"#798186",barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:"#292C2E",buttonBg:"#222425",buttonBorder:"rgba(255,255,255,.1)",booleanBg:"#222425",booleanSelectedBg:"#2E3438",inputBg:"#1B1C1D",inputBorder:"rgba(255,255,255,.1)",inputTextColor:i.lightest,inputBorderRadius:4},He=De,{window:E}=G;var $e=e=>typeof e!="string"?(L.warn(`Color passed to theme object should be a string. Instead ${e}(${typeof e}) was passed.`),!1):!0,qe=e=>!/(gradient|var|calc)/.test(e),Ne=(e,t)=>e==="darken"?F(`${Te(1,t)}`,.95):e==="lighten"?F(`${Be(1,t)}`,.95):t,Z=e=>t=>{if(!$e(t)||!qe(t))return t;try{return Ne(e,t)}catch{return t}},Kt=Z("lighten"),Wt=Z("darken"),Ge=()=>!E||!E.matchMedia?"light":E.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",k={light:W,dark:He,normal:W},z=Ge(),$=(e={base:z},t)=>{let r={...k[z],...k[e.base]||{},...e,base:k[e.base]?e.base:z};return{...t,...r,barSelectedColor:e.barSelectedColor||r.colorSecondary}};var V={name:"@folio/stripes-components",version:"13.0.0",description:"Component library for building Stripes applications.",license:"Apache-2.0",repository:"folio-org/stripes-components",sideEffects:["*.css"],publishConfig:{registry:"https://repository.folio.org/repository/npm-folio/"},scripts:{docgen:"react-docgen ./lib/ --pretty -e index.js -o ./docs/reactdoc.json ",eslint:"eslint ./","formatjs-compile":"formatjs compile-folder --ast --format simple ./translations/stripes-components ./translations/stripes-components/compiled",lint:'eslint ./ && stylelint "lib/**/*.css"',storybook:"storybook dev -p 9001 -c .storybook","storybook-build":"storybook build -c .storybook -o .out",stylelint:'stylelint "lib/**/*.css"',test:"stripes test karma","test-dev":"stripes test karma --watch"},engines:{node:">=10.0.0"},stripes:{type:"components",actionNames:["selectPreviousRow","selectNextRow","selectFirstOrCurrentRow","unfocusRow","focusBeyond"]},resolutions:{polished:"4.2.2"},devDependencies:{"@babel/core":"^7.8.0","@babel/eslint-parser":"^7.17.0","@babel/plugin-proposal-class-properties":"^7.0.0","@babel/plugin-proposal-decorators":"^7.0.0","@babel/plugin-proposal-export-namespace-from":"^7.0.0","@babel/plugin-proposal-function-sent":"^7.0.0","@babel/plugin-proposal-numeric-separator":"^7.0.0","@babel/plugin-proposal-throw-expressions":"^7.0.0","@babel/plugin-syntax-import-meta":"^7.0.0","@babel/preset-env":"^7.0.0","@babel/preset-react":"^7.7.4","@babel/register":"^7.0.0","@bigtest/interactor":"0.7.2","@csstools/postcss-global-data":"^3.0.0","@csstools/postcss-relative-color-syntax":"^3.0.7","@folio/eslint-config-stripes":"^8.0.0","@folio/stripes-cli":"^4.0.0","@folio/stripes-testing":"^5.0.0","@formatjs/cli":"^6.1.3","@storybook/addon-actions":"^7.6.12","@storybook/addon-essentials":"^7.6.12","@storybook/addon-mdx-gfm":"7.6.12","@storybook/addons":"^7.6.12","@storybook/manager-api":"^7.6.12","@storybook/react":"^7.6.12","@storybook/react-webpack5":"7.6.12","@svgr/webpack":"^8.1.0",autoprefixer:"^10.4.13","babel-loader":"^9.1.3","babel-plugin-lodash":"^3.3.4","babel-plugin-remove-jsx-attributes":"^0.0.2",chai:"^4.1.2","core-js":"^3.6.1",eslint:"^8.31.0",faker:"^4.1.0","karma-viewport":"^1.0.4",mocha:"^10.2.0",moment:"^2.29.0",postcss:"^8.4.2","postcss-custom-media":"^9.0.1","postcss-import":"^15.0.1","postcss-loader":"^7.0.2",react:"^18.2","react-dom":"^18.2","react-intl":"^6.4.4","react-redux":"^8.0.5","react-router":"^5.2.0","react-router-dom":"^5.2.0",redux:"^4.0.0","redux-form":"^8.3.0","regenerator-runtime":"^0.14.0",sinon:"^17.0.0",storybook:"7.6.12",stylelint:"^16.2.0","stylelint-config-standard":"^36.0.0","stylelint-junit-formatter":"^0.2.2"},dependencies:{"@folio/stripes-react-hotkeys":"^3.2.1",classnames:"^2.2.5","currency-codes":"2.1.0",dayjs:"^1.11.10",downshift:"^9.0.4",flexboxgrid2:"^7.2.0","focus-trap":"^7.5.4",json2csv:"^4.2.1",lodash:"^4.17.4","memoize-one":"^6.0.0","moment-range":"^4.0.2","moment-timezone":"^0.5.14","normalize.css":"^8.0.1","popper.js":"^1.14.6","prop-types":"^15.5.10","prop-types-extra":"^1.1.0","query-string":"^8.1.0","react-highlight-words":"^0.20.0","react-overlays":"^5.2.1","react-quill":"^2.0.0","react-transition-group":"^4.4.5","react-virtualized-auto-sizer":"^1.0.2","tai-password-strength":"^1.1.1"},peerDependencies:{moment:"^2.29.0","react-intl":"^6.4.4","react-redux":"^8.0.5","react-router-dom":"^5.2.0"}};var ee=$({base:"light",brandTitle:`Stripes-Components v${V.version}`,brandUrl:"https://github.com/folio-org/stripes-components"});N.setConfig({theme:ee});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
