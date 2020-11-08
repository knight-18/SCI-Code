const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { getTrialData, getPremiumUserData } = require('../utils/filterData')
const { apiGenerator, decryptToken } = require('../utils/apiGenerator')
const { signUpMail } = require('../config/nodemailer')
const adminAuth = require('../middlewares/adminAuth')

router.get('/login', (req, res) => {
    res.sendFile('adminLogin.html', {
        root: path.join(__dirname, '../../public'),
    })
})

router.get('/test', adminAuth, async (req, res) => {
    try {
        console.log('Hello There We FUcked it birooo!!!!')
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        if (
            username !== process.env.adminUsername ||
            password !== process.env.adminPassword
        ) {
            console.log('Invalid Credentials')
            return res.status(401).send('Invalid Credentials')
        }

        const token = jwt.sign(
            { admin: `${username}${password}` },
            process.env.JWT_SECRET
        )
        res.status(200).send({
            token
        })
    } catch (error) {
        console.log(error)
        res.send(500).send(error)
    }
})

router.get('/', adminAuth,async (req, res) => {
    try {
        console.log("Route Accessed");
        let userType = req.query.type
        console.log("UserType:", userType);
        if (userType === 'trial') {
            console.log("Accesed trial");
            const users = await User.find({ isTrial: true })
            if (users.length == 0)
                return res.status(200).send({
                    error: 'No User Exists',
                })
            const existingUsers = await getTrialData(users)
            return res.status(200).send(existingUsers);
        }
        if (userType === 'active') {
            const users = await User.find({ isPremium: true })
            if (users.length == 0)
                return res.status(200).send({
                    error: 'No User Exists',
                })
            const foundUsers = []
            users.forEach(async (user) => {
                if (user.premium.expiry >= Date.now()) {
                    foundUsers.push(user)
                }
            })
            if(foundUsers.length == 0){
                return res.status(200).send("No such User found");
            }
            const existingUsers = await getPremiumUserData(foundUsers)
            return res.status(200).send(existingUsers);
        }
        if (userType === 'inactive') {
            const users = await User.find({})
            if (users.length == 0)
                return res.status(200).send({
                    error: 'No User Exists',
                })
            const foundUsers = []
            users.forEach(async (user) => {
                if (user.premium.expiry < Date.now()) foundUsers.push(user)
            })
            if(foundUsers.length == 0){
                return res.status(200).send("No such User found");
            }
            const existingUsers = await getPremiumUserData(foundUsers)
            return res.status(200).send(existingUsers);
        }
        const users  = await User.find();
        return users;
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            error: 'Something went wrong',
        })
    }
})

router.post('/trialcredit', adminAuth,async (req, res) => {
    try {
        const email = req.body.email
        const credits = req.body.credits
        const expireDays = req.body.expireDays
            ? parseInt(req.body.expireDays)
            : 30
        const user = await User.findOne({ businessEmail: email })
        if (!user) {
            return res.status(200).send('User not found')
        }
        if (!user.trial || (user.trial && user.trial.expiry.getTime() < Date.now())) { //Trial token is expired
            let key = apiGenerator(user.businessEmail)
            user.trial.token = key
            user.trial.expiry = Date.now() + expireDays * 24 * 60 * 60 * 1000
            user.isTrial = true
            user.trial.credits = credits
            await user.save()
            signUpMail(
                user,
                'Account Updated',
                `Your account has been created. Available credits = ${user.trial.credits}.<br>Your new API key is: ${key}`
            )
            return res.status(201).send({
                success:
                    'Credits Updated and new API key has been sent to the registered email address',
                presentCredits: user.trial.credits,
                expiry: user.trial.expiry,
            })
        }
        if (user.trial && user.trial.expiry.getTime() >= Date.now()) { //Trial token isn't expired
            user.trial.credits += credits
            await user.save()
            signUpMail(
                user,
                'Account Updated',
                `Your account has been created. Available credits = ${user.trial.credits}.`
            )
            return res.status(201).send({
                success: 'Credits Updated',
                presentCredits: user.trial.credits,
                expiry: user.trial.expiry,
            })
        }
        // if (user.trial && user.trial.expiry < Date.now()) {
        //     let key = apiGenerator(user.email)
        //     user.trial.token = key
        //     user.trial.expiry = Date.now() + expireDays * 24 * 60 * 60 * 1000
        //     user.trial.credits = credits
        //     user.isTrial = true;
        //     await user.save()
        //     return res.status(201).status({
        //         success:
        //             'Credits Updated and new API key has been sent to the registered email address',
        //         presentCredits: user.trial.credits,
        //         expiry: user.trial.expiry,
        //     })
        // }
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'Something went wrong' })
    }
})
// s$a0mye$e2rxsihDrminv3ansCtsadvMa34e68-gmmBajiVlL.KcYoMm4-1604857830211
router.post('/premiumcredit', adminAuth,async (req, res) => {
    try {
        const businessEmail = req.body.email
        const credits = req.body.credits
        const expireDays = req.body.expireDays
            ? parseInt(req.body.expireDays)
            : 365
        const user = await User.findOne({ businessEmail })
        if (!user) {
            return res.status(200).send('User not found')
        }
        if (
            !user.premium.expiry ||
            (user.premium.expiry && user.premium.expiry.getTime() < Date.now())
        ) {
            let key = apiGenerator(user.businessEmail)
            user.premium.token = key
            user.premium.expiry = Date.now() + expireDays * 24 * 60 * 60 * 1000
            user.premium.credits = credits
            user.isPremium = true
            await user.save()
            signUpMail(
                user,
                'Account Updated',
                `Your account has been updated. Available credits = ${user.premium.credits}. <br>
                API Key = ${key}`
            )
            return res.status(201).send({
                success:
                    'Credits Updated and new API key has been sent to the registered email address',
                presentCredits: user.premium.credits,
                expiry: user.premium.expiry,
            })
        }
        if (user.premium.expiry && user.premium.expiry.getTime() >= Date.now()) {
            user.premium.credits += credits
            await user.save()
            signUpMail(
                user,
                'Account Updated',
                `Your account has been updated. Available credits = ${user.premium.credits}`
            )
            return res.status(201).send({
                success: 'Credits Updated',
                presentCredits: user.premium.credits,
                expiry: user.premium.expiry,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'Something went wrong' })
    }
})

module.exports = router
