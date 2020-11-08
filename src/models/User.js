const mongoose = require('mongoose')
const crypto = require('crypto')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        businessEmail: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
        },
        purpose: {
            type: String,
        },
        phone: {
            type: String,
        },
        isTrial: {
            type: Boolean,
        },
        trial: {
            token: String,
            expiry: Date,
            credits: {
                type: Number,
                default: 0,
            },
        },
        premium:{
                token: String,
                expiry: Date,
                credits: {
                    type: Number,
                },
            },
        isPremium :{
            type : Boolean
        },
        alreadyAccessedCodes: {
            type: Array,
        },
        alreadyAccessedKeyWords:{
            type: Array
        }
    },
    {
        timestamps: true,
    }
)

module.exports = User = mongoose.model('User', userSchema)
