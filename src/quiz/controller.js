let oMODEL = require('./model');
let oHelper = require('../../libs/helper/app_helper');
let oLibraries = require('../../libs/libraries/app_libraries');

let _self = module.exports = {
	
	createQuiz(req,res){
		let quizObj = req.body;
		let randomId = oHelper.generateId();
		if(quizObj['title'] && quizObj['question'].length > 0){
			quizObj['question'].forEach((question)=>{
				question['id'] = oHelper.generateQuestionId();
			})
			oMODEL.saveQuiz(quizObj,randomId,(err,response)=>{
				if(err){
					res.status(404).send({
						"code":404,
						"response":err
					})
				} else {
					res.status(201).send({
						"code":200,
						"response":response,
						"quizId":randomId
					})
				}
			});
		} else {
			res.status(404).json({ message: 'Missing Quiz Parameter..' });
		}
	},

	getAllQuizList(req,res){
		oMODEL.getQuiz((err,response)=>{
			if(err){
				res.status(500).send(err)
			} else {
				res.status(200).send(response)
			}
		})
	},

	getQuizById(req,res){
		let quizId = req.query;
		if(quizId['quizId']){
			oMODEL.getQuizById(quizId['quizId'],(err,response)=>{
				if(err){
					res.status(404).send(err)
				} else {
					let resultObj = JSON.parse(JSON.stringify(response))
					if(resultObj){
						resultObj['question'].forEach((question)=>{
							delete question['correct_option']
						})
						res.status(200).send(resultObj)
					} else {
						res.status(404).send('quiz not found..');
					}
				}
			})
		} else {
			res.status(404).send('quiz not found..');
		}
	},

	submitQuizAns(req,res){
		let ansObj = req.body;
		let quizId = req.query;
		let responseObj = {};
		if(quizId['quizId'] && ansObj['questionId'] && ansObj['answer'] && ansObj['user_id']){
			oMODEL.getQuizById(quizId['quizId'],(err,response)=>{
				let resultObj = {...response};
				if(err){
					res.status(500).send(err)
				} else {
					resultObj['question'].forEach((question)=>{
						if(question['id'] == ansObj['questionId']){
							if(parseInt(question['correct_option']) == parseInt(ansObj['answer'])){
								responseObj['is_correct'] = true;
							} else {
								responseObj['is_correct'] = false;
								responseObj['correct_option'] = question['correct_option']
							}
						}
					})
					oMODEL.saveUserSubmission(quizId['quizId'],ansObj,responseObj,(err,submitted)=>{
						if(err){
							res.status(500).send(err)
						} else {
							if(submitted == 'already submitted'){
								res.status(200).send('ans already submitted..')	
							} else {
								if(Object.keys(responseObj).length > 0){
									res.status(200).send(responseObj)	
								} else {
									res.status(404).send('question not found..')
								}
							}
						}
					})
				}
			})
		} else {
			res.status(404).send('quiz not found..')
		}
	},

	getResultByUserid(req,res){
		let user_id = req.query.userId;
		if(user_id){
			oMODEL.getResult(user_id,(err,response)=>{
				if(err){
					res.status(404).send('User or results not found.')
				} else {
					let responseArr = [];
					for(let key in response){					
						let resultObj = {};
						resultObj['quiz_id'] = key;
						resultObj['user_id'] = user_id;
						resultObj['score'] = response[key].filter(item => item.is_correct).length;;
						resultObj['answers'] = response[key];
						responseArr.push(resultObj);
					}

					res.status(200).send(responseArr);
				}
			})
		} else {
			res.status(400).send('invalid `userId` parameter');
		}
	}	

}