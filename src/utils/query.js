const Sicdata = require('../models/Sicdata')
const queryUtility = require('./queryUtility')
const Digit2CodeQuery = async (code, tokenType) => {
    try {
        const {
            industries2Digit,
            noOfCompanies3DigitIndustry,
            unique3DigitCodeIndustry,
        } = await queryUtility(code)
        if (tokenType === 'trialToken') {
            return {
                Industry: industries2Digit[0].Industry,
                'siccode-2digit': code,
                'siccodetext-2digit-industry':
                    industries2Digit[0]['siccodetext-2digit-industry'],
                'total-company-size': noOfCompanies3DigitIndustry,
            }
        }
        const digit3Companies = []
        unique3DigitCodeIndustry.forEach((industry) => {
            digit3Companies.push({
                'siccode-3digit': industry['siccode-3digit'],
                'siccodetext-3digit-industry':
                    industry['siccodetext-3digit-industry'],
            })
        })
        return {
            Industry: industries2Digit[0].Industry,
            'siccode-2digit': code,
            'siccodetext-2digit-industry':
                industries2Digit[0]['siccodetext-2digit-industry'],
            'total-company-size': noOfCompanies3DigitIndustry,
            digit3Companies,
        }
    } catch (error) {
        console.log(error)
    }
}

const Digit3CodeQuery = async (code, tokenType) => {
    try {
        const {
            industries3Digit,
            unique3DigitCodes,
            unique4DigitCodes,
            noOfCompanies3DigitIndustry,
            noOfCompanies4DigitIndustry,
            unique3DigitCodeIndustry,
            unique4DigitCodeIndustry,
        } = await queryUtility(code)
        if (tokenType === 'trialToken') {
            // console.log({
            //     Industry: industries3Digit[0].Industry,
            //     'siccode-3digit': code,
            //     'siccodetext-3digit-industry':
            //         industries3Digit[0]['siccodetext-3digit-industry'],
            //     'total-company-size-3Digit': noOfCompanies3DigitIndustry,
            // })
            return {
                Industry: industries3Digit[0].Industry,
                'siccode-3digit': code,
                'siccodetext-3digit-industry':
                    industries3Digit[0]['siccodetext-3digit-industry'],
                'total-company-size-3Digit': noOfCompanies3DigitIndustry,
            }
        }
        const digit4Companies = []
        unique4DigitCodeIndustry.forEach((industry) => {
            digit4Companies.push({
                'siccode-4digit': industry['siccode-4digit'],
                'siccodetext-4digit-industry':
                    industry['siccodetext-4digit-industry'],
            })
        })
        return {
            Industry: industries3Digit[0].Industry,
            'siccode-3digit': code,
            'siccodetext-3digit-industry':
                industries3Digit[0]['siccodetext-3digit-industry'],
            'total-company-size-3Digit': noOfCompanies3DigitIndustry,
            digit4Companies,
        }
    } catch (error) {
        console.log(error)
    }
}

const Digit4CodeQuery = async (code, tokenType) => {
    try {
        const {
            industries4Digit,
            unique4DigitCodes,
            unique5DigitCodes,
            noOfCompanies4DigitIndustry,
            noOfCompanies5DigitIndustry,
            unique4DigitCodeIndustry,
            unique5DigitCodeIndustry,
        } = await queryUtility(code)

        if (tokenType === 'trialToken') {
            return {
                Industry: industries4Digit[0].Industry,
                'siccode-4digit': code,
                'siccodetext-4digit-industry':
                    industries4Digit[0]['siccodetext-4digit-industry'],
                'total-company-size-4Digit': noOfCompanies4DigitIndustry,
            }
        }
        const digit5Companies = []
        unique5DigitCodeIndustry.forEach((industry) => {
            digit5Companies.push({
                'siccode-5digit': industry['siccode-5digit'],
                'siccodetext-5digit-industry':
                    industry['siccodetext-5digit-industry'],
            })
        })
        return {
            Industry: industries4Digit[0].Industry,
            'siccode-4digit': code,
            'siccodetext-4digit-industry':
                industries4Digit[0]['siccodetext-4digit-industry'],
            'total-company-size-4Digit': noOfCompanies4DigitIndustry,
            digit5Companies,
        }
    } catch (error) {
        console.log(error)
    }
}

// const Digit5CodeQuery = async (code, tokenType) => {}

// const Digit6CodeQuery = async (code, tokenType) => {}

const comapaniesEmpRange = async (tokenType, minSize, maxSize) => {
    try {
        const industries = await Sicdata.find({})
        let rangeCodes = []
        industries.forEach((industry) => {
            if (
                parseInt(industry['empsize-3digit-industry']) >
                    parseInt(minSize) &&
                parseInt(industry['empsize-3digit-industry']) <
                    parseInt(maxSize)
            )
                rangeCodes.push(industry)
        })
        let uniqueCodes = []
        const checkCode = (industry) => {
            if (uniqueCodes.includes(industry['siccode-3digit'])) return false
            uniqueCodes.push(industry['siccode-3digit'])
            return true
        }
        const uniqueCodesArray = rangeCodes.filter(checkCode)
        if (tokenType === 'trialToken') {
            trialRangeCodes = []
            for (var i = 0; i < 3; i++) {
                if (rangeCodes[i]) trialRangeCodes.push(uniqueCodesArray[i])
            }
            return {
                data: trialRangeCodes,
            }
        }
        return {
            data: uniqueCodesArray,
        }
    } catch (error) {
        console.log(error)
    }
}

const comapaniesEmpGreaterThan = async (tokenType, minSize) => {
    try {
        const industries = await Sicdata.find({})
        let rangeCodes = []
        industries.forEach((industry) => {
            if (
                parseInt(industry['empsize-3digit-industry']) >
                parseInt(minSize)
            )
                rangeCodes.push(industry)
        })
        let uniqueCodes = []
        const checkCode = (industry) => {
            if (uniqueCodes.includes(industry['siccode-3digit'])) return false
            uniqueCodes.push(industry['siccode-3digit'])
            return true
        }
        const uniqueCodesArray = rangeCodes.filter(checkCode)
        if (tokenType === 'trialToken') {
            trialRangeCodes = []
            for (var i = 0; i < 3; i++) {
                if (rangeCodes[i]) trialRangeCodes.push(uniqueCodesArray[i])
            }
            return {
                data: trialRangeCodes,
            }
        }
        return {
            data: uniqueCodesArray,
        }
    } catch (error) {
        console.log(error)
    }
}

const numberOfCompany = async (tokenType, minSize) => {
    try {
        const industries = await Sicdata.find()
        let rangeCodes = []
        industries.forEach((industry) => {
            if (
                parseInt(industry['noofcompanies-3digit-industry']) >=
                parseInt(minSize)
            )
                rangeCodes.push(industry)
        })
        let uniqueCodes = []
        const checkCode = (industry) => {
            if (uniqueCodes.includes(industry['siccode-3digit'])) return false
            uniqueCodes.push(industry['siccode-3digit'])
            return true
        }
        const uniqueCodesArray = rangeCodes.filter(checkCode)
        if (tokenType === 'trialToken') {
            trialRangeCodes = []
            for (var i = 0; i < 3; i++) {
                if (rangeCodes[i]) trialRangeCodes.push(uniqueCodesArray[i])
            }
            return {
                data: trialRangeCodes,
            }
        }
        return {
            data: uniqueCodesArray,
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    Digit2CodeQuery,
    Digit3CodeQuery,
    Digit4CodeQuery,
    comapaniesEmpRange,
    comapaniesEmpGreaterThan,
    numberOfCompany,
}
