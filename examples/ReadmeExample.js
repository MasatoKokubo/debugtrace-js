// ReadmeExample.js
//const debugtrace = require('debugtrace-js') // TODO: Debug
const debugtrace = require('../debugtrace.js') // TODO: Debug

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
