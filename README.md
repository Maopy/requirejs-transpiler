# requirejs-transpiler
transpile requirejs to ES Module

# Compiled Output

An example like this:

```js
  define(
    [
      'jquery'
    ],
    function ($) {
      return {
        init: function () {
          var o = $('#app');
        }
      };
    }
  );
```

and the output will be:

```js
  import $ from "jquery";
  export default {
    init: function () {
      var o = $('#app');
    }
  };
```

# Usage

Install:

```bash
  npm i requirejs-transpiler
```

## API

```js
  const { requirejs-transpiler } = require('requirejs-transpiler')

  requirejs-transpiler({  // options
    srcBasePath,
    srcPattern,
    distBasePath,
    prettier: true
  })
```

## Options

The glob syntax from the glob module is used at *srcPattern* param.

| Option | Required |
| ------------- | ------------- |
| srcBasePath | true |
| srcPattern | false |
| distBasePath | false |
| prettier | false |
| prettierOpts | false |

# Contributing
