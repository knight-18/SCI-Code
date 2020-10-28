const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { signUpMail } = require('../config/nodemailer')
const crypto = require('crypto')
const Sicdata = require('../models/Sicdata')
const { apiGenerator, decryptToken } = require('../utils/apiGenerator')
const regexEmail = /^w+[+.w-]*@([w-]+.)*w+[w-]*.([a-z]{2,4}|d+)$/i
const {
    Digit2CodeQuery,
    Digit3CodeQuery,
    Digit4CodeQuery,
    comapaniesEmpRange,
    comapaniesEmpGreaterThan,
    numberOfCompany
} = require('../utils/query')
const path = require('path')

// Route to create a free trial account
router.get('/api/create', async (req, res) => {
    res.sendFile('create.html', {
        root: path.join(__dirname, '../../public'),
    })
})

router.get('/api/premium', async (req, res) => {
    res.sendFile('getPremium.html', {
        root: path.join(__dirname, '../../public'),
    })
})

router.post('/api/create', async (req, res) => {
    const { name, businessEmail, companyName, phone, purpose } = req.body
    const errors = []
    if (name.trim() === '') errors.push('Name cannot be empty')
    if (businessEmail.trim() === '')
        errors.push('Business email cannot be empty')
    if (regexEmail.test(businessEmail))
        errors.push('Email not in proper format')
    if (companyName.trim() === '') errors.push('Company Name cannot be empty')
    const findUser = await User.findOne({ businessEmail })
    if (findUser) errors.push('Email already registered')
    if (errors.length !== 0) {
        res.status(400).send(errors)
        return
    }
    const user = new User({
        name,
        businessEmail,
        companyName,
        phone,
        purpose,
        isTrial: true,
    })
    try {
        const token = apiGenerator(businessEmail)
        // console.log('Token:', token)
        user.trial.token = token
        user.trial.expiry = Date.now() + 90 * 24 * 60 * 60 * 1000
        user.trial.credits = 10
        const savedUser = await user.save()
        if (savedUser) {
            // console.log('User:', savedUser)
            signUpMail(
                savedUser,
                'Trial API Key',
                `Your API Key is <strong>${token} </strong> <br> You are rewarded ${savedUser.trial.credits} free credits`
            )
            res.status(200).send({
                success:
                    'Successfully registered. Your api key has been sent to you registered email address',
            })
        } else {
            res.status(400).send({
                error: 'Cannot create the trial account. Please try again',
            })
        }
    } catch {
        ;(err) => {
            console.error(err)
            res.status(400).send({
                error: 'Cannot create the trial account. Please try again',
            })
        }
    }
})

// Route to create a premium account

router.post('/api/premium', async (req, res) => {
    const {
        name,
        businessEmail,
        companyName,
        phone,
        selectedCredits,
    } = req.body
    const errors = []
    if (name.trim() === '') errors.push('Name cannot be empty')
    if (businessEmail.trim() === '')
        errors.push('Business email cannot be empty')
    if (regexEmail.test(businessEmail))
        errors.push('Email not in proper format')
    if (companyName.trim() === '') errors.push('Company Name cannot be empty')
    if (errors.length !== 0) {
        res.status(400).send(errors)
        return
    }
    try {
        const premiumToken = apiGenerator(businessEmail)
        const premiumExpiry = Date.now() + 365 * 24 * 60 * 60 * 1000
        const premiumObject = new Object({
            token: premiumToken,
            expiry: premiumExpiry,
            credits: selectedCredits,
        })

        const alreadyExistingUser = await User.findOne({ businessEmail })
        if (alreadyExistingUser) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: alreadyExistingUser._id },
                {
                    premium: [...alreadyExistingUser.premium, premiumObject],
                }
            )
            signUpMail(
                updatedUser,
                'Subscribed API Key',
                `Your API Key is <strong>${premiumToken} </strong> <br> You have subscribed ${selectedCredits} credits`
            )
        } else {
            const user = new User({
                name,
                businessEmail,
                companyName,
                phone,
                selectedCredits,
                premium: [premiumObject],
            })
            const savedUser = await user.save()
            if (!savedUser) {
                res.status(400).send({
                    error: 'Cannot create the subscription. Please try again',
                })
                return
            }
            signUpMail(
                savedUser,
                'Subscribed API Key',
                `Your API Key is <strong>${premiumToken} </strong>. <br> You have subscribed ${selectedCredits} credits`
            )
        }
        res.status(200).send({
            success:
                'Successfully registered. Your api key has been sent to you registered email address',
        })
    } catch (error) {
        console.error(error)
        res.status(200).send({
            error: 'The subscription failed. Please try again',
        })
    }
})

router.get('/api', async (req, res) => {
    try {
        const currTimestamp = Date.now()
        let code
        if (req.query.siccode2digit) 
        {
            if(req.query.siccode2digit.length != 2)
                return res.status(200).send({error:"Invalid Query"});
            code = req.query.siccode2digit
        }
        if (req.query.siccode3digit) {
            if(req.query.siccode3digit.length != 3)
                return res.status(200).send({error:"Invalid Query"});
            code = req.query.siccode3digit
        }
        if (req.query.siccode4digit){
            if(req.query.siccode4digit.length != 4)
                return res.status(200).send({error:"Invalid Query"});
            code = req.query.siccode4digit
        }
        let companiesEmpValue = req.query.companiesEmp;
        let companyValue = req.query.numberOfCompanies;
        const token = req.query.key
        const decodedEmail = decryptToken(token)
        const user = await User.findOne({
            businessEmail: decodedEmail,
        })
        if (!user) {
            console.log('User not find')
            res.status(400).send('User not found')
            return
        }
        if (user.trial.token === token) {
            if (
                user.trial.credits === 0 &&
                !user.alreadyAccessedCodes.includes(code)
            ) {
                res.status(200).send('No Trial Credits left')
                return
            }
            const isTokenExpired = currTimestamp > user.trial.expiry
            if (isTokenExpired) {
                console.log('Token expired')
                res.status(200).send('Trial token expired.')
                return
            }
            //ADd code to delete trial object
            let data = undefined
            if(companyValue !== null){
                data = await numberOfCompany("trialToken",companyValue);
                if(!data)
                    throw new Error("Unable to fetch data");
            }else if(companiesEmpValue !== null ){
                data = await comapaniesEmpGreaterThan('trialToken',companiesEmpValue);
                if(!data)
                    throw new Error("Unable to fetch data");
            }
            else if (code.length === 2) {
                data = await Digit2CodeQuery(code, 'trialToken')
                if (!data) {
                    throw new Error('Unable to fetch Data')
                }
            } else if (code.length === 3) {
                data = await Digit3CodeQuery(code, 'trialToken')
                if (!data) {
                    throw new Error('Unable to fetch Data')
                }
            } else if (code.length === 4) {
                data = await Digit4CodeQuery(code, 'trialToken')
                if (!data) {
                    throw new Error('Unable to fetch Data')
                }
            }
            else{
                return res.status(404).send({error: "An error occured"});
            }
            if (!user.alreadyAccessedCodes.includes(code)) {
                user.trial.credits -= 1
                if(code !== null)
                    user.alreadyAccessedCodes.push(code)
                await user.save()
            }
            return res.status(200).send({ 'Recieved Data': data })
        }
        //If token is not trial token then checking premium tokens
        let foundToken = null

        for (let i = 0; i < user.premium.length; i++) {
            if (user.premium[i].token === token) {
                foundToken = user.premium[i]
                break
            }
        }
        // console.log('found token', foundToken)
        // console.log('User.premium:', user.premium)
        // console.log('Token', token)
        // console.log('LOG:', token === user.premium[1].token)
        if (!foundToken) {
            console.log('Premium token did not match')
            res.status(200).send('No such token exists')
            return
        }
        if (
            foundToken.credits === 0 &&
            !user.alreadyAccessedCodes.includes(code)
        ) {
            res.status(200).send('No Credits left')
            return
        }
        const isPremiumTokenExpired = currTimestamp > foundToken.expiry
        if (isPremiumTokenExpired) {
            console.log('Token expired')
            res.status(200).send('Premium token expired.')
            return
        }
        let data = undefined
        if(companyValue){
            data = await numberOfCompany("premiumToken",companyValue);
            if(!data)
                throw new Error("Unable to fetch data");
        }else if(companiesEmpValue){
            data = await comapaniesEmpGreaterThan('premiumToken',companiesEmpValue);
            if(!data)
                throw new Error("Unable to fetch data");
        }
        else if (code.length === 2) {
            data = await Digit2CodeQuery(code, 'premiumToken')
            if (!data) {
                throw new Error('Unable to fetch Data')
            }
        } else if (code.length === 3) {
            data = await Digit3CodeQuery(code, 'premiumToken')
            if (!data) {
                throw new Error('Unable to fetch Data')
            }
        } else if (code.length === 4) {
            data = await Digit4CodeQuery(code, 'premiumToken')
            if (!data) {
                throw new Error('Unable to fetch Data')
            }
        }
        else{
            return res.status(404).send({error:"An error occured"});
        }
        if (!user.alreadyAccessedCodes.includes(code)) {
            foundToken.credits -= 1
            if(code !== null)
                user.alreadyAccessedCodes.push(code)
            await user.save()
        }
        res.status(200).send({ 'Data Recieved: ': data })
    } catch (error) {
        console.log('Error: ', error)
        res.status(400).send(error)
    }
})

module.exports = router

//sBaamweJenr4sOhHrcihvBaRsEtBapvWa24w6U-gumgasinld.LcZo6m1-1603883911838
