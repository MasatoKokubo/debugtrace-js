/**
DebugTrace.js 0.1.0
(C) 2015 Masato Kokubop
*/
var resource = require('./DebugTrace_resources')

var nestLevel       = 0 // Nest Level
var beforeNestLevel = 0 // Before Nest Level
var dataNestLevel   = 0 // Data Nest Level

// Array of indent strings
var indentStrings = [""]
for (var index = 1; index < 32; ++index)
	indentStrings.push(indentStrings[indentStrings.length - 1] + resource.indentString)

// Array of data indent strings
var dataIndentStrings = [""]
for (var index = 1; index < 32; ++index)
	dataIndentStrings.push(dataIndentStrings[dataIndentStrings.length - 1] + resource.dataIndentString)

// Returns a string corresponding to the current indent.
function getIndentString() {
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

// Up the nest level.
function upNest() {
	beforeNestLevel = nestLevel
	++nestLevel
}

// Down the nest level.
function downNest() {
	 beforeNestLevel =  nestLevel
	--nestLevel
}

// Up the data nest level.
function upDataNest() {
	++dataNestLevel
}

// Down the data nest level.
function downDataNest() {
	--dataNestLevel
}

// Returns a caller stack trace element.
function getCallerInfo() {
	var myModuleName = "DebugTrace\.js$"

	var callerInfos = new Error("").stack.split("\n")
		.filter(function(line) {return line.indexOf(" at ") >= 0})
		.map   (function(line) {
			var parts = line.substring(line.indexOf(" at ") + 4).split(" ")
			var parts2 = parts[1].slice(1, -1).split(":")

			var methodName = parts[0]
			var pathName   = parts2.length <= 3 ? parts2[0] : parts2[0] + ":" + parts2[1]
			var lineNo     = parts2[parts2.length - 2]
			var columnNo   = parts2[parts2.length - 1]

			return {
				methodName : methodName,
				pathName   : pathName,
				lineNo     : lineNo,
				columnNo   : columnNo
			}
		})
		.filter(function(element) {return !element.pathName.match(myModuleName)})

	return callerInfos[0]
}

// Basic print a log
function basicPrint(message, withCallerInfo) {
	var logString = resource.formatDate(new Date()) + " "
		+ (withCallerInfo ? resource.formatMessage(message, getCallerInfo()) : message)

	console.log(logString);
	return getIndentString()
}

// Returns a string representation of the value.
function append(message, value) {
	if (value == null) {
		logString = message + value
	} else {
		var type = Object.prototype.toString.call(value).slice(8, -1)
		if      (type == "Array"   ) logString = appendArray(message, value)
		else if (type == "Boolean" ) logString = message + value
		else if (type == "Number"  ) logString = message + value
		else if (type == "String"  ) logString = message + "\"" + value + "\""
		else if (type == "Date"    ) logString = message + resource.formatDate(value)
		else if (type == "Error"   ) logString = message + value
		else if (type == "Function") logString = appendFunction(message, value)
		else if (type == "RegExp"  ) logString = message + value
		else                         logString = appendObject(message, value)
	}

	return logString
}

// Returns a string representation of the array value.
function appendArray(message, value) {
	var logString = message + "["
	var upped = false

	for (var index = 0; index < value.length; ++index) {
		logString = append(logString, value[index])
		if (index < value.length - 1)
			logString = logString + ", "

		if (logString.length > resource.columnLimit) {
			if (!upped) {
				upDataNest()
				upped = true
			}
			logString = basicPrint(logString, false)
		}
	}

	if (upped) {
		downDataNest()
		logString = basicPrint(logString, false)
	}

	var logString = logString + "]"
	return logString;
}

// Returns a string representation of the object value.
function appendObject(message, value) {
	var count = 0
	for (var property in value)
		++count

	var logString = message + "{"
	upDataNest()
	logString = basicPrint(logString, false)

	var index = 0 
	for (var property in value) {
		logString = logString + property + ":"
		logString = append(logString, value[property])
		if (index < count - 1)
			logString = logString + ", "

		if (index == count - 1)
			downDataNest()
		logString = basicPrint(logString, false)
		++index
	}

	logString = logString + "}"

	return logString;
}

// Returns a string representation of the function value.
function appendFunction(message, value) {
	var lines = ("" + value).split("\t").join("    ").split("\n")
	var logString = message

	for (var index = 0; index < lines.length; ++index) {
		if (index >= 1)
			logString = basicPrint(logString, false)
		logString = logString + lines[index]
	}

	return logString;
}

// Exports
module.exports = {
	/** Call this method at entrance of your methods. */
	enter : function() {
		if (beforeNestLevel >  nestLevel)
			basicPrint("", false) // Line break
		basicPrint(getIndentString() + resource.formatEnter(getCallerInfo()), false)
		upNest()
	},

	/** Call this method at exit of your methods. */
	leave : function() {
		downNest()
		basicPrint(getIndentString() + resource.formatLeave(getCallerInfo()), false)
	},

	/**
	Outputs the message to the log.
	@param message a message
	*/
	print : function(message) {
		basicPrint(getIndentString() + message, true)
	},

	/**
	Outputs the name and the boolean value to the log.
	@param name the name
	@param value the value
	*/
	printValue : function(name, value) {
		var message = getIndentString() + name + resource.varNameValueSeparator
		basicPrint(append(message, value), true)
	},


}
