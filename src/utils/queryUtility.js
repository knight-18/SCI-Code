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
            unique3DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-3digit-industry'] !== undefined)
                    noOfCompanies3DigitIndustry += parseInt(
                        industry['noofcompanies-3digit-industry']
                    )
            })
            return {
                industries2Digit,
                noOfCompanies3DigitIndustry,
                unique3DigitCodeIndustry,
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
            unique3DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-3digit-industry'] !== undefined)
                    noOfCompanies3DigitIndustry += parseInt(
                        industry['noofcompanies-3digit-industry']
                    )
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
            const checkCode5Digit = (industry) => {
                if (unique5DigitCodes.includes(industry['siccode-5digit'])) {
                    return false
                }
                unique5DigitCodes.push(industry['siccode-5digit'])
                return true
            }
            const unique5DigitCodeIndustry = industries4Digit.filter(
                checkCode5Digit
            )
            let noOfCompanies4DigitIndustry = 0
            unique4DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-4digit-industry'] !== undefined)
                    noOfCompanies4DigitIndustry += parseInt(
                        industry['noofcompanies-4digit-industry']
                    )
            })
            let noOfCompanies5DigitIndustry = 0
            unique5DigitCodeIndustry.forEach((industry) => {
                if (industry['noofcompanies-5digit-industry'] !== undefined)
                    noOfCompanies5DigitIndustry += parseInt(
                        industry['noofcompanies-5digit-industry']
                    )
            })
            return {
                industries4Digit,
                unique4DigitCodes,
                unique5DigitCodes,
                noOfCompanies4DigitIndustry,
                noOfCompanies5DigitIndustry,
                unique4DigitCodeIndustry,
                unique5DigitCodeIndustry,
            }
        }
    } catch (error) {
        console.log(error)
    }

    // switch(code.length){
    //     case 2 :

    //     case 3 :
    //         let industries3Digit = await Sicdata.find({"siccode-3digit": code })
    //         if (industries3Digit.length === 0) {
    //             console.log('NO such token exists')
    //             throw new Error('No such token exists')
    //         }
    //         let unique3DigitCodes =
    //         let que4DigitCodes = []
    //         let checkCode3Digit = (industry) => {
    //             if (unique4DigitCodes.includes(industry['siccode-4digit'])) {
    //                 return false
    //             }
    //             unique4DigitCodes.push(industry['siccode-4digit'])
    //             return true
    //         }
    //         let unique4DigitCodeIndustry = industries3Digit.filter(checkCode3Digit)
    //         let noOfCompanies4DigitIndustry = 0
    //         unique4DigitCodeIndustry.forEach((industry) => {
    //             if (industry['noofcompanies-4digit-industry'] !== undefined)
    //                 noOfCompanies4DigitIndustry += parseInt(
    //                     industry['noofcompanies-4digit-industry']
    //                 )
    //         })
    //         return {
    //             industries3Digit,
    //             noOfCompanies4DigitIndustry,
    //             unique4DigitCodeIndustry
    //         }
    //     case 4 :
    //         industries4Digit = await Sicdata.find({"siccode-4digit": code })
    //         if (industries4Digit.length === 0) {
    //             console.log('NO such token exists')
    //             throw new Error('No such token exists')
    //         }
    //         let unique5DigitCodes = []
    //         checkCode4Digit = (industry) => {
    //             if (unique5DigitCodes.includes(industry['siccode-5digit'])) {
    //                 return false
    //             }
    //             unique5DigitCodes.push(industry['siccode-5digit'])
    //             return true
    //         }
    //         let unique5DigitCodeIndustry = industries4Digit.filter(checkCode4Digit)
    //         let noOfCompanies5DigitIndustry = 0
    //         unique5DigitCodeIndustry.forEach((industry) => {
    //             if (industry['noofcompanies-5digit-industry'] !== undefined)
    //                 noOfCompanies5DigitIndustry += parseInt(
    //                     industry['noofcompanies-5digit-industry']
    //                 )
    //         })
    //         return {
    //             industries4Digit,
    //             noOfCompanies5DigitIndustry,
    //             unique5DigitCodeIndustry
    //         }
    //     case 5 :
    //         industries5Digit = await Sicdata.find({"siccode-5digit": code })
    //         if (industries5Digit.length === 0) {
    //             console.log('NO such token exists')
    //             throw new Error('No such token exists')
    //         }
    //         let unique6DigitCodes = []
    //         checkCode5Digit = (industry) => {
    //             if (unique6DigitCodes.includes(industry['siccode-6digit'])) {
    //                 return false
    //             }
    //             unique6DigitCodes.push(industry['siccode-6digit'])
    //             return true
    //         }
    //         let unique6DigitCodeIndustry = industries5Digit.filter(checkCode5Digit)
    //         let noOfCompanies6DigitIndustry = 0
    //         unique6DigitCodeIndustry.forEach((industry) => {
    //             if (industry['noofcompanies-6digit-industry'] !== undefined)
    //                 noOfCompanies6DigitIndustry += parseInt(
    //                     industry['noofcompanies-6digit-industry']
    //                 )
    //         })
    //         return {
    //             industries5Digit,
    //             noOfCompanies6DigitIndustry,
    //             unique6DigitCodeIndustry
    //         }
    //     case 6 :
    //         industries6Digit = await Sicdata.find({"siccode-6digit": code })
    //         if (industries.length === 0) {
    //             console.log('NO such token exists')
    //             throw new Error('No such token exists')
    //         }
    //         return {industries6Digit}
    //     default :
    //         break;
    // }
}
