let oLibraries = require('../libraries/app_libraries');
let secretkey = oLibraries.getConfig().authkey.secretkey;
let tokensecret = oLibraries.getConfig().authkey.tokenSecretKey;
let config = require('../../config/config');

let _self = module.exports ={

	getTokenSecret(){
        return tokensecret
    },

    generateId(){
        let timestamp = new Date().getTime();
        let randomVariable = Math.floor(Math.random() * 26) + Date.now() + timestamp;
        let id = Math.floor((Math.random() * 10) + 13);
        return randomVariable
    },

    generateQuestionId(){
        let timestamp = Math.floor(Math.random() * 26) + new Date().getTime()
        let pattern = "xxxxxxxxxxxx";
        let charset = "0123456789";
        let uuid = pattern.replace(/[x]/g,()=> charset[Math.floor(Math.random() * charset.length)])
        let randomQuestionVariable = uuid;
        return randomQuestionVariable.toLowerCase();
    }


}