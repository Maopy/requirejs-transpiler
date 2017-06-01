# requirejs-transpiler
transpile requirejs to ES Module

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

| Option | Required | 
| ------------- | ------------- | 
| srcBasePath | true |
| srcPattern | false |
| distBasePath | false |
| prettier | false |
| prettierOpts | false |

# Contributing
