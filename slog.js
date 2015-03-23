"format cjs";

var _allSilent = false

var consoleOutput = function(type){

    return function(){

        if (this._silent || _allSilent) return
        var args = Array.prototype.slice.call(arguments);
        this.options.prepend && args.unshift(this.options.prepend + '');

        var method = 'log'

        if (console[type]){
            method = type
        }

        if (/Android.*(^Chrome).*Safari|iPad|MSIE/.test(navigator.userAgent)){
            //console.log(args.length)
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


Logger.prototype.error = function(){
    consoleOutput('error').apply(this, arguments)
}



var slog = {

    logger: function(options){
        var logger = new Logger(options)

        var fn = function(){
            logger.log.apply(logger, arguments)
        }

        ;['log', 'warn', 'error', 'info', 'on', 'off', 'disable', 'enable'].forEach(function(m){
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
    
    enable: function(){
        _allSilent = false
    },

    disable: function(){
        _allSilent = true
    }

}

if (typeof window !== 'undefined'){
    window.slog = slog.logger()
}

if (typeof System !== 'undefined' && System.env == 'production'){
    _allSilent = true
}

module.exports = slog.logger
