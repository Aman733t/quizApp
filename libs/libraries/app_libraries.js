const fs = require('fs');
const moment = require('moment-timezone');
const utf8 = require('utf8');
const config = require('../../config/config');


let _self = module.exports = {

	getFs(){
        return fs;
    },

    getMoment(time){
        return moment(time);
    },

    getConfig(){
        return config;
    }


}