# Virtual-Dom
[![Build Status](https://travis-ci.org/yyh1102/virtual-dom.svg?branch=master)](https://travis-ci.org/yyh1102/virtual-dom)
[![Coverage Status](https://coveralls.io/repos/github/yyh1102/Virtual-Dom/badge.svg?branch=master)](https://coveralls.io/github/yyh1102/Virtual-Dom?branch=master)
[![npm](https://img.shields.io/npm/l/express.svg)](https://opensource.org/licenses/mit-license.php)

A reconstruction version of [simple-virtual-dom](https://github.com/livoras/simple-virtual-dom)

## Feature
- Use ES6&ES7 to reconstruct the code.
    - remove redundancy codes.
    - more readable.
- Add test of 'Root reordering and child replacing'.
- Add test of 'Root reordering,and children adding and removing'.
- The size of dist file has been compressed by 38%.

## Install
npm:
```bash
$ npm install virtual-doml --save-dev
```
or script:
```html
<script src='/dist/virtualDom.js'></script>
```
or you can use reference project [simple-virtual-dom](https://github.com/livoras/simple-virtual-dom).

## Usage
```javascript
var vdom=require('virtual-doml');
var el=vdom.el;
var diff=vdom.diff;

var tree=el('div',{'id':'container'},[
    el('p',{name:'lowesyang'},['Hello vdom']),
    el('ul',[el('li',['item1']),el('li',['item2'])])
])

var newTree=el('div',{'id':'container'},[
    el('h1',{style:'color:red'},['Hello LowesYang']),
    el('p',{name:'lowesyang'},['Hello vdom']),
    el('ul',[el('li',['item2'])])
])

var patches=diff(tree,newTree);
var root=tree.render();
document.querySelector('#demo').appendChild(root);
setTimeout(()=>{
    patches.apply(root);
},2000)
```

## License
MIT

