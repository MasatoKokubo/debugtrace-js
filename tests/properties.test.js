const debugtrace = require('../debugtrace')
debugtrace.formatEnter                = (name, fileName, lineNumber) => `_Enter_ ${name} (${fileName}:${lineNumber})`
debugtrace.formatLeave                = (name, fileName, lineNumber, duration) => `_Leave_ ${name} (${fileName}:${lineNumber}) duration: ${duration}`
debugtrace.indentString               = '||'
debugtrace.dataIndentString           = '``'
debugtrace.limitString                = '<Limit>'
debugtrace.nonOutputString            = '<NonOutput>' // Done not use
debugtrace.cyclicReferenceString      = '<CyclicReference>'
debugtrace.varNameValueSeparator      = ' <= '
debugtrace.keyValueSeparator          = ':: '
debugtrace.formatPrintSuffix          = (name, fileName, lineNumber) => ` (${fileName}::${lineNumber})`
debugtrace.formatLength               = length => `_length_:${length}`
debugtrace.formatSize                 = size => `_size_:${size}`
debugtrace.minimumOutputLengthAndSize = 4
debugtrace.minimumOutputStringLength  = 6
debugtrace.collectionLimit            = 5
debugtrace.stringLimit                = 10
debugtrace.reflectionNestLimit        = 2

beforeEach(() => debugtrace.enter())
afterEach(() => debugtrace.leave())

test('formatEnter, formatLeave, indentString, varNameValueSeparator, formatPrintSuffix', () => {
  debugtrace.enter()
  expect(debugtrace.lastLog).toContain('||_Enter_')

  debugtrace.printMessage('a message')
  expect(debugtrace.lastLog).toContain('||||a message (properties.test.js::')

  debugtrace.print('v', 1)
  expect(debugtrace.lastLog).toContain('||||v <= 1 (properties.test.js::')

  debugtrace.leave()
  expect(debugtrace.lastLog).toContain('||_Leave_')
})

test('varNameValueSeparator, dataIndentString, formatLength', () => {
  debugtrace.print('v', ['AAAAAAAAAA', 'BBBBBBBBBB', 'CCCCCCCCCC'])
  expect(debugtrace.lastLog).toContain("v <= [")
  expect(debugtrace.lastLog).toContain("``(_length_:10)'CCCCCCCCCC'")
})

test('Array collectionLimit, limitString', () => {
  debugtrace.print('v', [1, 2, 3, 4, 5])
  expect(debugtrace.lastLog).toContain("[1, 2, 3, 4, 5]")

  debugtrace.print('v', [1, 2, 3, 4, 5, 6])
  expect(debugtrace.lastLog).toContain("[1, 2, 3, 4, 5, <Limit>]")
})

test('Map collectionLimit, limitString, formatSize, keyValueSeparator', () => {
  const v = new Map()
  v.set(1, 'A'); v.set(2, 'B'); v.set(3, 'C'); v.set(4, 'D'); v.set(5, 'E')
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Map _size_:5){1:: 'A', 2:: 'B', 3:: 'C', 4:: 'D', 5:: 'E'}")

  v.set(6, 'F')
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Map _size_:6){1:: 'A', 2:: 'B', 3:: 'C', 4:: 'D', 5:: 'E', <Limit>}")
})

test('Set collectionLimit, limitString, formatSize', () => {
  debugtrace.print('v', new Set([1, 2, 3, 4, 5]))
  expect(debugtrace.lastLog).toContain("(Set _size_:5)[1, 2, 3, 4, 5]")

  debugtrace.print('v', new Set([1, 2, 3, 4, 5, 6]))
  expect(debugtrace.lastLog).toContain("(Set _size_:6)[1, 2, 3, 4, 5, <Limit>]")
})

test('stringLimit, limitString', () => {
  debugtrace.print('v', 'ABCDEFGHIJ')
  expect(debugtrace.lastLog).toContain("(_length_:10)'ABCDEFGHIJ'")

  debugtrace.print('v',  'ABCDEFGHIJK')
  expect(debugtrace.lastLog).toContain("(_length_:11)'ABCDEFGHIJ<Limit>'")
})

class Node {
  constructor() {
    this.next = undefined
  }
}

test('Object cyclicReferenceString, keyValueSeparator', () => {
  const v = new Node()
  v.next = v
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Node){next:: <CyclicReference>}")
})

test('Array cyclicReferenceString', () => {
  const v = [1]
  v.push(v)
  v.push(3)
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("[1, <CyclicReference>, 3]")
})

test('Map cyclicReferenceString', () => {
  const v = new Map()
  v.set(1, 'A')
  v.set(2, v)
  v.set(3, 'C')
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Map){1:: 'A', 2:: <CyclicReference>, 3:: 'C'}")
})

test('Set cyclicReferenceString', () => {
  const v = new Set()
  v.add(1)
  v.add(v)
  v.add(3)
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Set)[1, <CyclicReference>, 3]")
})

test('Array minimumOutputLengthAndSize', () => {
  debugtrace.print('v', [1, 2, 3])
  expect(debugtrace.lastLog).toContain("v <= [1, 2, 3]")

  debugtrace.print('v', [1, 2, 3, 4])
  expect(debugtrace.lastLog).toContain("v <= (_length_:4)[1, 2, 3, 4]")
})

test('Map minimumOutputLengthAndSize', () => {
  const v = new Map()
  v.set(1, 'A')
  v.set(2, 'B')
  v.set(3, 'C')
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("v <= (Map){1:: 'A', 2:: 'B', 3:: 'C'}")

  v.set(4, 'D')
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("v <= (Map _size_:4){1:: 'A', 2:: 'B', 3:: 'C', 4:: 'D'}")
})

test('Set minimumOutputLengthAndSize', () => {
  const v = new Set([1, 2, 3])
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("v <= (Set)[1, 2, 3]")

  v.add(4)
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("v <= (Set _size_:4)[1, 2, 3, 4]")
})

test('minimumOutputStringLength', () => {
  debugtrace.print('v', 'ABCDE')
  expect(debugtrace.lastLog).toContain("v <= 'ABCDE'")

  debugtrace.print('v', 'ABCDEF')
  expect(debugtrace.lastLog).toContain("v <= (_length_:6)'ABCDEF'")
})

test('reflectionNestLimit', () => {
  const v = new Node()
  v.next = new Node()
  v.next.next = new Node()
  v.next.next.next = new Node()
  debugtrace.print('v', v)
  expect(debugtrace.lastLog).toContain("(Node){next:: (Node){next:: <Limit>}}")
})
