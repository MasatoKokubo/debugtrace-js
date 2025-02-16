# debugtrace-js

[Japanese](README_ja.md)

*debugtrace-js* is a library that outputs trace logs when debugging JavaScript programs. It is available on Node.js 16 or later.<br>
By embedding `debugtrace.enter()` and `debugtrace.leave()` at the start and end of functions, you can output the execution status of the JavaScript program under development to the log.

### 1. Features

* Automatically outputs invoker's function name, source file and line number.
* Automatically indents the log with nesting methods and objects.
* There are no dependent libraries at run time.

### 2. How to use

Do the following for debug target and related methods.

1. Insert `debugtrace.enter()` at the beginning of functions.
1. Insert `debugtrace.leave()` at the end of functions or just before the `return` statement.
1. Insert `debugtrace.print('foo', foo)` to output arguments, local variables and return value to the log if necessary.

The following is an example of JavaScript source used debugtrace-js methods and the log of when it has been executed.

```JavaScript:ReadmeExample.js
// ReadmeExample.js
const debugtrace = require('debugtrace-js') // TODO: Debug

class Contact {
  constructor(id, firstName, lastName, birthday) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.birthday = birthday
  }
}

const func2 = () => {
  debugtrace.enter() // TODO: Debug
  let contacts = [
    new Contact(1, 'Akane' , 'Apple', new Date(Date.UTC(1991, 2, 3))),
    new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
  ]
  debugtrace.print('contacts', contacts) // TODO: Debug
  debugtrace.leave() // TODO: Debug
}

const func1 = () => {
  debugtrace.enter() // TODO: Debug
  debugtrace.printMessage('Hello, World!')
  func2()
  debugtrace.leave() // TODO: Debug
}

func1()
```

```log:debugtrace.log
2025-02-11 15:49:38.591+09:00 debugtrace-js 2.2.0 on Node.js 22.13.1
2025-02-11 15:49:38.617+09:00
2025-02-11 15:49:38.618+09:00 Enter func1 (ReadmeExample.js:25)
2025-02-11 15:49:38.618+09:00 | Hello, World! (ReadmeExample.js:26)
2025-02-11 15:49:38.618+09:00 | Enter func2 (ReadmeExample.js:15)
2025-02-11 15:49:38.620+09:00 | | contacts = [
2025-02-11 15:49:38.620+09:00 | |   (Contact){
2025-02-11 15:49:38.620+09:00 | |     id: 1, firstName: 'Akane', lastName: 'Apple',
2025-02-11 15:49:38.620+09:00 | |     birthday: 1991-03-03 09:00:00.000+09:00
2025-02-11 15:49:38.621+09:00 | |   },
2025-02-11 15:49:38.621+09:00 | |   (Contact){
2025-02-11 15:49:38.621+09:00 | |     id: 2, firstName: 'Yukari', lastName: 'Apple',
2025-02-11 15:49:38.621+09:00 | |     birthday: 1992-04-04 09:00:00.000+09:00
2025-02-11 15:49:38.622+09:00 | |   }
2025-02-11 15:49:38.622+09:00 | | ] (ReadmeExample.js:20)
2025-02-11 15:49:38.622+09:00 | Leave func2 (ReadmeExample.js:21) duration: 00:00:00.004
2025-02-11 15:49:38.622+09:00 Leave func1 (ReadmeExample.js:28) duration: 00:00:00.004
```

### 3. Function List

This library has the following methods. These have no return value.

<table>
  <caption>Function List</caption>
  <tr>
    <th style="text-align:center">Function Name</th>
    <th style="text-align:center">Arguments</th>
    <th style="text-align:center">Return Value</th>
    <th style="text-align:center">Description</th>
  </tr>
  <tr>
    <td><code>enter</code></td>
    <td><i>None</i></td>
    <td><i>None</i></td>
    <td>Outputs function start to log.</td>
  </tr>
  <tr>
    <td><code>leave</code></td>
    <td><i>None</i></td>
    <td><i>None</i></td>
    <td>Outputs function end to log.</td>
  </tr>
  <tr>
    <td><code>printMessage</code></td>
    <td><code>message</code>: The message</td>
    <td>The message</td>
    <td>Outputs the message to log.</td>
  </tr>
  <tr>
    <td><code>print</code></td>
    <td>
      <code>name</code>: The value name<br>
      <code>value</code>: The value<br>
      <code>printOptions</code>: Has the following properties (optional):<br>
      <ul>
        <code>stringLength</code>: if <code>true</code>, outputs the string length<br>
        <code>arrayLength</code>: if <code>true</code>, outputs the array length<br>
        <code>size</code>: if <code>true</code>, outputs the size of <code>Map</code> or <code>Set</code><br>
        <code>collectionLimit</code>: limit on the number of output elements for <code>Map</code> and <code>Set</code><br>
        <code>stringLimit</code>: limit on the number of output characters for <code>strings</code><br>
        <code>reflectionNestLimit</code>: limit on the number of reflection nests
      </ul>
    </td>
    <td>The value</td>
    <td>Outputs to the log in the form of<br><code>name = value</code></td>
  </tr>
</table>

### 4. Properties of *debugtrace-js*

The following properties can be specified for on debugtrace-js.

<table>
  <caption>debugtrace.properties</caption>
  <tr>
    <th style="text-align:center">Property Name</th>
    <th style="text-align:center">Description</th>
  </tr>
  <tr>
    <td><code>formatEnter</code></td>
    <td>The format function of the log output when entering functions<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatEnter = (name, fileName, lineNumber) =>
      `Enter ${name} (${fileName}:${lineNumber})`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: The function name<br>
        <code>fileName</code>:  The file name<br>
        <code>lineNumber</code>: The line number
      </ul>
  </tr>
  <tr>
    <td><code>formatLeave</code></td>
    <td>The format function of the log output when leaving functions<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatLeave = (name, fileName, lineNumber, duration) =>
      `Leave ${name} (${fileName}:${lineNumber}) duration: ${duration}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: the function name<br>
        <code>fileName</code>: the file name<br>
        <code>lineNumber</code>: the line number<br>
        <code>duration</code>: the duration since invoking the corresponding `enter` function
      </ul>
  </tr>
  <tr>
    <td><code>indentString</code></td>
    <td>The indentation string for code<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.indentString = '| '</code>
      <br>
  </tr>
  <tr>
    <td><code>dataIndentString</code></td>
    <td>The indentation string for data<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.dataIndentString = '  '</code>
    <br>
  </tr>
  <tr>
    <td><code>limitString</code></td>
    <td>The string to represent that it has exceeded the limit<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.limitString = '...'</code>
      <br>
  </tr>
  <tr>
    <td><code>cyclicReferenceString</code></td>
    <td>The string to represent that the cyclic reference occurs<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.cyclicReferenceString = '*** cyclic reference ***'</code>
      <br>
  </tr>
  <tr>
    <td><code>varNameValueSeparator</code></td>
    <td>The separator string between the variable name and value<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.varNameValueSeparator = ' = '</code>
      <br>
  </tr>
  <tr>
    <td><code>keyValueSeparator</code></td>
    <td>The separator string between the key and value of Map object<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.keyValueSeparator = ': '</code>
    <br>
  </tr>
  <tr>
    <td><code>formatPrintSuffix</code></td>
    <td>
      The format function for string added by the `print` function<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatPrintSuffix = (name, fileName, lineNumber) =>
      `(${fileName}:${lineNumber})`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: the function name [.small]#_(Not used by default)_#<br>
        <code>fileName</code>: the file name<br>
        <code>lineNumber</code>: the line number
      </ul>
  </tr>
  <tr>
    <td><code>formatLength</code></td>
    <td>The format function for array and string length<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatLength = length => `length:${length}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>length</code>: number of elements or string length
      </ul>
  </tr>
  <tr>
    <td><code>formatSize</code></td>
    <td>The format function for `Map` and `Set
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatSize = size => `size:${size}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>size</code>: number of elements
      <ul>
  </tr>
  <tr>
    <td><code>formatDate</code></td>
    <td>The format function for `Date
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatDate = date => {
      let timezoneOffset = date.getTimezoneOffset()
      const offsetSign = timezoneOffset < 0 ? '+' : '-'
      if (timezoneOffset < 0)
        timezoneOffset = -timezoneOffset
      const str =date.getFullYear() + '-' +
      ('0'+ (date.getMonth() + 1 )).slice(-2) + '-' +
      ('0'+date.getDate ()).slice(-2) + ' ' +
      ('0'+date.getHours()).slice(-2) + ':' +
      ('0'+date.getMinutes()).slice(-2) + ':' +
      ('0'+date.getSeconds()).slice(-2) + '.' +
      ('00' +date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'+Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'+timezoneOffset % 60).slice(-2)
      return str
    }</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a <code>Date</code>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatTime</code></td>
    <td>The format function for `duration` of `formatLeave
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatTime = date =>
      `('0'  +  date.getUTCHours  ()     ).slice(-2) + ':' +
      `('0'  +  date.getUTCMinutes()     ).slice(-2) + ':' +
      `('0'  +  date.getUTCSeconds()     ).slice(-2) + '.' +
      `('00' +  date.getUTCMilliseconds()).slice(-3)</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a duration
      </ul>
  </tr>
  <tr>
    <td><code>formatLogDate</code></td>
    <td>
      The format function for the log date and time<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      [.small]#_See_# `formatDate
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a log <code>Date</code>
      </ul>
  </tr>
  <tr>
    <td><code>maximumDataOutputWidth</code></td>
    <td>
      The minimum value to output the length of string<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.maximumDataOutputWidth = 70</code>
    </td>
  </tr>
  <tr>
    <td><code>collectionLimit</code></td>
    <td>
      The limit value of elements for array, `Map` and `Set` to output<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.collectionLimit = 128</code>
  </tr>
  <tr>
    <td><code>stringLimit</code></td>
    <td>The limit value of characters for string to output<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.stringLimit = 256</code>
  </tr>
  <tr>
    <td><code>reflectionNestLimit</code></td>
    <td>The limit value for reflection nesting<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.reflectionNestLimit = 4</code>
  </tr>
  <tr>
    <td><code>basicPrint</code></td>
    <td>
      The basic print function<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.basicPrint = console.log</code>
      <br>
      <span style="font-size:small;font-weight:bold">Example (Output to stderr):</span>
      <code>
    debugtrace.basicPrint = console.error</code>
  </tr>
</table>

### 5. License

[MIT ライセンス(MIT)](LICENSE.txt)

_(C) 2015 Masato Kokubo_

### 6. Release Notes

#### debugtrace-js 2.2.0 - February 16, 2025

* The following properties have been deleted.
  * `debugtrace.minimumOutputLengthAndSize`
  * `debugtrace.minimumOutputStringLength`

* The default values ​​of the following properties have been changed.
  |Property name               |Default value|Old default value|
  |:---------------------------|------------:|----------------:|
  |`debugtrace.collectionLimit`|          128|              512|
  |`debugtrace.stringLimit`    |          256|             8192|

* The `printOptions` argument (optional) has been added to the `print` function.
 
#### debugtrace-js 2.1.2 - March 13, 2022

* The `print` and `printMessage` functions now return the argument value.

#### debugtrace-js 2.1.1 - October 9, 2021

* Fixed a bug that an exception is thrown when outputting a type name.
* Changed to output Node.js version at startup.

#### debugtrace-js 2.1.0 - August 9, 2021

* Improved function output (output only the first line of the function definition)
* Added the `basicPrint` function
* Improved the line break handling of data output

#### debugtrace-js 2.0.0 - August 2, 2020

* Supported Node.js 10 or later
* Improved the line break handling of data output
