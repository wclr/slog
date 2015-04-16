###SLog
Simple client side logger CJS module.

`slog` is attached to `window` object to allow  global output and slog management.

```javascript
// use anywhere without requiring slog
slog('some message') // console output with "global" prefix: `global: some message`
```

By default sog ALL OUTPUT is disabled, in dev mode you have to enable it explicitly:

```javascript
windows.slog.enable()
```

or set `window.slog` to `true` or `string` value (witch will be used instead of default "global" prefix) before `slog` is required, so it will be enabled while init.

CJS usage:

```javascript
var slog = require('slog')('some-module') // create loger for particular module, output is enabled by default

slog('some message') // console output with prefix: `some-module: some message`

slog.disable() // disable output of created logger
slog.enable() // enable output of created logger

```

Global management:

```javascript
window.slog.enable() // turns on output off all loggers (but not disabled)
window.slog.disable() // turns off output off all loggers
window.slog.enableAll() // turns on output off all loggers (even disabled)
window.slog.disableAll() // cancels enableAll
```
