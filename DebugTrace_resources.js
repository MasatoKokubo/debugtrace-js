/**
resource.js
(C) 2015 Masato Kokubop
*/
module.exports = {
	// String of method call indent
	indentString          : "|  ",

	// String of data indent
	dataIndentString      : "   ",

	// Separator between the variable name and value
	varNameValueSeparator : " = ",

	// Function of format enter
	formatEnter           : function(info) {
		return "Enter " + info.pathName + " " + info.methodName + " (" + info.lineNo + ")"
	},

	// Function of format leave
	formatLeave           : function(info) {
		return "Leave " + info.pathName + " " + info.methodName + " (" + info.lineNo + ")"
	},

	// Function of format messgae
	formatMessage         : function(message, info) {
		return message + " (" + info.methodName + ":" + info.lineNo + ")"
	},

	// Function of format date
	formatDate            : function(date) {
		return        date.getFullYear() + "-"
			+ ("0"  + (date.getMonth  () + 1 )).slice(-2) + "-"
			+ ("0"  +  date.getDate   ()      ).slice(-2) + " "
			+ ("0"  +  date.getHours  ()      ).slice(-2) + ":"
			+ ("0"  +  date.getMinutes()      ).slice(-2) + ":"
			+ ("0"  +  date.getSeconds()      ).slice(-2) + "."
			+ ("00" +  date.getMilliseconds() ).slice(-3)
	},

	// Output limit of length for a log line
	columnLimit           : 80,
};
