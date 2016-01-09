
var cleanConsole = {
  log: console.log,
  warn: console.warn,
  info: console.info,
  error: console.error
}

var consoleFilters = {
  log: [],
  warn: [],
  info: [],
  error: []
}

var consoleMethods = Object.keys(consoleFilters)

var filterConsole = function(methods, filters){
  if (arguments.length == 1){
    filters = arguments[0]
    methods = consoleMethods
  }
  if (!Array.isArray(methods)){
    methods = [methods]
  }
  if (!Array.isArray(filters)){
    filters = [filters]
  }
  methods.forEach(function(method) {
    filters.forEach(function(filter) {
      var cf = consoleFilters[method]
      cf && consoleFilters[method].push(filter)
    })
  })
  return consoleFilters
}

consoleMethods.forEach(function(method){
  var m = cleanConsole[method]
  if (!m) return
  console[method] = function() {
    var filters = consoleFilters[method]
    //console.log('filters', filters)
    var i = 0
    while (arguments.length > i) {
      var arg = arguments[i]
      var matched = filters.reduce(function(matched, filter){
        return matched || new RegExp(filter).test(arg)
      }, false)
      if (matched){
        return
      }
      i++
    }
    m.apply(console, arguments)
  }
})

filterConsole(/aaa/)

if (typeof window !== 'undefined'){
  if (window.slog){
    window.slog.filter = filterConsole
    window.slog.cleanConsole = cleanConsole
  }
}

module.exports = filterConsole