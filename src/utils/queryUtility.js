const Sicdata = require('../models/Sicdata')

module.exports = queryUtility = async (code) => {
    try {
        if (code.length === 2) {
            const industries2Digit = await Sicdata.find({
                'siccode-2digit': code,
            })
            if (industries2Digit.length === 0) {
                console.log('NO such token exists')
                throw new Error('No such token exists')
            }
            const unique3DigitCodes = []
            const checkCode3Digit = (industry) => {
                if (unique3DigitCodes.includes(industry['siccode-3digit'])) {
                    return false
                }
                unique3DigitCodes.push(industry['siccode-3digit'])
                return true
            }
            const unique3DigitCodeIndustry = industries2Digit.filter(
                checkCode3Digit
            )
            let noOfCompanies3DigitIndustry = 0
            let empSize3DigitIndustry = 0
            unique3DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-3digit-industry'] !== undefined)
                    noOfCompanies3DigitIndustry += parseInt(
                        industry['noofcompanies-3digit-industry']
                    )
                if (industry['empsize-3digit-industry'] !== undefined) {
                    empSize3DigitIndustry += parseInt(
                        industry['empsize-3digit-industry']
                    )
                }
            })
            const unique4DigitCodes = []
            const checkCode4Digit = (industry) => {
                if (unique4DigitCodes.includes(industry['siccode-4digit'])) {
                    return false
                }
                unique4DigitCodes.push(industry['siccode-4digit'])
                return true
            }
            const unique4DigitCodeIndustry = industries2Digit.filter(
                checkCode4Digit
            )

            return {
                industries2Digit,
                noOfCompanies3DigitIndustry,
                unique3DigitCodeIndustry,
                unique3DigitCodes,
                unique4DigitCodes,
                empSize3DigitIndustry,
            }
        } else if (code.length === 3) {
            const industries3Digit = await Sicdata.find({
                'siccode-3digit': code,
            })
            if (industries3Digit.length === 0) {
                console.log('NO such token exists')
                throw new Error('No such token exists')
            }
            const unique3DigitCodes = []
            const checkCode3Digit = (industry) => {
                if (unique3DigitCodes.includes(industry['siccode-3digit'])) {
                    return false
                }
                unique3DigitCodes.push(industry['siccode-3digit'])
                return true
            }
            const unique3DigitCodeIndustry = industries3Digit.filter(
                checkCode3Digit
            )
            const unique4DigitCodes = []
            const checkCode4Digit = (industry) => {
                if (unique4DigitCodes.includes(industry['siccode-4digit'])) {
                    return false
                }
                unique4DigitCodes.push(industry['siccode-4digit'])
                return true
            }
            const unique4DigitCodeIndustry = industries3Digit.filter(
                checkCode4Digit
            )
            let noOfCompanies3DigitIndustry = 0
            let empSize3DigitIndustry = 0
            unique3DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-3digit-industry'] !== undefined)
                    noOfCompanies3DigitIndustry += parseInt(
                        industry['noofcompanies-3digit-industry']
                    )
                if (industry['empsize-3digit-industry'] !== undefined) {
                    empSize3DigitIndustry += parseInt(
                        industry['empsize-3digit-industry']
                    )
                }
            })
            let noOfCompanies4DigitIndustry = 0
            unique4DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-4digit-industry'] !== undefined)
                    noOfCompanies4DigitIndustry += parseInt(
                        industry['noofcompanies-4digit-industry']
                    )
            })
            return {
                industries3Digit,
                unique3DigitCodes,
                unique4DigitCodes,
                noOfCompanies3DigitIndustry,
                noOfCompanies4DigitIndustry,
                unique3DigitCodeIndustry,
                unique4DigitCodeIndustry,
                empSize3DigitIndustry
            }
        } else if (code.length === 4) {
            const industries4Digit = await Sicdata.find({
                'siccode-4digit': code,
            })
            if (industries4Digit.length === 0) {
                console.log('NO such token exists')
                throw new Error('No such token exists')
            }
            const unique4DigitCodes = []
            const checkCode4Digit = (industry) => {
                if (unique4DigitCodes.includes(industry['siccode-4digit'])) {
                    return false
                }
                unique4DigitCodes.push(industry['siccode-4digit'])
                return true
            }
            const unique4DigitCodeIndustry = industries4Digit.filter(
                checkCode4Digit
            )
            const unique5DigitCodes = []
            let noOfCompanies4DigitIndustry = 0
            unique4DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-4digit-industry'] !== undefined)
                    noOfCompanies4DigitIndustry += parseInt(
                        industry['noofcompanies-4digit-industry']
                    )
            })
            let noOfEmployeesOf4DigitIndustry = 0
            unique4DigitCodeIndustry.forEach((industry) => {
                if (industry['empsize-4digit-industry'] != undefined)
                    noOfEmployeesOf4DigitIndustry += parseInt(
                        industry['empsize-4digit-industry']
                    )
            })
            return {
                industries4Digit,
                unique4DigitCodes,
                noOfCompanies4DigitIndustry,
                unique4DigitCodeIndustry,
                noOfEmployeesOf4DigitIndustry
            }
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({'error':'Something went wrong. Try again'})
    }
}
