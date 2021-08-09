// ReadmeExample.js
const debugtrace = require('../debugtrace') // ToDo: Remove after debugging

class Contact {
    constructor(id, firstName, lastName, birthday) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.birthday = birthday
    }
}

function func2() {
    debugtrace.enter() // ToDo: Remove after debugging
    let contacts = [
        new Contact(1, 'Akane' , 'Apple', new Date(Date.UTC(1991, 2, 3))),
        new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
    ]
    debugtrace.print('contacts', contacts) // ToDo: Remove after debugging
    debugtrace.leave() // ToDo: Remove after debugging
}

function func1() {
    debugtrace.enter() // ToDo: Remove after debugging
    debugtrace.printMessage('Hello, World!')
    func2()
    debugtrace.leave() // ToDo: Remove after debugging
}

func1()
