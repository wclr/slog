"format cjs";

var _allSilent = true
var _forceLoud = false

var consoleOutput = function(type){

    return function(){

        if ((this._silent || _allSilent) && !_forceLoud) return
        var args = Array.prototype.slice.call(arguments);
        this.options.prepend && args.unshift(this.options.prepend + ':');

        var method = 'log'

        if (console[type]){
            method = type
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

var Logger = function(options){

    if (typeof options == 'string'){
        this.options = {prepend: options}
    } else {
        this.options = options || {}
    }

    this._silent = false

}

Logger.prototype.on = function(){
    this._silent = false
}

Logger.prototype.enable = function(){
    this._silent = false
}

Logger.prototype.off = function(){

    this._silent = true
}

Logger.prototype.disable = function(){
    this._silent = true
}

Logger.prototype.log = function(){
    consoleOutput().apply(this, arguments)
}

Logger.prototype.warn = function(){
    consoleOutput('warn').apply(this, arguments)
}

Logger.prototype.info = function(){
    consoleOutput('info').apply(this, arguments)
}


var timers = {},
    lastTimer = ''

Logger.prototype.start = function(message){
    if ((this._silent || _allSilent) && !_forceLoud) return
    var time = new Date(),
        timerName = time.getTime() + message
    lastTimer = timerName
    timers[timerName] = {start: time, message: message}
    consoleOutput().apply(this, ['start timer:', message])
    return timerName
}

Logger.prototype.stop = function(timerName, sec){
    if ((this._silent || _allSilent) && !_forceLoud) return
    var timer = timers[timerName || lastTimer]
    if (timer){
        if (timer.stop){
            this.warn('timer for', timer.message, 'has already been stopped')
        }
        timer.stop = new Date()
        var diff = (timer.stop - timer.start) / (sec ? 1000 : 1),
            unit = sec ? 'sec' : 'ms'
        consoleOutput().apply(this, ['stop timer:', timer.message, '-', diff, unit])
        // remove timer in 60 seconds
        setTimeout(function(){
            delete timers[timerName || lastTimer]
        }, 60*1000)
    }
}


Logger.prototype.error = function(){
    consoleOutput('error').apply(this, arguments)
}

var slog = {

    logger: function(options){
        var logger = new Logger(options)

        var fn = function(){
                logger.log.apply(logger, arguments)
            }

            ;['log', 'warn', 'error', 'info', 'on', 'off', 'start', 'stop', 'disable', 'enable'].forEach(function(m){
            fn[m] = function(){
                logger[m].apply(logger, arguments)
            }
        })
        return fn

    },

    on: function(){
        _allSilent = false
    },

    off: function(){
        _allSilent = true
    },

    onAll: function(){
        _forceLoud = true
        _allSilent = false
    },

    offAll: function(){
        _forceLoud = false
        _allSilent = false
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

    if (window.slog){
        globalLogger.enable()
    }
    window.slog = globalLogger
}

module.exports = slog.logger
