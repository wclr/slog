###SLog
Simple client side logger CJS module.

By default output is disabled, in dev mode you have to enable it explicitly:

```javascript
require('slog').enable()
```

Usage:

```javascript
var slog = require('slog')('some-module') // create loger for particular module

slog('some message') // console output: some-module: some message

slog.disable() // disable output of created logger
slog.enable() // enable output of created logger

```

`slog` is attached to `window` object to allow  global output

```javascript
// use anywhere without requiring
slog('some message') // console output: some message
```

```javascript
slog.enableAll() // turns on output off all loggers (even disabled)

```
