setTimeout(function() {

  var bs = ___browserSync___
  function logToServer(arg, metadata) {
    metadata.userAgent = navigator.userAgent
    metadata.message = arg
    bs.socket.emit('log', metadata)
  }

  function newConsole() {
    var oldLog = console.log
    var oldError = console.error
    var oldAssert = console.assert

    console.log = function(arg) {
      if (!arg) { return }
      logToServer(arg, { level: 'log' })
      oldLog.apply(console, arguments)
    }

    console.error = function(arg) {
      if (!arg) { return }
      logToServer(arg, { level: 'error' })
      oldError.apply(console, arguments)
    }

    console.assert = function(arg) {
      if (!arg) { return }
      logToServer(arg, { level: 'assert' } )
      oldAssert.apply(console, arguments)
    }
  }

  var callback = function(msg, stack) {
    var output = msg + '\n    ' + stack
    console.error(output)
  }

  window.onerror = function(msg, file, line, col, error) {
    // callback is called with an Array[StackFrame]
    callback(msg, error.stack)
  }

  newConsole()

}, 1000)
