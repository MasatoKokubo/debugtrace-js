/**
 * @file debugtrace.js
 * @copyright 2015 Masato Kokubo
 * @license MIT
 */
"use strict"

const LogBuffer = require('./logbuffer')

/** @private */
let nestLevel     = 0 // Nest Level
let previousNestLevel = 0 // Previous Nest Level

// Array of indent strings
const indentStrings = []

// Array of data indent strings
const dataIndentStrings = []

// Array of times at enter
const enterTimes = []

// version
const version = '2.1.1'

// Reflected object array
let reflectedObjects = []

let reflectionNest = 0

let initialized = false

/**
 * Returns a string corresponding to the current indent.
 * @private
 * @param {number} dataNestLevel the data nest level
 * @return {string} a indent string
 */
const getIndentString = (dataNestLevel = 0) => {
  // make indentStrings if necessary
  if (indentStrings.length < 2 || indentStrings[1] != debugtrace.indentString) {
    indentStrings.splice(0, indentStrings.length) // initializes the array
    indentStrings.push('')
    for (let index = 1; index < 32; ++index)
      indentStrings.push(indentStrings[indentStrings.length - 1] + debugtrace.indentString)
  }

  // make dataIndentStrings if necessary
  if (dataIndentStrings.length < 2 || dataIndentStrings[1] != debugtrace.dataIndentString) {
    dataIndentStrings.splice(0, dataIndentStrings.length) // initializes the array
    dataIndentStrings.push('')
    for (let index = 1; index < 32; ++index)
      dataIndentStrings.push(dataIndentStrings[dataIndentStrings.length - 1] + debugtrace.dataIndentString)
  }

    return indentStrings[
      nestLevel < 0 ? 0 :
      nestLevel >= indentStrings.length ? indentStrings.length - 1
        : nestLevel]
    + dataIndentStrings[
      dataNestLevel < 0 ? 0 :
      dataNestLevel >= dataIndentStrings.length ? dataIndentStrings.length - 1
        : dataNestLevel]
}

/**
 * Increases the nest level.
 * @private
 */
const upNest = () => {
  previousNestLevel = nestLevel
  ++nestLevel
}

/**
 * Decreases the nesting level.
 * @private
 */
const downNest = () => {
  previousNestLevel = nestLevel
  --nestLevel
}

/**
 * Returns a caller stack trace element.
 * @private
 * @return a caller stack trace element
 */
const getCallerInfo = () => {
  const myModuleName = 'debugtrace\.js$'

  const callerInfos = new Error('').stack.split('\n')
    .filter(line => line.indexOf('at ') >= 0)
    .map(line => {
      const parts = line.substring(line.indexOf('at ') + 3).split(' ')
      if (parts.length == 1)
        parts.unshift('')
      if (parts[1].indexOf('(') == 0)
        parts[1] = parts[1].slice(1, -1)

      const parts2 = parts[1].split(':')
      const functionName = parts[0]
      let fileName = parts2.length <= 3 ? parts2[0] : parts2[0] + ':' + parts2[1]
      let delimIndex = fileName.lastIndexOf('/')
      if (delimIndex >= 0)
        fileName = fileName.substring(delimIndex + 1)
      else {
        let delimIndex = fileName.lastIndexOf('\\')
        if (delimIndex >= 0)
          fileName = fileName.substring(delimIndex + 1)
      }
      const lineNumber = parts2[parts2.length - 2]
      const columnNumber = parts2[parts2.length - 1]
      return {
        functionName : functionName,
        fileName: fileName,
        lineNumber: lineNumber,
        columnNumber: columnNumber
      }
    })
    .filter(element => !element.fileName.match(myModuleName))

  return callerInfos[0]
}

/**
 * Returns the type name of the value.
 * @private
 * @param {string} message the message to output
 * @param {boolean} withCallerInfo - true if outputs the caller infomation, false otherwise
 */
const getTypeName = value => {
// 2.1.1
//let typeName = value.constructor.name
  let typeName = ''
  try {typeName = value.constructor.name} catch {}
////
  const length = value.length || -1
  const size = value.size || -1
  
  if (typeName == 'String') {
    typeName = ''
    if (length >= debugtrace.minimumOutputStringLength)
      typeName = debugtrace.formatLength(length)
  } else {
    if (typeName == 'Array')
      typeName = ''
    if (length >= debugtrace.minimumOutputLengthAndSize) {
      if (typeName.length > 0)
        typeName += ' '
      typeName += debugtrace.formatLength(length)
    } else if (size >= debugtrace.minimumOutputLengthAndSize) {
      if (typeName.length > 0)
        typeName += ' '
      typeName += debugtrace.formatSize(size)
    }
  }

  if (typeName.length > 0)
    typeName = '(' + typeName + ')'
  return typeName
}

/**
 * Outputs the log.
 * @private
 * @param {string} message the message to output
 */
const printSub = message => {
  if (!initialized) {
    initialized = true
    printSub('debugtrace-js ' + version + ' (Node.js ' + process.versions.node + ')')
    printSub('')
  }

  reflectedObjects = []
  const logString = debugtrace.formatLogDate(new Date()) + ' ' + message
  debugtrace.basicPrint(logString)
}

/**
 * Returns a string representation of the message and the value.
 * @private
 * @param {*} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toString = value => {
  let buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  if (value === undefined)
    buff.append('undefined')
  else if (value === null)
    buff.append('null')
  else {
    const type = Object.prototype.toString.call(value).slice(8, -1)
    switch (type) {
    case 'Boolean' :
    case 'Symbol'  :
    case 'Number'  :
    case 'BigInt'  :
    case 'Error'   :
    case 'RegExp'  : buff.append(value); break
    case 'Date'    : buff.append(debugtrace.formatDate(value)); break
    case 'String'  : buff = toStringString(value); break
    case 'Function': buff = toStringFunction(value); break
    default:
      if (reflectedObjects.findIndex(element => element === value) >= 0)
        buff.noBreakAppend(debugtrace.cyclicReferenceString)
      else {
        reflectedObjects.push(value)
        if (type.endsWith('Array'))
          buff = toStringArray(value)
        else {
          switch (type) {
          case 'Map': buff = toStringMap(value); break
          case 'Set': buff = toStringArray(value); break
          default:
            if (reflectionNest >= debugtrace.reflectionNestLimit) {
              buff.noBreakAppend(debugtrace.limitString)
            } else {
              ++reflectionNest
              buff = toStringObject(value)
              --reflectionNest
            }
            break
          }
        }
        reflectedObjects.pop()
      }
      break
    }
  }

  return buff
}

/**
 * Returns a string representation of the array as a LogBuffer.
 * @private
 * @param {Array} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringArray = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.noBreakAppend(getTypeName(value))
  buff.noBreakAppend('[')

  const bodyBuff = toStringArrayBody(value)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth;

  if (isMultiLines) {
    buff.lineFeed();
    buff.upNest();
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    buff.lineFeed();
    buff.downNest();
  }

  buff.noBreakAppend(']');

  return buff;
}

const toStringArrayBody = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0
  let wasMultiLines = false;
  for (let element of value) {
    if (index > 0)
      buff.noBreakAppend(', ')

    if (index >= debugtrace.collectionLimit) {
      buff.append(debugtrace.limitString)
      break
    }

    const elementBuff = toString(element)
    if (index > 0 && (wasMultiLines|| elementBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, elementBuff)

    ++index
    wasMultiLines = elementBuff.isMultiLines
  }

  return buff
}

/**
 * Returns a string representation of the string as a LogBuffer.
 * @private
 * @param {string} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringString = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)
  buff.noBreakAppend(getTypeName(value))
  buff.noBreakAppend('\'')
  let index = 0
  for (let ch of value) {
    if (index >= debugtrace.stringLimit) {
      buff.noBreakAppend(debugtrace.limitString)
      break
    }
    switch (ch) {
    case '\0': buff.noBreakAppend('\\0' ); break; // 00 NUL
    case '\b': buff.noBreakAppend('\\b' ); break; // 08 BS
    case '\t': buff.noBreakAppend('\\t' ); break; // 09 HT
    case '\n': buff.noBreakAppend('\\n' ); break; // 0A LF
    case '\v': buff.noBreakAppend('\\v' ); break; // 0B VT
    case '\f': buff.noBreakAppend('\\f' ); break; // 0C FF
    case '\r': buff.noBreakAppend('\\r' ); break; // 0D CR
    case '\'': buff.noBreakAppend('\\\'' ); break; // '
    case '\\': buff.noBreakAppend('\\\\'); break; // \
    default:
      if (ch < ' ' || ch == '\u007F')
        buff.noBreakAppend('\\x')
          .noBreakAppend(('0' + ch.charCodeAt(0).toString(16)).slice(-2).toUpperCase());
      else
        buff.noBreakAppend(ch);
      break;
    }
    ++index
  }
  buff.noBreakAppend('\'')
  return buff
}

/**
 * Returns a string representation of the function as a LogBuffer.
 * @private
 * @param {Function} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringFunction = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

// 2.1.1
//const lines = ('' + value).split('\t').join('  ').split('\n')
  const lines = ('' + value).split('\n')
////
  buff.noBreakAppend(lines[0])
  if (lines.length >= 2)
    buff.noBreakAppend(debugtrace.limitString)

  return buff
}

/**
 * Returns a string representation of the object as a LogBuffer.
 * @private
 * @param {object} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringObject = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.append(getTypeName(value))

  const bodyBuff = toStringObjectBody(value)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth
  buff.noBreakAppend('{')

  if (isMultiLines) {
    buff.lineFeed()
    buff.upNest()
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    if (buff.length > 0)
      buff.lineFeed()
    buff.downNest()
  }

  buff.noBreakAppend('}')

  return buff
}

const toStringObjectBody = value => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0 
  let wasMultiLines = false;
  for (const propertyName in value) {
    if (index > 0)
      buff.noBreakAppend(', ')

    const memberBuff = new LogBuffer(debugtrace.maximumDataOutputWidth)
    memberBuff.append(propertyName)
    memberBuff.appendBuffer(debugtrace.keyValueSeparator, toString(value[propertyName]))

    if (index > 0 && (wasMultiLines || memberBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, memberBuff)

    wasMultiLines = memberBuff.isMultiLines
    ++index
  }

  return buff
}

/**
 * Returns a string representation of the array as a LogBuffer.
 * @private
 * @param {Map} map the map to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringMap = map => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.noBreakAppend(getTypeName(map))
  buff.noBreakAppend('{')

  const bodyBuff = toStringMapBody(map)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth;

  if (isMultiLines) {
    buff.lineFeed();
    buff.upNest();
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    buff.lineFeed();
    buff.downNest();
  }

  buff.noBreakAppend('}');

  return buff;
}

const toStringMapBody = map => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0
  let wasMultiLines = false;
  for (let key of map.keys()) {
    if (index > 0)
      buff.noBreakAppend(', ')

    if (index >= debugtrace.collectionLimit) {
      buff.append(debugtrace.limitString)
      break
    }

    const elementBuff = toString(key)
    elementBuff.appendBuffer(debugtrace.keyValueSeparator, toString(map.get(key)))
    if (index > 0 && (wasMultiLines|| elementBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, elementBuff)

    ++index
    wasMultiLines = elementBuff.isMultiLines
  }

  return buff
}

let debugtrace = {}

/**
 * @namespace debugtrace
 */
module.exports = (function() {
  /**
   * Formatting function of log output when entering methods.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @return {string} a formatted string
   */
  debugtrace.formatEnter = (name, fileName, lineNumber) =>
    `Enter ${name} (${fileName}:${lineNumber})`

  /**
   * Formatting function of log output when leaving methods.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @param {string} duration the duration since invoking the corresponding `enter` method
   * @return {string} a formatted string
   */
  debugtrace.formatLeave = (name, fileName, lineNumber, duration) =>
    `Leave ${name} (${fileName}:${lineNumber}) duration: ${duration}`

  /**
   * Indentation string for code.
   * @type {string}
   */
  debugtrace.indentString = '| '

  /**
   * Indentation string for data.
   * @type {string}
   */
  debugtrace.dataIndentString = '  '

  /**
   * String to represent that it has exceeded the limit.
   * @type {string}
   */
  debugtrace.limitString = '...'

  /**
   * String to be output instead of not outputting value.
   * @type {string}
   */
  debugtrace.nonOutputString = '***' // Dose not use

  /**
   * String to represent that the cyclic reference occurs.
   * @type {string}
   */
  debugtrace.cyclicReferenceString = '*** cyclic reference ***'

  /**
   * Separator string between the variable name and value.
   * @type {string}
   */
  debugtrace.varNameValueSeparator = ' = '

  /**
   * Separator string between the key and value of Map object.
   * @type {string}
   */
  debugtrace.keyValueSeparator = ': '

  /**
   * Formatting function of print method suffix.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @return {string} a formatted string
   */
  debugtrace.formatPrintSuffix = (name, fileName, lineNumber) => ` (${fileName}:${lineNumber})`

  /**
   * Formatting function of the length of array and string.
   * @type {function}
   * @param {number} length the length
   */
  debugtrace.formatLength = length => `length:${length}`

  /**
   * Formatting function of the size of Map and Set.
   * @type {function}
   * @param {string} size the size
   */
  debugtrace.formatSize = size => `size:${size}`

  /**
   * Minimum value to output the number of elements of Array, Map, and Set.
   * @type {number}
   */
  debugtrace.minimumOutputLengthAndSize = 5

  /**
   * Minimum value to output the number of elements of string.
   * @type {number}
   */
  debugtrace.minimumOutputStringLength = 5

  /**
   * Formatting function of Date.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatDate = date => {
    let timezoneOffset = date.getTimezoneOffset()
    const offsetSign = timezoneOffset < 0 ? '+' : '-'
    if (timezoneOffset < 0)
      timezoneOffset = -timezoneOffset
    const str =  date.getFullYear() + '-' +
      ('0'  + (date.getMonth  () + 1 )).slice(-2) + '-' +
      ('0'  +  date.getDate   ()      ).slice(-2) + ' ' +
      ('0'  +  date.getHours  ()      ).slice(-2) + ':' +
      ('0'  +  date.getMinutes()      ).slice(-2) + ':' +
      ('0'  +  date.getSeconds()      ).slice(-2) + '.' +
      ('00' +  date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'  +  Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'  +  timezoneOffset % 60).slice(-2)
    return str
  }

  /**
   *The format function for duration of formatLeave.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatTime = date =>
    ('0'  +  date.getUTCHours  ()     ).slice(-2) + ':' +
    ('0'  +  date.getUTCMinutes()     ).slice(-2) + ':' +
    ('0'  +  date.getUTCSeconds()     ).slice(-2) + '.' +
    ('00' +  date.getUTCMilliseconds()).slice(-3)

  /**
   * The format function for the log date and time.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatLogDate = date => {
    let timezoneOffset = date.getTimezoneOffset()
    const offsetSign = timezoneOffset < 0 ? '+' : '-'
    if (timezoneOffset < 0)
      timezoneOffset = -timezoneOffset
    const str =  date.getFullYear() + '-' +
      ('0'  + (date.getMonth  () + 1 )).slice(-2) + '-' +
      ('0'  +  date.getDate   ()      ).slice(-2) + ' ' +
      ('0'  +  date.getHours  ()      ).slice(-2) + ':' +
      ('0'  +  date.getMinutes()      ).slice(-2) + ':' +
      ('0'  +  date.getSeconds()      ).slice(-2) + '.' +
      ('00' +  date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'  +  Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'  +  timezoneOffset % 60).slice(-2)
    return str
  }

  /**
   * The minimum value to output the length of string.
   * @type {number}
   */
  debugtrace.maximumDataOutputWidth = 70

  /**
   * Limit value of elements for array, Map and Set to output.
   * @type {number}
   */
  debugtrace.collectionLimit = 512

  /**
   * Limit value of characters for string to output.
   * @type {number}
   */
  debugtrace.stringLimit = 8192

  /**
   * The limit value for reflection nesting.
   * @type {number}
   */
  debugtrace.reflectionNestLimit = 4

  /**
   * Definition of basic print function.
   * @type {function}
   * @since 2.1.0
   */
  debugtrace.basicPrint = console.log

  /**
   * Outputs a log when entering function.
   */
  debugtrace.enter = () => {
    if (previousNestLevel > nestLevel)
      printSub(getIndentString()) // Empty Line
    const callerInfo = getCallerInfo()
    debugtrace.lastLog = getIndentString() +
      debugtrace.formatEnter(
        callerInfo.functionName,
        callerInfo.fileName,
        callerInfo.lineNumber
      )
    printSub(debugtrace.lastLog)
    upNest()
    enterTimes.push(Date.now())
  }

  /**
   * Outputs a log when leavign function.
   */
  debugtrace.leave = () => {
    const now = Date.now()
    const duration = now - (enterTimes.length > 0 ? enterTimes.pop() : now)
    downNest()
    const callerInfo = getCallerInfo()
    debugtrace.lastLog = getIndentString() +
      debugtrace.formatLeave(
        callerInfo.functionName,
        callerInfo.fileName,
        callerInfo.lineNumber,
        debugtrace.formatTime(new Date(duration))
      )
    printSub(debugtrace.lastLog)
  }

  debugtrace.lastLog = ''

  /**
   * Outputs the message to the log.
   * @param {string} message the message
   */
  debugtrace.printMessage = (message) => {
    const callerInfo = getCallerInfo()
    const printSuffix = debugtrace.formatPrintSuffix(
      callerInfo.functionName,
      callerInfo.fileName,
      callerInfo.lineNumber
    )

    debugtrace.lastLog = getIndentString() + message + printSuffix
    printSub(debugtrace.lastLog)
  }

  /**
   * Outputs the name and the value to the log.
   * @param {string} name the name of the value
   * @param {*} value the value to output
   */
  debugtrace.print = (name, value) => {
    const callerInfo = getCallerInfo()
    const printSuffix = debugtrace.formatPrintSuffix(
      callerInfo.functionName,
      callerInfo.fileName,
      callerInfo.lineNumber
    )

    const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)
    buff.append(name)
      .appendBuffer(debugtrace.varNameValueSeparator, toString(value))
      .noBreakAppend(printSuffix)
    let index = 0
    const lines = buff.lines
    debugtrace.lastLog = ''
    for (const line of lines) {
      const outputLine = getIndentString(line[0]) + line[1]
      if (debugtrace.lastLog != '')
        debugtrace.lastLog += '\n'
      debugtrace.lastLog += outputLine
      printSub(outputLine)
      ++index
    }
  }

  return debugtrace
}())
