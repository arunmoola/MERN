const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

// static sign-up method
userSchema.statics.signup = async function(email, password) {
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    // Hash the password, before storing the user record
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Store user in DB
    const user = await this.create({email, password: hash})

    return user
}

// static login method
userSchema.statics.login = async function(email, password) {
    
    // check email and password are not empty
    if (!email || !password ) {
        throw Error('All fields must be filled')
    }

    // find the user matcing the email
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Invalid Email or Password')
    }

    // check if the password matches with the user's password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Invalid Email or Password')
    }

    return user
}

module.exports = mongoose.model('user', userSchema)