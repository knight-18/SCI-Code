const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sicDataSchema = new Schema({
    Industry: {
        type: String,
    },
    "3 Digit SIC Code": {
        type: String,
    },
    "siccode-2digit": {
        type: String,
    },
    "siccodetext-2digit-industry": {
        type: String,
    },
    "siccode-3digit": {
        type: String,
    },
    "siccodetext-3digit-industry": {
        type: String,
    },
    "noofcompanies-3digit-industry": {
        type: String,
    },
    "empsize-3digit-industry": {
        type: String,
    },
    "siccode-4digit": {
        type: String,
    },
    "siccodetext-4digit-industry": {
        type: String,
    },
    "noofcompanies-4digit-industry": {
        type: String,
    },
    "empsize-4digit-industry": {
        type: String,
    },
    "siccode-5digit": {
        type: String,
    },
    "siccodetext-5digit-industry": {
        type: String,
    },
    "noofcompanies-5digit-industry": {
        type: String,
    },
    "empsize-5digit-industry": {
        type: String,
    },
    "siccode-6digit": {
        type: String,
    },
    "siccodetext-6digit-industry": {
        type: String,
    },
    "empsize-6digit-industry": {
        type: String,
    },
    "siccode-6digit":{
        type: String
    }
})

module.exports = SicData = mongoose.model('SicData',sicDataSchema);
