const Crypto = require("crypto");

const apiGenerator = (email)=>{
    const emailGen = email.split("@")[0];
    const domain = email.split("@")[1];
    const timeStamp = Date.now();
    const randString = Crypto
                    .randomBytes(emailGen.length)
                    .toString('base64')
                    .slice(0, emailGen.length)
    let token = "";
    for(var i = 0; i < emailGen.length; i++){
        token += emailGen[i] + randString[i];
    }
    token += '-';
    const randString1 = Crypto
                    .randomBytes(domain.length)
                    .toString('base64')
                    .slice(0, domain.length)
    for(var i = 0; i < domain.length; i++){
        token += domain[i] + randString1[i];
    }
    var newToken = token.replace(/\+/g, "$");
    newToken = newToken.replace(/\?/g,'$');
    newToken = newToken.replace(/\//g,'$');
    newToken = newToken.replace(/\#/g,'$');
    newToken += "-" + timeStamp;
    return newToken
}

const decryptToken = (token)=>{
    const emailPart = token.split("-")[0];
    const domainPart = token.split("-")[1];
    let email = "";
    for(var i = 0; i < emailPart.length; i+=2)
        email += emailPart[i];
    email += "@";
    for(var i = 0; i < domainPart.length; i+=2)
        email += domainPart[i];
    return email;
}

module.exports = {
    apiGenerator,
    decryptToken
}