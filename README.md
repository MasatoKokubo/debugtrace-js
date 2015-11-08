DebugTrace.js
=========

The following are a javascript sample source used DebugTrace.js functions and a log of when the javascript sample was executed.  
Log bodys are automatically indent.

#### Sample source:

	var debugTrace =  require('./DebugTrace.js/DebugTrace');

	function func1() {
		debugTrace.enter();
		func2();
		debugTrace.leave();
	};

	function func2() {
		debugTrace.enter()
		func3()
		debugTrace.leave()
	}

	function func3() {
		debugTrace.enter()

		debugTrace.printValue("false", false);
		debugTrace.printValue("true ", true);
		debugTrace.printValue("0    ", 0);
		debugTrace.printValue("1.234", 1.234);
		debugTrace.printValue("AAA  ", "AAA");
		debugTrace.printValue("null ", null);
		debugTrace.printValue("undefined", undefined);
		debugTrace.printValue("new Date()", new Date());
		debugTrace.printValue("new Error(\"error\")", new Error("error"));

		debugTrace.printValue("[1, 2, [1.1, 1.2, 1.3]]", [1, 2, [1.1, 1.2, 1.3]]);

		var numbers = []
		for (var index = 0; index < 100; ++index) {
			numbers.push(index)
		}
		debugTrace.printValue("numbers", numbers);


		debugTrace.printValue("function",
			function(a) {
				return a * a
			}
		);

		var object = {a:1, b:2, c:3}
		debugTrace.printValue("object", object);

		debugTrace.leave()
	}

	func1()


#### Log of when the javascript sample has been executed:

	2015-11-08 21:09:19.469 Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func1 (4)
	2015-11-08 21:09:19.482 |  Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func2 (10)
	2015-11-08 21:09:19.483 |  |  Enter Z:\Develop\JavaScript\DebugTrace.js\sample.js func3 (16)
	2015-11-08 21:09:19.484 |  |  |  false = false (func3:18)
	2015-11-08 21:09:19.485 |  |  |  true  = true (func3:19)
	2015-11-08 21:09:19.486 |  |  |  0     = 0 (func3:20)
	2015-11-08 21:09:19.487 |  |  |  1.234 = 1.234 (func3:21)
	2015-11-08 21:09:19.487 |  |  |  AAA   = "AAA" (func3:22)
	2015-11-08 21:09:19.488 |  |  |  null  = null (func3:23)
	2015-11-08 21:09:19.488 |  |  |  undefined = undefined (func3:24)
	2015-11-08 21:09:19.488 |  |  |  new Date() = 2015-11-08 21:09:19.488 (func3:25)
	2015-11-08 21:09:19.489 |  |  |  new Error("error") = Error: error (func3:26)
	2015-11-08 21:09:19.490 |  |  |  [1, 2, [1.1, 1.2, 1.3]] = [1, 2, [1.1, 1.2, 1.3]] (func3:28)
	2015-11-08 21:09:19.490 |  |  |  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
	2015-11-08 21:09:19.491 |  |  |     18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
	2015-11-08 21:09:19.491 |  |  |     36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
	2015-11-08 21:09:19.491 |  |  |     54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
	2015-11-08 21:09:19.492 |  |  |     72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
	2015-11-08 21:09:19.492 |  |  |     90, 91, 92, 93, 94, 95, 96, 97, 98, 99
	2015-11-08 21:09:19.492 |  |  |  ] (func3:34)
	2015-11-08 21:09:19.494 |  |  |  function = function (a) {
	2015-11-08 21:09:19.495 |  |  |              return a * a
	2015-11-08 21:09:19.495 |  |  |          } (func3:37)
	2015-11-08 21:09:19.495 |  |  |  object = {
	2015-11-08 21:09:19.496 |  |  |     a:1,
	2015-11-08 21:09:19.496 |  |  |     b:2,
	2015-11-08 21:09:19.496 |  |  |     c:3
	2015-11-08 21:09:19.496 |  |  |  } (func3:44)
	2015-11-08 21:09:19.498 |  |  Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func3 (46)
	2015-11-08 21:09:19.499 |  Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func2 (12)
	2015-11-08 21:09:19.499 Leave Z:\Develop\JavaScript\DebugTrace.js\sample.js func1 (6)