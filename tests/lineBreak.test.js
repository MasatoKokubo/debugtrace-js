const debugtrace = require('../debugtrace')

beforeAll(() => {
  debugtrace.maximumDataOutputWidth = 60
})

beforeEach(() => debugtrace.enter())

afterEach(() => debugtrace.leave())

class Contact {
  constructor(firstName, lastName, birthday, phoneNumber) {
    this.firstName = firstName
    this.lastName = lastName
    this.birthday = birthday
    this.phoneNumber = phoneNumber
  }
}

class Contacts {
  constructor(contact1, contact2, contact3, contact4) {
    this.contact1 = contact1
    this.contact2 = contact2
    this.contact3 = contact3
    this.contact4 = contact4
  }
}

test('line break of array', () => {
  // setup:
  const contacts = [
    new Contact('Akane' , 'Apple' , new Date(2020, 1, 1), '080-1111-1111'),
    new Contact('Yukari', 'Apple' , new Date(2020, 2, 2), '080-2222-2222'),
    null,
    null
  ]

  // when:
  debugtrace.print('contacts', contacts)

  // then:
  expect(debugtrace.lastLog).toContain('[\n|   (Contact){')
  expect(debugtrace.lastLog).toContain('  firstName:')
  expect(debugtrace.lastLog).toContain(', lastName:')
  expect(debugtrace.lastLog).toContain('  birthday:')
  expect(debugtrace.lastLog).toContain('  phoneNumber:')
  expect(debugtrace.lastLog).toContain('},\n|   (Contact){')
  expect(debugtrace.lastLog).toContain('},\n|   null, null')
})

test('line break of Object', () => {
  // setup:
  const contacts = new Contacts(
    new Contact('Akane' , 'Apple' , new Date(2020, 1, 1), '080-1111-1111'),
    new Contact('Yukari', 'Apple' , new Date(2020, 2, 2), '080-2222-2222'),
    null,
    null
  )

  // when:
  debugtrace.print('contacts', contacts)

  // then:
  expect(debugtrace.lastLog).toContain('{\n|   contact1: (Contact){')
  expect(debugtrace.lastLog).toContain('  firstName:')
  expect(debugtrace.lastLog).toContain(', lastName:')
  expect(debugtrace.lastLog).toContain('  birthday:')
  expect(debugtrace.lastLog).toContain('  phoneNumber:')
  expect(debugtrace.lastLog).toContain('},\n|   contact2: (Contact){')
  expect(debugtrace.lastLog).toContain('},\n|   contact3: null, contact4: null')
})

test('line break of Map', () => {
  // setup:
  const contacts = new Map()
  contacts.set(1, new Contact('Akane' , 'Apple' , new Date(2020, 1, 1), '080-1111-1111'))
  contacts.set(2, new Contact('Yukari', 'Apple' , new Date(2020, 2, 2), '080-2222-2222'))
  contacts.set(3, null)
  contacts.set(4, null)

  // when:
  debugtrace.print('contacts', contacts)

  // then:
  expect(debugtrace.lastLog).toContain('{\n|   1: (Contact){')
  expect(debugtrace.lastLog).toContain('  firstName:')
  expect(debugtrace.lastLog).toContain(', lastName:')
  expect(debugtrace.lastLog).toContain('  birthday:')
  expect(debugtrace.lastLog).toContain('  phoneNumber:')
  expect(debugtrace.lastLog).toContain('},\n|   2: (Contact){')
  expect(debugtrace.lastLog).toContain('},\n|   3: null, 4: null')
})

/** @since 2.1.0 */
test('no line break: name = value', () => {
  // setup
  const foo = '000000000011111111112222222222333333333344444444445555555555'

  // when:
  debugtrace.print('foo', foo)

  // then:
  expect(debugtrace.lastLog).toContain('foo = (length:60)\'0000000000')
})

/** @since 2.1.0 */
test('no line break: Object: key: value', () => {
  // setup
  const foo = new Object()
  foo.bar = '000000000011111111112222222222333333333344444444445555555555'

  // when:
  debugtrace.print('foo', foo)

  // then:
  expect(debugtrace.lastLog).toContain('bar: (length:60)\'0000000000')
})

/** @since 2.1.0 */
test('no line break: Map: key: value', () => {
  // setup
  const foo = new Map()
  foo.set(1, '000000000011111111112222222222333333333344444444445555555555')

  // when:
  debugtrace.print('foo', foo)

  // then:
  expect(debugtrace.lastLog).toContain('1: (length:60)\'0000000000')
})
