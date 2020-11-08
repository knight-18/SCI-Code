const jwt = require('jsonwebtoken')
const { encodeXText } = require('nodemailer/lib/shared')
require('dotenv').config()

const adminAuth = function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = decoded.admin

        if (
            admin !== `${process.env.adminUsername}${process.env.adminPassword}`
        ) {
            throw new Error('Invalid Credentials')
        }
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' + error })
    }
}

module.exports = adminAuth
