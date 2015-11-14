DebugTrace.js
=========

The following are a javascript sample source used DebugTrace.js functions and a log of when the javascript sample was executed.  
Log bodys are automatically indent.

#### Sample source:

	"use strict"

	const debugTrace =  require('./DebugTrace.js/DebugTrace')

	function func1() {
		debugTrace.enter()
		func2()
		debugTrace.leave()
	}

	function func2() {
		debugTrace.enter()
		func3()
		debugTrace.leave()
	}

	function func3() {
		debugTrace.enter()

		const nullValue = null, undefinedValue = undefined
		debugTrace.printValue("nullValue", nullValue)
		debugTrace.printValue("undefinedValue", undefinedValue)

		const boolFalse = false, boolTrue = true
		debugTrace.printValue("boolFalse", boolFalse)
		debugTrace.printValue("boolTrue", boolTrue)

		const number0 = 0, number1_234 = 1.234
		debugTrace.printValue("number0", number0)
		debugTrace.printValue("number1_234", number1_234)

		const stringAAA = "AAA"
		debugTrace.printValue("stringAAA", stringAAA)

		const dateNow = new Date
		debugTrace.printValue("dateNow", dateNow)

		const error = new Error("This is a error.")
		debugTrace.printValue("error", error)

		const array = [1, 2, [1.1, 1.2, 1.3]]
		debugTrace.printValue("array", array)

		const numbers = []
		for (let index = 0; index < 100; ++index) {
			numbers.push(index)
		}
		debugTrace.printValue("numbers", numbers)

		function add(a, b) {
			return a + b
		}
		debugTrace.printValue("add", add)

		const object = {a:1, b:2, c:3}
		debugTrace.printValue("object", object)

		class Point {
			constructor(x, y) {
				this.x = x
				this.y = y
			}
			add(p) {return new Point(this.x + p.x, this.y + p.y)}
			sub(p) {return new Point(this.x - p.x, this.y - p.y)}
			mul(p) {return new Point(this.x * p.x, this.y * p.y)}
			div(p) {return new Point(this.x / p.x, this.y / p.y)}
		}
		debugTrace.printValue("Point", Point)

		var point1 = new Point(10, 20)
		var point2 = new Point(30, 40)
		var point3 = point1.add(point2).mul(point1.sub(point2))
		debugTrace.printValue("point1", point1)
		debugTrace.printValue("point2", point2)
		debugTrace.printValue("point3", point3)

		debugTrace.leave()
	}

	func1()


#### Log of when the javascript sample has been executed:

	2015-11-14 14:34:06.507 Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func1 (6)
	2015-11-14 14:34:06.523 |  Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func2 (12)
	2015-11-14 14:34:06.523 |  |  Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func3 (18)
	2015-11-14 14:34:06.523 |  |  |  nullValue = null (func3:21)
	2015-11-14 14:34:06.523 |  |  |  undefinedValue = undefined (func3:22)
	2015-11-14 14:34:06.523 |  |  |  boolFalse = false (func3:25)
	2015-11-14 14:34:06.523 |  |  |  boolTrue = true (func3:26)
	2015-11-14 14:34:06.523 |  |  |  number0 = 0 (func3:29)
	2015-11-14 14:34:06.523 |  |  |  number1_234 = 1.234 (func3:30)
	2015-11-14 14:34:06.523 |  |  |  stringAAA = "AAA" (func3:33)
	2015-11-14 14:34:06.523 |  |  |  dateNow = 2015-11-14 14:34:06.523 (func3:36)
	2015-11-14 14:34:06.523 |  |  |  error = Error: This is a error. (func3:39)
	2015-11-14 14:34:06.539 |  |  |  array = [1, 2, [1.1, 1.2, 1.3]] (func3:42)
	2015-11-14 14:34:06.539 |  |  |  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
	2015-11-14 14:34:06.539 |  |  |     18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
	2015-11-14 14:34:06.539 |  |  |     36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
	2015-11-14 14:34:06.539 |  |  |     54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
	2015-11-14 14:34:06.539 |  |  |     72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
	2015-11-14 14:34:06.539 |  |  |     90, 91, 92, 93, 94, 95, 96, 97, 98, 99
	2015-11-14 14:34:06.539 |  |  |  ] (func3:48)
	2015-11-14 14:34:06.539 |  |  |  add = function add(a, b) {
	2015-11-14 14:34:06.539 |  |  |          return a + b
	2015-11-14 14:34:06.539 |  |  |      } (func3:53)
	2015-11-14 14:34:06.539 |  |  |  object = {
	2015-11-14 14:34:06.539 |  |  |     a:1,
	2015-11-14 14:34:06.539 |  |  |     b:2,
	2015-11-14 14:34:06.539 |  |  |     c:3
	2015-11-14 14:34:06.539 |  |  |  } (func3:56)
	2015-11-14 14:34:06.554 |  |  |  Point = class Point {
	2015-11-14 14:34:06.554 |  |  |          constructor(x, y) {
	2015-11-14 14:34:06.554 |  |  |              this.x = x
	2015-11-14 14:34:06.554 |  |  |              this.y = y
	2015-11-14 14:34:06.554 |  |  |          }
	2015-11-14 14:34:06.554 |  |  |          add(p) {return new Point(this.x + p.x, this.y + p.y)}
	2015-11-14 14:34:06.554 |  |  |          sub(p) {return new Point(this.x - p.x, this.y - p.y)}
	2015-11-14 14:34:06.554 |  |  |          mul(p) {return new Point(this.x * p.x, this.y * p.y)}
	2015-11-14 14:34:06.554 |  |  |          div(p) {return new Point(this.x / p.x, this.y / p.y)}
	2015-11-14 14:34:06.554 |  |  |      } (func3:68)
	2015-11-14 14:34:06.554 |  |  |  point1 = {
	2015-11-14 14:34:06.554 |  |  |     x:10,
	2015-11-14 14:34:06.554 |  |  |     y:20
	2015-11-14 14:34:06.554 |  |  |  } (func3:73)
	2015-11-14 14:34:06.554 |  |  |  point2 = {
	2015-11-14 14:34:06.554 |  |  |     x:30,
	2015-11-14 14:34:06.554 |  |  |     y:40
	2015-11-14 14:34:06.554 |  |  |  } (func3:74)
	2015-11-14 14:34:06.554 |  |  |  point3 = {
	2015-11-14 14:34:06.570 |  |  |     x:-800,
	2015-11-14 14:34:06.570 |  |  |     y:-1200
	2015-11-14 14:34:06.570 |  |  |  } (func3:75)
	2015-11-14 14:34:06.570 |  |  Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func3 (77)
	2015-11-14 14:34:06.570 |  Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func2 (14)
	2015-11-14 14:34:06.570 Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func1 (8)
