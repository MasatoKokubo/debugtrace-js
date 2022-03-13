const debugtrace = require('../debugtrace')

beforeAll(() => debugtrace.maximumDataOutputWidth = 200)

test('printMessage', () => {
  let message = 'a message'
  expect(debugtrace.printMessage(message) === message)
  expect(debugtrace.lastLog).toContain(message)
})

test('print null, etc', () => {
  expect(debugtrace.print('v', null) === null)
  expect(debugtrace.lastLog).toContain('v = null')

  expect(debugtrace.print('v', undefined) === undefined)
  expect(debugtrace.lastLog).toContain('v = undefined')

  expect(debugtrace.print('v', Infinity) === Infinity)
  expect(debugtrace.lastLog).toContain('v = Infinity')

  expect(debugtrace.print('v', NaN) === NaN)
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
  expect(debugtrace.print('v', false) === false)
  expect(debugtrace.lastLog).toContain('v = false')

  expect(debugtrace.print('v', true) === true)
  expect(debugtrace.lastLog).toContain('v = true')
})

test('print Number', () => {
  expect(debugtrace.print('v', 1) === 1)
  expect(debugtrace.lastLog).toContain('v = 1')

  expect(debugtrace.print('v', -123456789) === -123456789)
  expect(debugtrace.lastLog).toContain('v = -123456789')

  expect(debugtrace.print('v', 13456789) === 123456789)
  expect(debugtrace.lastLog).toContain('v = 13456789')
})

test('print String', () => {
  let v = 'ABCD'
  expect(debugtrace.print('v', v) === v)
  expect(debugtrace.lastLog).toContain("v = 'ABCD'")

  v = 'ABCDE'
  expect(debugtrace.print('v', v) === v)
  expect(debugtrace.lastLog).toContain("v = (length:5)'ABCDE'")

  v = '\0\b\t\n\v\f\'\\'
  expect(debugtrace.print('v', v) === v)
  expect(debugtrace.lastLog).toContain("v = (length:8)'\\0\\b\\t\\n\\v\\f\\'\\\\'")

  v = '\x01\x02\x03\x04\x05\x06\x07\x0E\x0F'
  expect(debugtrace.print('v', v) === v)
  expect(debugtrace.lastLog).toContain("v = (length:9)'\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x0E\\x0F'")

  v = '\x10\x11\x12\x13\x14\x15\x16\x17'
  expect(debugtrace.print('v', v) === v)
  expect(debugtrace.lastLog).toContain("v = (length:8)'\\x10\\x11\\x12\\x13\\x14\\x15\\x16\\x17'")

  v = '\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F'
  expect(debugtrace.print('v', v) === v)
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

test('print RegExp', () => {
  debugtrace.print('v', /[a-z]+/)
  expect(debugtrace.lastLog).toContain('v = /[a-z]+/')
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
