const debugtrace = require('../debugtrace')

beforeAll(() => {
    debugtrace.maximumDataOutputWidth = 200
})

beforeEach(() => debugtrace.enter())

afterEach(() => debugtrace.leave())

test('printMessage', () => {
    debugtrace.printMessage('a message', null)
    expect(debugtrace.lastLog).toContain('a message')
})

test('print null, etc', () => {
    debugtrace.print('v', null)
    expect(debugtrace.lastLog).toContain('v = null')

    let v = undefined
    debugtrace.print('v', v)
    expect(debugtrace.lastLog).toContain('v = undefined')

    debugtrace.print('v', Infinity)
    expect(debugtrace.lastLog).toContain('v = Infinity')

    debugtrace.print('v', NaN)
    expect(debugtrace.lastLog).toContain('v = NaN')
})

test('print Symbol', () => {
    debugtrace.print('v', Symbol())
    expect(debugtrace.lastLog).toContain('v = Symbol()')

    debugtrace.print('v', Symbol(1))
    expect(debugtrace.lastLog).toContain('v = Symbol(1)')

    debugtrace.print('v', Symbol('A'))
    expect(debugtrace.lastLog).toContain("v = Symbol(A)")
})

test('print Boolean', () => {
    debugtrace.print('v', false)
    expect(debugtrace.lastLog).toContain('v = false')

    debugtrace.print('v', true)
    expect(debugtrace.lastLog).toContain('v = true')
})

test('print Number', () => {
    debugtrace.print('v', 1)
    expect(debugtrace.lastLog).toContain('v = 1')

    debugtrace.print('v', -123456789)
    expect(debugtrace.lastLog).toContain('v = -123456789')

    debugtrace.print('v', 13456789)
    expect(debugtrace.lastLog).toContain('v = 13456789')
})

test('print String', () => {
    debugtrace.print('v', 'ABCD')
    expect(debugtrace.lastLog).toContain("v = 'ABCD'")

    debugtrace.print('v', 'ABCDE')
    expect(debugtrace.lastLog).toContain("v = (length:5)'ABCDE'")

    debugtrace.print('v', '\0\b\t\n\v\f\'\\')
    expect(debugtrace.lastLog).toContain("v = (length:8)'\\0\\b\\t\\n\\v\\f\\'\\\\'")

    debugtrace.print('v', '\x01\x02\x03\x04\x05\x06\x07\x0E\x0F')
    expect(debugtrace.lastLog).toContain("v = (length:9)'\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x0E\\x0F'")

    debugtrace.print('v', '\x10\x11\x12\x13\x14\x15\x16\x17')
    expect(debugtrace.lastLog).toContain("v = (length:8)'\\x10\\x11\\x12\\x13\\x14\\x15\\x16\\x17'")

    debugtrace.print('v', '\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F')
    expect(debugtrace.lastLog).toContain("v = (length:9)'\\x18\\x19\\x1A\\x1B\\x1C\\x1D\\x1E\\x1F\\x7F'")
})

test('print Date', () => {
    debugtrace.print('v', new Date(2020, 7-1, 19, 17, 36, 47, 123))
    expect(debugtrace.lastLog).toContain('v = 2020-07-19 17:36:47.123')
})

test('print Error', () => {
    debugtrace.print('v', new Error('error'))
    expect(debugtrace.lastLog).toContain('v = Error: error (print.test.js:')
})

test('print Function', () => {
    debugtrace.print('v', function add(a, b) {return a + b})
    debugtrace.print('v', debugtrace.lastLog)
// 2.1.0
//  expect(debugtrace.lastLog).toContain('v = function add(a, b) {')
//  expect(debugtrace.lastLog).toContain('  return a + b')
//  expect(debugtrace.lastLog).toContain('}')
    expect(debugtrace.lastLog).toContain('v = function add(a, b) {...')
////
})

test('print RegExp', () => {
    debugtrace.print('v', /[a-z]+/)
    expect(debugtrace.lastLog).toContain('v = /[a-z]+/')
})

test('print Array', () => {
    debugtrace.print('v', [1, 2, 3, 4])
    expect(debugtrace.lastLog).toContain('v = [1, 2, 3, 4]')

    debugtrace.print('v', [1, 2, 3, 4, 5])
    expect(debugtrace.lastLog).toContain('v = (length:5)[1, 2, 3, 4, 5]')

    debugtrace.print('v', [1, 2, [3, 4, [5, 6, [7, 8]]]])
    expect(debugtrace.lastLog).toContain('v = [1, 2, [3, 4, [5, 6, [7, 8]]]]')

    debugtrace.print('v', ['A', 'ABCD', 'ABCDE'])
    expect(debugtrace.lastLog).toContain("v = ['A', 'ABCD', (length:5)'ABCDE']")
})

test('print Int8Array', () => {
    debugtrace.print('v', Int8Array.of(1, -2, 3, -4))
    expect(debugtrace.lastLog).toContain('v = (Int8Array)[1, -2, 3, -4]')

    debugtrace.print('v', Int8Array.of(1, -2, 3, -4, 5))
    expect(debugtrace.lastLog).toContain('v = (Int8Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint8Array', () => {
    debugtrace.print('v', Uint8Array.of(1, 2, 3, 4))
    expect(debugtrace.lastLog).toContain('v = (Uint8Array)[1, 2, 3, 4]')

    debugtrace.print('v', Uint8Array.of(1, 2, 3, 4, 5))
    expect(debugtrace.lastLog).toContain('v = (Uint8Array length:5)[1, 2, 3, 4, 5]')
})

test('print Uint8ClampedArray', () => {
    debugtrace.print('v', Uint8ClampedArray.of(1, 2, 3, 4))
    expect(debugtrace.lastLog).toContain('v = (Uint8ClampedArray)[1, 2, 3, 4]')

    debugtrace.print('v', Uint8ClampedArray.of(1, 2, 3, 4, 5))
    expect(debugtrace.lastLog).toContain('v = (Uint8ClampedArray length:5)[1, 2, 3, 4, 5]')
})

test('print Int16Array', () => {
    debugtrace.print('v', Int16Array.of(1, -2, 3, -4))
    expect(debugtrace.lastLog).toContain('v = (Int16Array)[1, -2, 3, -4]')

    debugtrace.print('v', Int16Array.of(1, -2, 3, -4, 5))
    expect(debugtrace.lastLog).toContain('v = (Int16Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint16Array', () => {
    debugtrace.print('v', Uint16Array.of(1, 2, 3, 4))
    expect(debugtrace.lastLog).toContain('v = (Uint16Array)[1, 2, 3, 4]')

    debugtrace.print('v', Uint16Array.of(1, 2, 3, 4, 5))
    expect(debugtrace.lastLog).toContain('v = (Uint16Array length:5)[1, 2, 3, 4, 5]')
})

test('print Int32Array', () => {
    debugtrace.print('v', Int32Array.of(1, -2, 3, -4))
    expect(debugtrace.lastLog).toContain('v = (Int32Array)[1, -2, 3, -4]')

    debugtrace.print('v', Int32Array.of(1, -2, 3, -4, 5))
    expect(debugtrace.lastLog).toContain('v = (Int32Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint32Array', () => {
    debugtrace.print('v', Uint32Array.of(1, 2, 3, 4))
    expect(debugtrace.lastLog).toContain('v = (Uint32Array)[1, 2, 3, 4]')

    debugtrace.print('v', Uint32Array.of(1, 2, 3, 4, 5))
    expect(debugtrace.lastLog).toContain('v = (Uint32Array length:5)[1, 2, 3, 4, 5]')
})

test('print Float32Array', () => {
    debugtrace.print('v', Float32Array.of(1, -2, 3, -4))
    expect(debugtrace.lastLog).toContain('v = (Float32Array)[1, -2, 3, -4]')

    debugtrace.print('v', Float32Array.of(1, -2, 3, -4, 5))
    expect(debugtrace.lastLog).toContain('v = (Float32Array length:5)[1, -2, 3, -4, 5]')
})

test('print Float64Array', () => {
    debugtrace.print('v', Float64Array.of(1, -2, 3, -4))
    expect(debugtrace.lastLog).toContain('v = (Float64Array)[1, -2, 3, -4]')

    debugtrace.print('v', Float64Array.of(1, -2, 3, -4, 5))
    expect(debugtrace.lastLog).toContain('v = (Float64Array length:5)[1, -2, 3, -4, 5]')
})

test('print BigInt64Array', () => {
    debugtrace.print('v', BigInt64Array.of(1n, -2n, 33333333333n, -44444444444n))
    expect(debugtrace.lastLog).toContain('v = (BigInt64Array)[1, -2, 33333333333, -44444444444]')

    debugtrace.print('v', BigInt64Array.of(1n, -2n, 33333333333n, -44444444444n, 5n))
    expect(debugtrace.lastLog).toContain('v = (BigInt64Array length:5)[1, -2, 33333333333, -44444444444, 5]')
})

test('print BigUint64Array', () => {
    debugtrace.print('v', BigUint64Array.of(1n, 2n, 33333333333n, 44444444444n))
    expect(debugtrace.lastLog).toContain('v = (BigUint64Array)[1, 2, 33333333333, 44444444444]')

    debugtrace.print('v', BigUint64Array.of(1n, 2n, 33333333333n, 44444444444n, 5n))
    expect(debugtrace.lastLog).toContain('v = (BigUint64Array length:5)[1, 2, 33333333333, 44444444444, 5]')
})

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

test('print Object', () => {
    debugtrace.print('v', new Point(1, 2))
    expect(debugtrace.lastLog).toContain('v = (Point){x: 1, y: 2}')

    debugtrace.print('v', new Point('ABCD', 'ABCDE'))
    expect(debugtrace.lastLog).toContain("v = (Point){x: 'ABCD', y: (length:5)'ABCDE'}")

    debugtrace.print('v', [new Point(1, 2), new Point(3, 4)])
    expect(debugtrace.lastLog).toContain('v = [(Point){x: 1, y: 2}, (Point){x: 3, y: 4}]')
})

test('print Map', () => {
    let v = new Map()
    v.set(1, 'A');  v.set(2, 'B'); v.set(3, 'C'); v.set(4, 'D')
    debugtrace.print('v', v)
    expect(debugtrace.lastLog).toContain("v = (Map){1: 'A', 2: 'B', 3: 'C', 4: 'D'}")

    v = new Map()
    v.set('a', 'A');  v.set('b', 'B'); v.set('c', 'C'); v.set('d', 'D'); v.set('e', 'E')
    debugtrace.print('v', v)
    expect(debugtrace.lastLog).toContain("v = (Map size:5){'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}")
})

test('print Set', () => {
    debugtrace.print('v', new Set([1, 2, 3, 4]))
    expect(debugtrace.lastLog).toContain("v = (Set)[1, 2, 3, 4]")

    debugtrace.print('v', new Set(['A', 'B', 'C', 'D', 'EEEEE']))
    expect(debugtrace.lastLog).toContain("v = (Set size:5)['A', 'B', 'C', 'D', (length:5)'EEEEE']")
})
