const User = require('../models/User');

const getTrialData = async(users)=>{
    const filteredUsers = [];
    users.forEach(async (user)=>{
        filteredUsers.push({
            name : user.name,
            businessEmail : user.businessEmail,
            companyName : user.companyName,
            trial : user.trial,
            isTrial : user.isTrial,
            _id : user._id
        })
    })
    return filteredUsers;
}

const getPremiumUserData = async(users)=>{
    const filteredUsers = [];
    users.forEach(async (user)=>{
        filteredUsers.push({
            name: user.name,
            businessEmail : user.businessEmail,
            companyName: user.companyName,
            premium : user.premium,
            isPremium:user.isPremium,
            _id : user._id
        })
    })
    return filteredUsers;
}

module.exports = {
    getTrialData,
    getPremiumUserData
}