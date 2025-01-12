let app_module = require('../../config/app_module');
let routes = require('../../config/routes');
let oHelper = require('../helper/app_helper');


let _self = module.exports = {

	getMethod:(req,res,next)=>{
		if(process.env.NODE_ENV === 'test' || req.headers['user-agent']){
			let service = routes.get[req.url.split('?')[0]].split('.');
			app_module[service[0]][service[1]](req,res,next)
		} else {
			res.send(401)
		}
	},

	postMethod:(req,res,next)=>{
		if(process.env.NODE_ENV === 'test' || req.headers['user-agent']){
			let service = routes.post[req.url.split('?')[0]].split('.');
			app_module[service[0]][service[1]](req,res,next)
		} else {
			res.send(401)
		}
	}

}