/**
 * @file
 * @version 1.1.0
 * @copyright 2015 Masato Kokubo
 * @license MIT
 */

/** @private */
var nestLevel       = 0 // Nest Level
var beforeNestLevel = 0 // Before Nest Level
var dataNestLevel   = 0 // Data Nest Level

// Array of indent strings
var indentStrings = []

// Array of data indent strings
var dataIndentStrings = []

/**
 * Returns a string corresponding to the current indent.
 * @private
 * @return {string} a string of indent
 */
function getIndentString() {
	// make indentStrings if necessary
	if (indentStrings.length == 0 || indentStrings[1] != debugtrace.indentString) {
		indentStrings.splice(0, indentStrings.length)
		indentStrings.push("")
		for (var index = 1; index < 32; ++index)
			indentStrings.push(indentStrings[indentStrings.length - 1] + debugtrace.indentString)
	}

	// make dataIndentStrings if necessary
	if (dataIndentStrings.length == 1 || dataIndentStrings[1] != debugtrace.dataIndentString) {
		dataIndentStrings.splice(0, dataIndentStrings.length)
		dataIndentStrings.push("")
		for (var index = 1; index < 32; ++index)
			dataIndentStrings.push(dataIndentStrings[dataIndentStrings.length - 1] + debugtrace.dataIndentString)
	}

	return indentStrings[
			nestLevel < 0
				? 0
			: nestLevel >= indentStrings.length
				? indentStrings.length - 1
				: nestLevel
		] + dataIndentStrings[
			dataNestLevel < 0
				? 0
			: dataNestLevel >= dataIndentStrings.length
				? dataIndentStrings.length - 1
				: dataNestLevel
		]
}

/**
 * Increases the nest level.
 * @private
 */
function incNest() {
	beforeNestLevel = nestLevel
	++nestLevel
}

/**
 * Decreases the nesting level.
 * @private
 */
function decNest() {
	 beforeNestLevel = nestLevel
	--nestLevel
}

/**
 * Increases the data nest level.
 * @private
 */
function incDataNest() {
	++dataNestLevel
}

/**
 * Decreases the data nest level.
 * @private
 */
function decDataNest() {
	--dataNestLevel
}

/**
 * Returns a caller stack trace element.
 * @private
 * @return a caller stack trace element
 */
function getCallerInfo() {
	var myModuleName = "debugtrace\.js$"

	var callerInfos = new Error("").stack.split("\n")
		.filter(function(line) {return line.indexOf("at ") >= 0})
		.map   (function(line) {
			var parts = line.substring(line.indexOf("at ") + 3).split(" ")
			if (parts.length == 1)
				parts.unshift("")
			if (parts[1].indexOf("(") == 0)
				parts[1] = parts[1].slice(1, -1)

			var parts2 = parts[1].split(":")
			var funcName = parts[0]
			var pathName = parts2.length <= 3 ? parts2[0] : parts2[0] + ":" + parts2[1]
			var lineNo   = parts2[parts2.length - 2]
			var columnNo = parts2[parts2.length - 1]
			return {
				funcName : funcName,
				pathName : pathName,
				lineNo   : lineNo,
				columnNo : columnNo
			}
		})
		.filter(function(element) {return !element.pathName.match(myModuleName)})

	return callerInfos[0]
}

/**
 * Outputs the log.
 * @private
 * @param {string} message - the message to output
 * @param {Boolean} withCallerInfo - true if outputs the caller infomation, false otherwise
 */
function basicPrint(message, withCallerInfo) {
	var logString = debugtrace.formatDate(new Date()) + " "
		+ (withCallerInfo ? debugtrace.formatMessage(message, getCallerInfo()) : message)

	console.log(logString)
	return getIndentString()
}

/**
 * Returns a string representation of the message and the value.
 * @private
 * @param {string} message - the message about the value
 * @param {*} value - the value to output
 * @return {string} a string representation of the message and the value.
 */
function append(message, value) {
	if (value == null) {
		logString = message + value
	} else {
		var type = Object.prototype.toString.call(value).slice(8, -1)
		if      (type == "Array"   ) logString = appendArray(message, value)
		else if (type == "Boolean" ) logString = message + value
		else if (type == "Number"  ) logString = message + value
		else if (type == "String"  ) logString = message + "\"" + value + "\""
		else if (type == "Date"    ) logString = message + debugtrace.formatDate(value)
		else if (type == "Error"   ) logString = message + value
		else if (type == "Function") logString = appendFunction(message, value)
		else if (type == "RegExp"  ) logString = message + value
		else                         logString = appendObject(message, value)
	}

	return logString
}

/**
 * Returns a string representation of the message and the array value.
 * @private
 * @param {string} message - the message about the value
 * @param {Array} value - the value to output
 * @return {string} a string representation of the message and value.
 */
function appendArray(message, value) {
	var logString = message + "["
	var upped = false

	for (var index = 0; index < value.length; ++index) {
		logString = append(logString, value[index])
		if (index < value.length - 1)
			logString = logString + ", "

		if (logString.length > debugtrace.columnLimit) {
			if (!upped) {
				incDataNest()
				upped = true
			}
			logString = basicPrint(logString, false)
		}
	}

	if (upped) {
		decDataNest()
		logString = basicPrint(logString, false)
	}

	var logString = logString + "]"
	return logString
}

/**
 * Returns a string representation of the message and the object value.
 * @private
 * @param {string} message - the message about the value
 * @param {{object} value - the value to output
 * @return {string} a string representation of the message and value.
 */
function appendObject(message, value) {
	var count = 0
	for (var property in value)
		++count

	var logString = message + "{"
	incDataNest()
	logString = basicPrint(logString, false)

	var index = 0 
	for (var property in value) {
		logString = logString + property + ":"
		logString = append(logString, value[property])
		if (index < count - 1)
			logString = logString + ", "

		if (index == count - 1)
			decDataNest()
		logString = basicPrint(logString, false)
		++index
	}

	logString = logString + "}"

	return logString
}

/**
 * Returns a string representation of the message and the function value.
 * @private
 * @param {string} message - the message about the value
 * @param {Function} value - the value to output
 * @return {string} a string representation of the message and value.
 */
function appendFunction(message, value) {
	var lines = ("" + value).split("\t").join("    ").split("\n")
	var logString = message

	for (var index = 0; index < lines.length; ++index) {
		if (index >= 1)
			logString = basicPrint(logString, false)
		logString = logString + lines[index]
	}

	return logString
}

var debugtrace = {}

/**
 * @namespace debugtrace
 */
module.exports = (function() {
	/**
	 * String of method indent.
	 * @type {string}
	 */
	debugtrace.indentString = "| "

	/**
	 * String of data indent.
	 * @type {string}
	 */
	debugtrace.dataIndentString = "  "

	/**
	 * Separator between the variable name and value.
	 * @type {string}
	 */
	debugtrace.varNameValueSeparator = " = "

	/**
	 * Formats the log when entering.
	 * @param {object} info - the caller information
	 * @property {string} info.pathName - the path name of the caller function
	 * @property {string} info.funcName - the function name of the caller function
	 * @property {number} info.lineNo   - the line number of the caller function
	 * @property {number} info.columnNo - the column number of the caller function
	 * @return {string} the entering string
	 */
	debugtrace.formatEnter = function(info) {
		return "Enter " + info.pathName + " (" + info.funcName + ":" + info.lineNo + ")"
	}

	/**
	 * Formats the log when leaving.
	 * @param {object} info - the caller information
	 * @property {string} info.pathName - the path name of the caller function
	 * @property {string} info.funcName - the function name of the caller function
	 * @property {number} info.lineNo   - the line number of the caller function
	 * @property {number} info.columnNo - the column number of the caller function
	 * @return {string} the leaving string
	 */
	debugtrace.formatLeave = function(info) {
		return "Leave " + info.pathName + " (" + info.funcName + ":" + info.lineNo + ")"
	}

	/**
	 * Formats the messgae.
	 * @param {string} message - the messgae
	 * @param {object} info - the caller information
	 * @property {string} info.pathName - the path name of the caller function
	 * @property {string} info.funcName - the function name of the caller function
	 * @property {number} info.lineNo   - the line number of the caller function
	 * @property {number} info.columnNo - the column number of the caller function
	 * @return {string} the formatted message
	 */
	debugtrace.formatMessage = function(message, info) {
		return message + " (" + info.funcName + ":" + info.lineNo + ")"
	}

	/**
	 * Formats the date.
	 * @param {Date} date - the date to output
	 * @return {string} the formatted date string
	 */
	debugtrace.formatDate = function(date) {
		return        date.getFullYear() + "-"
			+ ("0"  + (date.getMonth  () + 1 )).slice(-2) + "-"
			+ ("0"  +  date.getDate   ()      ).slice(-2) + " "
			+ ("0"  +  date.getHours  ()      ).slice(-2) + ":"
			+ ("0"  +  date.getMinutes()      ).slice(-2) + ":"
			+ ("0"  +  date.getSeconds()      ).slice(-2) + "."
			+ ("00" +  date.getMilliseconds() ).slice(-3)
	}

	/**
	 * Log line length limit.
	 * @type {number}
	 */
	debugtrace.columnLimit = 80

	/**
	 * Outputs a log when entering function.
	 */
	debugtrace.enter = function() {
		if (beforeNestLevel > nestLevel)
			basicPrint(getIndentString(), false) // Line break
		basicPrint(getIndentString() + this.formatEnter(getCallerInfo()), false)
		incNest()
	}

	/**
	 * Outputs a log when leavign function.
	 */
	debugtrace.leave = function() {
		decNest()
		basicPrint(getIndentString() + this.formatLeave(getCallerInfo()), false)
	}

	/**
	 * Outputs the message to the log.
	 * @param {string} message - the message
	 */
	debugtrace.print = function(message) {
		basicPrint(getIndentString() + message, true)
	}

	/**
	 * Outputs the name and the value to the log.
	 * @param {string} name - the name of the value
	 * @param {*} value - the value to output
	 */
	debugtrace.printValue = function(name, value) {
		var message = getIndentString() + name + this.varNameValueSeparator
		basicPrint(append(message, value), true)
	}

	return debugtrace
}())
