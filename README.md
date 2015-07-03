###SLog
Simple client side logger CJS module.

`slog` is attached to `window` object to allow  global output and slog management.

```javascript
// use anywhere without requiring slog
slog('some message') // console output with "global" prefix: `global: some message`
```

By default ALL slog OUTPUT is disabled, in dev mode you have to enable it explicitly with `slog.enable`:

```javascript
windows.slog.enable()
```

or set `window.slog` to `true` or `string` value (witch will be used instead of default "global" prefix) before `slog` is required, so it will be enabled while init.

CJS usage:

```javascript
var slog = require('slog')('some-module') // create loger for particular module, output is enabled by default
var slog = require('slog')('some-module', false) // false means logger is disabled on init

slog('some message') // console output with prefix: `some-module: some message`

slog.disable() // disable output of created logger
slog.enable() // enable output of created logger

// sync timer
slog.start() // starts timer
slog.stop() // stops last timer 

// async timer
var timer = slog.start('time some async action')
//... some async action
timer.stop('async step1 completed') // outputs time (ms) from start
//... some async more action 
timer.stop('async full completed') // outputs time (ms) from step1 stop and from start  too

// console output with timeout
slog.timeout('some async value', function(){return $('.some').text()}, 5000) // outputs text() value in .some element in 5 sec

// inspect object
slog.inspect('obj', {a: 1, b: 'name', c: function(){...}}) 
//ouputs each property with separate console output: 
//slog: inspect: obj
//slog: inspect: obj a number 1
//slog: inspect: obj b string "name"
//slog: inspect: obj c function ....

```

Global management:

```javascript
window.slog.enable() // turns on all loggers (but not disabled), aliases: on, onAll, enableAll
window.slog.disable() // turns off  all loggers, aliases: off, offAll, disableAll

window.slog.mute(/*state*/) -// make all loggers mute
window.slog.loud(/*state*/) -// make all loggers loud 

window.slog.enable('moudle-name') // turns enable particular logger





```
