"format cjs";

var _allSilent = true
var _forceLoud = false

var consoleOutput = function(type){

    type = type || 'log'

    return function(){

        if ((((type == 'log') && this._silent) || _allSilent) && !_forceLoud) return
        var args = Array.prototype.slice.call(arguments);
        this.options.prepend && args.unshift(this.options.prepend + ':');

        if (console[type]){
            method = type
        } else {
            return
        }

        if (/Android.*(^Chrome).*Safari|iPad|MSIE/.test(navigator.userAgent)){
            args = args.map(function(a){
                return (typeof a === 'object') ? JSON.stringify(a) : a && a.toString()
            })
            args = args.join(' ')
            console[method](args)
        } else {
            console[method].apply(console, args)
        }
    }
}
var instances = {}

var Logger = function(options, enabled){

    if (typeof options == 'string'){
        this.options = {prepend: options}
    } else {
        this.options = options || {}
        slient = this.options.disabled
    }

    this._silent = false

    if (typeof enabled == 'boolean'){

        this._silent = !enabled
    }

    this._timestamp = parseInt((new Date().getTime())*Math.random())

    if (this.options.prepend){
        instances[this.options.prepend || this._timestamp] = this
    }
}

Logger.prototype.on = function(){
    this.warn('logger enabled')
    this._silent = false
}


Logger.prototype.off = function(){
    this.warn('logger disabled')
    this._silent = true
}

Logger.prototype.enable = Logger.prototype.on
Logger.prototype.disable = Logger.prototype.off

Logger.prototype.log = function(){
    consoleOutput().apply(this, arguments)
}

Logger.prototype.warn = function(){
    consoleOutput('warn').apply(this, arguments)
}

Logger.prototype.info = function(){
    consoleOutput('info').apply(this, arguments)
}

Logger.prototype.inspect = function(){

    var args = Array.prototype.slice.call(arguments),
        obj = args.pop()
    args.unshift('inspect')

    for (var prop in obj){
        this.log.apply(this, args.concat([prop, typeof obj[prop], obj[prop]]))
    }
}

var timers = {},
    lastTimer = ''

Logger.prototype.start = function(message){
    if ((this._silent || _allSilent) && !_forceLoud) {
        return {stop: function(){}}
    }

    var args = Array.prototype.slice.call(arguments);

    message = args.join(' ')

    var time = new Date(),
        timerName = time.getTime() + message + Math.random().toString()

    var self = this

    var timer = {
        name: timerName,
        start: time,
        message: message,
    }

    timer.stop = function(){
        var args = Array.prototype.slice.call(arguments);
        var stopMessage = args.length ? ' - ' + args.join(' ') : ''
        var now = new Date()

        var diff = (now - (timer.lastStop || timer.start)),
            unit = 'ms'

        args = ['stop timer:', timer.message + stopMessage, '-', diff, unit]

        if (timer.lastStop){
            args.push('(' + (now - timer.start), unit + ')')
        }

        timer.lastStop = now

        consoleOutput().apply(self, args)
    }

    lastTimer = timer
    timers[timerName] = timer
    consoleOutput().apply(this, ['start timer:', message])

    // stop timeout warning in 120 sec

    setTimeout(function(){
        if (!timers[timerName].lastStop){
            self.warn('Timer has not been stopped in 120 sec', timerName, message)
        }
    }, 120*1000)
    return timer
}

Logger.prototype.stop = function(timer){
    if ((this._silent || _allSilent) && !_forceLoud) return

    if (!timer){
        timer = lastTimer
    }

    var args = Array.prototype.slice.call(arguments);
    args.shift()
    timer.stop.apply(timer, args)

}

Logger.prototype.timeout = function(){
    if ((this._silent || _allSilent) && !_forceLoud) return

    var args = Array.prototype.slice.call(arguments);
    var timeout = args.pop()
    var self = this

    setTimeout(function(){
        args = args.map(function(arg){
            if (typeof arg == 'function'){
                return arg()
            } else {
                return arg
            }
        })
        self.log.apply(self, args)
    }, timeout)
}


Logger.prototype.error = function(){
    consoleOutput('error').apply(this, arguments)
}

var slog = {

    logger: function(options, enabled){
        var logger = new Logger(options, enabled)

        var fn = function(){
                logger.log.apply(logger, arguments)
            }

            ;['log', 'warn', 'error', 'info', 'on', 'off', 'start', 'stop', 'disable', 'enable', 'inspect', 'timeout']
            .forEach(function(m){
                fn[m] = function(){
                    return logger[m].apply(logger, arguments)
                }
            })
        return fn

    },

    on: function(name, persist){

        if (typeof name == 'string'){
            var instance = instances[name]
            if (instance){
                instance.on(persist)
            } else {
                this.warn('No logger', name, 'found')
            }
        } else {
            _allSilent = false
        }
    },

    off: function(name, persist){
        if (typeof name == 'string'){
            var instance = instances[name]
            if (instance){
                instance.off(persist)
            } else {
                this.warn('No logger', name, 'found')
            }
        } else {
            _allSilent = false
        }
    },

    onAll: function(){
        Object.keys(instances).forEach(function(name){
            instances[name].on()
        })
    },

    offAll: function(){
        Object.keys(instances).forEach(function(name){
            instances[name].off()
        })
    },

    mute: function(state){
        if (state === undefined){
            state = true
        }
        if (state){
            this.warn('all loggers are mute now')
        } else {
            this.warn('all loggers are not mute now')
        }
        _forceLoud = !state
        _allSilent = state
    },

    loud: function(state){
        if (state === undefined){
            state = true
        }
        if (state){
            this.warn('all loggers are loud now')
        } else {
            this.warn('all loggers are not loud now')
        }
        _forceLoud = state
    }
}

slog.enableAll = slog.onAll
slog.disableAll = slog.offAll

slog.enable = slog.on
slog.disable = slog.off

if (typeof window !== 'undefined'){

    var globalLogger = slog.logger(typeof window.slog == 'string' ? window.slog : 'slog')

    for (var m in slog){
        globalLogger[m] = slog[m]
    }

    if (window.slog || (window.localStorage && window.localStorage.getItem('slog'))){
        globalLogger.enable()
    }
    window.slog = globalLogger
}

module.exports = slog.logger