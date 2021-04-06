const validations = {
    validateString(string){
        if (typeof string !== `string`) throw new TypeError(`The field is empty or blank`)
        if (!string.trim().length) throw new Error(`The field is empty or blank`)
    },
    validateNumber(number){
        if (typeof number !== `number`) throw new TypeError(`${number} is not a Number`)
    },
    validateBoolean(boolean){
        if (typeof boolean !== `boolean`) throw new TypeError(`${boolean} is not a boolean`)
    },
    validateEmail(email) {
        if (typeof email !== "string") throw new TypeError(`Email is empty or blank`)
        if (!email.trim().length) throw new Error(`Email is empty or blank`)
        if (!/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(email)) throw new Error (`${email} is not valid`)
    },
    validatePassword(password){
        if (typeof password !== "string") throw new TypeError(`password is empty or blank`)
        if (!password.trim().length) throw new Error(`password is empty or blank`)
        if (password.length < 6) throw new Error(`Password must be at least 6 characters long`)
    },
    validateId(id){
        if (typeof id !== "string") throw new TypeError(`${id} is not an id`)
        if (id.length !== 24) throw new Error (`Incorrect id length`)
    }
}


module.exports = validations