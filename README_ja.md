debugtrace-js
=========

debugtrace-js は、デバッグ用のログを出力するためのライブラリです。

以下は、debugtrace-js を使用した JavaScript の例とそれを実行した際のログです。
ログは自動的にインデントされます。

#### debugtrace-js の使用例

```javascript:example1.js
"use strict"

const debugtrace = require('debugtrace-js')

function func1() {
    debugtrace.enter()
    func2()
    func3()
    debugtrace.leave()
}

function func2() {
    debugtrace.enter()
    debugtrace.leave()
}

function func3() {
    debugtrace.enter()

    const nullValue = null, undefinedValue = undefined
    debugtrace.printValue("nullValue", nullValue)
    debugtrace.printValue("undefinedValue", undefinedValue)

    const boolFalse = false, boolTrue = true
    debugtrace.printValue("boolFalse", boolFalse)
    debugtrace.printValue("boolTrue", boolTrue)

    const number0 = 0, number1_234 = 1.234
    debugtrace.printValue("number0", number0)
    debugtrace.printValue("number1_234", number1_234)

    const stringAAA = "AAA"
    debugtrace.printValue("stringAAA", stringAAA)

    const dateNow = new Date
    debugtrace.printValue("dateNow", dateNow)

    const error = new Error("This is a error.")
    debugtrace.printValue("error", error)

    const array = [1, 2, [1.1, 1.2, 1.3]]
    debugtrace.printValue("array", array)

    const numbers = []
    for (let index = 0; index < 100; ++index) {
        numbers.push(index)
    }
    debugtrace.printValue("numbers", numbers)

    function add(a, b) {
        return a + b
    }
    debugtrace.printValue("add", add)

    const d = (function (a, b) {
        debugtrace.enter()
        const c = a + b
        debugtrace.printValue("c", c)
        debugtrace.leave()
        return c
    })(5, 6)
    debugtrace.printValue("d", d)

    const object = {a:1, b:2, c:3}
    debugtrace.printValue("object", object)

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
    debugtrace.printValue("Point", Point)

    const point1 = new Point(10, 20)
    const point2 = new Point(30, 40)
    const point3 = point1.add(point2).mul(point1.sub(point2))
    debugtrace.printValue("point1", point1)
    debugtrace.printValue("point2", point2)
    debugtrace.printValue("point3", point3)

    debugtrace.leave()
}

func1()
```

#### 例を実行した際のログ

```log:debugtrace.log
2016-11-23 18:57:57.337 Enter Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func1:6)
2016-11-23 18:57:57.357 | Enter Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func2:13)
2016-11-23 18:57:57.358 | Leave Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func2:14)
2016-11-23 18:57:57.359 |
2016-11-23 18:57:57.359 | Enter Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func3:18)
2016-11-23 18:57:57.360 | | nullValue = null (func3:21)
2016-11-23 18:57:57.361 | | undefinedValue = undefined (func3:22)
2016-11-23 18:57:57.362 | | boolFalse = false (func3:25)
2016-11-23 18:57:57.362 | | boolTrue = true (func3:26)
2016-11-23 18:57:57.363 | | number0 = 0 (func3:29)
2016-11-23 18:57:57.364 | | number1_234 = 1.234 (func3:30)
2016-11-23 18:57:57.364 | | stringAAA = "AAA" (func3:33)
2016-11-23 18:57:57.365 | | dateNow = 2016-11-23 18:57:57.365 (func3:36)
2016-11-23 18:57:57.370 | | error = Error: This is a error. (func3:39)
2016-11-23 18:57:57.372 | | array = [1, 2, [1.1, 1.2, 1.3]] (func3:42)
2016-11-23 18:57:57.374 | | numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
2016-11-23 18:57:57.374 | |   19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
2016-11-23 18:57:57.375 | |   38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
2016-11-23 18:57:57.375 | |   57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
2016-11-23 18:57:57.376 | |   76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
2016-11-23 18:57:57.376 | |   95, 96, 97, 98, 99
2016-11-23 18:57:57.377 | | ] (func3:48)
2016-11-23 18:57:57.382 | | add = function add(a, b) {
2016-11-23 18:57:57.382 | |         return a + b
2016-11-23 18:57:57.382 | |     } (func3:53)
2016-11-23 18:57:57.383 | | Enter Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (:56)
2016-11-23 18:57:57.383 | | | c = 11 (:58)
2016-11-23 18:57:57.385 | | Leave Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (:59)
2016-11-23 18:57:57.385 | | d = 11 (func3:62)
2016-11-23 18:57:57.386 | | object = {
2016-11-23 18:57:57.387 | |   a:1,
2016-11-23 18:57:57.387 | |   b:2,
2016-11-23 18:57:57.388 | |   c:3
2016-11-23 18:57:57.388 | | } (func3:65)
2016-11-23 18:57:57.389 | | Point = class Point {
2016-11-23 18:57:57.389 | |         constructor(x, y) {
2016-11-23 18:57:57.389 | |             this.x = x
2016-11-23 18:57:57.390 | |             this.y = y
2016-11-23 18:57:57.393 | |         }
2016-11-23 18:57:57.393 | |         add(p) {return new Point(this.x + p.x, this.y + p.y)}
2016-11-23 18:57:57.393 | |         sub(p) {return new Point(this.x - p.x, this.y - p.y)}
2016-11-23 18:57:57.393 | |         mul(p) {return new Point(this.x * p.x, this.y * p.y)}
2016-11-23 18:57:57.394 | |         div(p) {return new Point(this.x / p.x, this.y / p.y)}
2016-11-23 18:57:57.395 | |     } (func3:77)
2016-11-23 18:57:57.397 | | point1 = {
2016-11-23 18:57:57.397 | |   x:10,
2016-11-23 18:57:57.398 | |   y:20
2016-11-23 18:57:57.398 | | } (func3:82)
2016-11-23 18:57:57.399 | | point2 = {
2016-11-23 18:57:57.399 | |   x:30,
2016-11-23 18:57:57.400 | |   y:40
2016-11-23 18:57:57.400 | | } (func3:83)
2016-11-23 18:57:57.403 | | point3 = {
2016-11-23 18:57:57.404 | |   x:-800,
2016-11-23 18:57:57.404 | |   y:-1200
2016-11-23 18:57:57.405 | | } (func3:84)
2016-11-23 18:57:57.405 | Leave Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func3:86)
2016-11-23 18:57:57.406 Leave Z:\Develop\JavaScript\DebugTrace.js\test\example1.js (func1:9)
```

#### ライセンス

[MIT ライセンス (MIT)](LICENSE.txt)

*&copy; 2015 Masato Kokubo*

[English](README.md)
