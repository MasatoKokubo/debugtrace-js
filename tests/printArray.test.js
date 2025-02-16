const debugtrace = require('../debugtrace')

beforeAll(() => debugtrace.maximumDataOutputWidth = 200)

test('print Array', () => {
  debugtrace.print('v', [1, 2, 3, 4])
  expect(debugtrace.lastLog).toContain('v = [1, 2, 3, 4]')

  debugtrace.print('v', [1, 2, 3, 4, 5], {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (length:5)[1, 2, 3, 4, 5]')

  debugtrace.print('v', [1, 2, [3, 4, [5, 6, [7, 8]]]])
  expect(debugtrace.lastLog).toContain('v = [1, 2, [3, 4, [5, 6, [7, 8]]]]')

  debugtrace.print('v', ['A', 'ABCD', 'ABCDE'])
  expect(debugtrace.lastLog).toContain("v = ['A', 'ABCD', 'ABCDE']")
})

test('print Int8Array', () => {
  debugtrace.print('v', Int8Array.of(1, -2, 3, -4))
  expect(debugtrace.lastLog).toContain('v = (Int8Array)[1, -2, 3, -4]')

  debugtrace.print('v', Int8Array.of(1, -2, 3, -4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Int8Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint8Array', () => {
  debugtrace.print('v', Uint8Array.of(1, 2, 3, 4))
  expect(debugtrace.lastLog).toContain('v = (Uint8Array)[1, 2, 3, 4]')

  debugtrace.print('v', Uint8Array.of(1, 2, 3, 4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Uint8Array length:5)[1, 2, 3, 4, 5]')
})

test('print Uint8ClampedArray', () => {
  debugtrace.print('v', Uint8ClampedArray.of(1, 2, 3, 4))
  expect(debugtrace.lastLog).toContain('v = (Uint8ClampedArray)[1, 2, 3, 4]')

  debugtrace.print('v', Uint8ClampedArray.of(1, 2, 3, 4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Uint8ClampedArray length:5)[1, 2, 3, 4, 5]')
})

test('print Int16Array', () => {
  debugtrace.print('v', Int16Array.of(1, -2, 3, -4))
  expect(debugtrace.lastLog).toContain('v = (Int16Array)[1, -2, 3, -4]')

  debugtrace.print('v', Int16Array.of(1, -2, 3, -4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Int16Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint16Array', () => {
  debugtrace.print('v', Uint16Array.of(1, 2, 3, 4))
  expect(debugtrace.lastLog).toContain('v = (Uint16Array)[1, 2, 3, 4]')

  debugtrace.print('v', Uint16Array.of(1, 2, 3, 4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Uint16Array length:5)[1, 2, 3, 4, 5]')
})

test('print Int32Array', () => {
  debugtrace.print('v', Int32Array.of(1, -2, 3, -4))
  expect(debugtrace.lastLog).toContain('v = (Int32Array)[1, -2, 3, -4]')

  debugtrace.print('v', Int32Array.of(1, -2, 3, -4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Int32Array length:5)[1, -2, 3, -4, 5]')
})

test('print Uint32Array', () => {
  debugtrace.print('v', Uint32Array.of(1, 2, 3, 4))
  expect(debugtrace.lastLog).toContain('v = (Uint32Array)[1, 2, 3, 4]')

  debugtrace.print('v', Uint32Array.of(1, 2, 3, 4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Uint32Array length:5)[1, 2, 3, 4, 5]')
})

test('print Float32Array', () => {
  debugtrace.print('v', Float32Array.of(1, -2, 3, -4))
  expect(debugtrace.lastLog).toContain('v = (Float32Array)[1, -2, 3, -4]')

  debugtrace.print('v', Float32Array.of(1, -2, 3, -4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Float32Array length:5)[1, -2, 3, -4, 5]')
})

test('print Float64Array', () => {
  debugtrace.print('v', Float64Array.of(1, -2, 3, -4))
  expect(debugtrace.lastLog).toContain('v = (Float64Array)[1, -2, 3, -4]')

  debugtrace.print('v', Float64Array.of(1, -2, 3, -4, 5), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (Float64Array length:5)[1, -2, 3, -4, 5]')
})

test('print BigInt64Array', () => {
  debugtrace.print('v', BigInt64Array.of(1n, -2n, 33333333333n, -44444444444n))
  expect(debugtrace.lastLog).toContain('v = (BigInt64Array)[1, -2, 33333333333, -44444444444]')

  debugtrace.print('v', BigInt64Array.of(1n, -2n, 33333333333n, -44444444444n, 5n), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (BigInt64Array length:5)[1, -2, 33333333333, -44444444444, 5]')
})

test('print BigUint64Array', () => {
  debugtrace.print('v', BigUint64Array.of(1n, 2n, 33333333333n, 44444444444n))
  expect(debugtrace.lastLog).toContain('v = (BigUint64Array)[1, 2, 33333333333, 44444444444]')

  debugtrace.print('v', BigUint64Array.of(1n, 2n, 33333333333n, 44444444444n, 5n), {arrayLength:true})
  expect(debugtrace.lastLog).toContain('v = (BigUint64Array length:5)[1, 2, 33333333333, 44444444444, 5]')
})
