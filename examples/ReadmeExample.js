// ReadmeExample.js
const debugtrace = require('debugtrace') // for Debugging

class Contact {
    constructor(id, firstName, lastName, birthday) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.birthday = birthday
    }
}

function func2() {
    debugtrace.enter() // for Debugging
    let contacts = [
        new Contact(1, "Akane" , "Apple", new Date(Date.UTC(1991, 2, 3))),
        new Contact(2, "Yukari", "Apple", new Date(Date.UTC(1992, 3, 4)))
    ]
    debugtrace.print("contacts", contacts) // for Debugging
    debugtrace.leave() // for Debugging
}

function func1() {
    debugtrace.enter() // for Debugging
    func2()
    debugtrace.leave() // for Debugging
}

func1()
