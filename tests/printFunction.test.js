const debugtrace = require('../debugtrace')

beforeAll(() => debugtrace.maximumDataOutputWidth = 200)

const add = function (a, b) {return a + b}
const sub = (a, b) => a - b
const mul = function (a, b) {
  return a * b
}
const div = (a, b) => {
  return a / b
}

test('print Function 1-line', () => {
  debugtrace.print('add', add)
  expect(debugtrace.lastLog).toContain('add = function (a, b) {...')
})


test('print () => multi-lines', () => {
  debugtrace.print('sub', sub)
  expect(debugtrace.lastLog).toContain('sub = (a, b) => a - b')
})

test('print Function 1-line', () => {
  debugtrace.print('mul', mul)
  expect(debugtrace.lastLog).toContain('mul = function (a, b) {...')
})

test('print () => multi-lines', () => {
  debugtrace.print('div', div)
  expect(debugtrace.lastLog).toContain('div = (a, b) => {...')
})
