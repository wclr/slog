###SLog
Simple client side Logger CJS module

By default output is disabled

```javascirpt
in dev mode you have to enable it explicitly:
```javascript
require('slog).enable()
```

```javascirpt
var slog = require('slog)('some-module') // create loger for particular module

slog('some message') // console output: some-module: some message

slog.disable() // disable output of created logger
slog.enable() // enable output of created logger

```

// slog is attached to window object to allow  global output
```javascirpt
slog('some message') // console output: some message
```
