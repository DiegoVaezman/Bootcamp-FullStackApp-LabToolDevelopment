const validations = {
    validateString(string){
        if (!string.trim().length) throw new Error(`The field is empty or blank`)
    },
    validateNumber(number){
        if (number !== Number) throw new TypeError(`${number} is not a Number`)
    },
    validateEmail(email) {
        if (typeof email !== "string") throw new TypeError(`${email} in not an email`)
        if (!email.trim().length) throw new Error(`Email is empty or blank`)
        // if (!/^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.test(email)) throw new Error (`${email} is not valid`)
    },
    validatePassword(password){
        if (!password.trim().length) throw new Error(`password is empty or blank`)
        if (typeof password !== "string") throw new TypeError(`${password} is not a password`)
        if (password.legth < 6) throw new Error(`Password must be at least 6 characters long`)
    },
    validateId(id){
        if (typeof id !== "string") throw new TypeError(`${id} is not an id`)
        if (id.length !== 24) throw new Error (`Incorrect id length`)
    }
}


module.exports = validations