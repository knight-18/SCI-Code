const Sicdata = require('../models/Sicdata')
const queryUtility = require('./queryUtility')
const Digit2CodeQuery = async (code, tokenType) => {
    try {
        const {
            industries2Digit,
            noOfCompanies3DigitIndustry,
            unique3DigitCodes,
            unique4DigitCodes,
            empSize3DigitIndustry,
        } = await queryUtility(code)
        if (tokenType === 'trialToken') {
            let subCategories = [
                `subcategories${unique3DigitCodes[0]}:${
                    unique3DigitCodes[0]
                } \$ ${
                    unique4DigitCodes[0].includes(unique3DigitCodes[0])
                        ? unique4DigitCodes[0]
                        : '***hidden***'
                }\| ***hidden***`,
            ]
            for (var i = 1; i < unique3DigitCodes.length; i++) {
                subCategories.push(
                    `subcategories${unique3DigitCodes[i]}:***hidden***`
                )
            }
            return {
                Industry: industries2Digit[0].Industry,
                'siccode-2digit': code,
                'siccodetext-2digit-industry':
                    industries2Digit[0]['siccodetext-2digit-industry'],
                'total-company-size': '***hidden***',
                'emp-size': '***hidden***',
                subcategory: subCategories.toString(),
            }
        }
        let subCategories = []
        unique3DigitCodes.forEach((code) => {
            let particularCode = `${code}\$`
            unique4DigitCodes.forEach((code4Digit) => {
                if (code4Digit.includes(code))
                    particularCode += `\|${code4Digit}`
            })
            subCategories.push(`subcategories${code} : ${particularCode}`)
        })
        return {
            Industry: industries2Digit[0].Industry,
            'siccode-2digit': code,
            'siccodetext-2digit-industry':
                industries2Digit[0]['siccodetext-2digit-industry'],
            'total-company-size': noOfCompanies3DigitIndustry,
            'emp-size': empSize3DigitIndustry,
            subcategory: subCategories.toString(),
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
            empSize3DigitIndustry,
        } = await queryUtility(code)

        let subCategories = []
        unique3DigitCodes.forEach((code) => {
            let particularCode = `${code}\$`
            unique4DigitCodes.forEach((code4Digit) => {
                if (code4Digit.includes(code))
                    particularCode += `\|${code4Digit}`
            })
            subCategories.push(`subcategories${code} : ${particularCode}`)
        })
        return {
            Industry: industries3Digit[0].Industry,
            'siccode-3digit': code,
            'siccodetext-3digit-industry':
                industries3Digit[0]['siccodetext-3digit-industry'],
            'total-company-size': noOfCompanies3DigitIndustry,
            'employee-size':
                empSize3DigitIndustry !== 0 ? empSize3DigitIndustry : 'N/A',
            subcategory: subCategories.toString(),
        }
    } catch (error) {
        console.log(error)
    }
}

const Digit4CodeQuery = async (code, tokenType) => {
    try {
        const {
            industries4Digit,
            noOfCompanies4DigitIndustry,
            noOfEmployeesOf4DigitIndustry,
        } = await queryUtility(code)

        return {
            Industry: industries4Digit[0].Industry,
            'siccode-4digit': code,
            'siccodetext-4digit-industry':
                industries4Digit[0]['siccodetext-4digit-industry'],
            'total-company-size-4Digit': noOfCompanies4DigitIndustry,
            'emp-size':
                noOfEmployeesOf4DigitIndustry === 0
                    ? 'N/A'
                    : noOfEmployeesOf4DigitIndustry,
        }
    } catch (error) {
        console.log(error)
    }
}

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

const findByKeyword = async (keyword, length) => {
    try {
        keyword = keyword.toLowerCase()
        let siccode2Digit = []
        let siccode3Digit = []
        let siccode4Digit = []
        const industries = await Sicdata.find()
        if (industries.length === 0) {
            return {
                data: 'No result found',
            }
        }
        industries.forEach(async (industry) => {
            if (
                industry['siccodetext-2digit-industry']
                    .toLowerCase()
                    .includes(keyword) &&
                !siccode2Digit['siccode-2digit'].includes(
                    industry['siccode-2digit']
                )
            ) {
                siccode2Digit.push({
                    Industry: industry.Industry,
                    'siccode-2digit': industry['siccode-2digit'],
                    'siccodetext-2digit-industry':
                        industry['siccodetext-2digit-industry'],
                })
            }
            if (
                industry['siccodetext-3digit-industry']
                    .toLowerCase()
                    .includes(keyword) &&
                !siccode3Digit['siscode-3digit'].includes(
                    industry['siccode-3digit']
                )
            )
                siccode3Digit.push({
                    Industry: industry.Industry,
                    'siccode-3digit': industry['siccode-3digit'],
                    'siccodetext-3digit-industry':
                        industry['siccodetext-3digit-industry'],
                    'noofcompanies-3digit-industry':
                        industry['noofcompanies-3digit-industry'],
                    'empsize-3digit-industry':
                        industry['empsize-3digit-industry'],
                })
            if (
                industry['siccodetext-4digit-industry']
                    .toLowerCase()
                    .includes(keyword) &&
                !siccode4Digit['siccode-4digit'].includes(
                    industry['siccode-4digit']
                )
            )
                siccode4Digit.push({
                    Industry: industry.Industry,
                    'siccode-4digit': industry['siccode-4digit'],
                    'siccodetext-4digit-industry':
                        industry['siccodetext-4digit-industry'],
                    'noofcompanies-4digit-industry':
                        industry['noofcompanies-4digit-industry'],
                    'empsize-4digit-industry':
                        industry['empsize-4digit-industry'],
                })
        })
        if (length == 2) return siccode2Digit
        else if (length == 3) return siccode3Digit
        else return siccode4Digit
        // return {
        //     sicode2Digit: siccode2Digit.toString(),
        //     siccode3Digit: siccode3Digit.toString(),
        //     siccode4Digit: siccode4Digit.toString(),
        // }
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
    findByKeyword,
}
