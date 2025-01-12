let oMODEL = require('./model');
let oHelper = require('../../libs/helper/app_helper');
let oLibraries = require('../../libs/libraries/app_libraries');

let _self = module.exports = {
	
	// function to create a quiz
	createQuiz(req,res){
		let quizObj = req.body;
		let randomId = oHelper.generateId(); // generate a randomID for the quiz
		if(quizObj['title'] && quizObj['question'].length > 0){ // check if title and question are provided
			quizObj['question'].forEach((question)=>{
				question['id'] = oHelper.generateQuestionId(); // generate an id for each question
			})
			oMODEL.saveQuiz(quizObj,randomId,(err,response)=>{ // save the question
				if(err){
					// send error response if there is an error
					res.status(404).send({
						"code":404,
						"response":err
					})
				} else {
					// send success response with quiz ID
					res.status(201).send({
						"code":200,
						"response":response,
						"quizId":randomId
					})
				}
			});
		} else {
			// send error response if quiz parameter are missing
			res.status(404).json({ message: 'Missing Quiz Parameter..' });
		}
	},

	// function to get the list of all the quizz
	// for testing only
	getAllQuizList(req,res){
		oMODEL.getQuiz((err,response)=>{
			if(err){
				res.status(500).send(err)
			} else {
				res.status(200).send(response)
			}
		})
	},

	// function to get a quiz by its id
	getQuizById(req,res){
		let quizId = req.query;
		if(quizId['quizId']){
			oMODEL.getQuizById(quizId['quizId'],(err,response)=>{
				if(err){
					// send error response if there is an error
					res.status(404).send(err)
				} else {
					let resultObj = JSON.parse(JSON.stringify(response))
					if(resultObj){
						resultObj['question'].forEach((question)=>{
							delete question['correct_option'] // remove correct option from the quiz response
						})
						// sending success response with the quiz details
						res.status(200).send(resultObj)
					} else {
						// sending error response if quiz is not found
						res.status(404).send('quiz not found..');
					}
				}
			})
		} else {
			// send error response if quiz id is not provided.
			res.status(404).send('quiz not found..');
		}
	},

	// function to submit the quiz ans

	submitQuizAns(req,res){
		let ansObj = req.body;
		let quizId = req.query;
		let responseObj = {};
		if(quizId['quizId'] && ansObj['questionId'] && ansObj['answer'] && ansObj['user_id']){
			oMODEL.getQuizById(quizId['quizId'],(err,response)=>{
				let resultObj = {...response};
				if(err){
					// send error response if there is an error
					res.status(500).send(err)
				} else {
					resultObj['question'].forEach((question)=>{
						// check if the submitted ans is correct or not
						if(question['id'] == ansObj['questionId']){
							if(parseInt(question['correct_option']) == parseInt(ansObj['answer'])){
								responseObj['is_correct'] = true;
							} else {
								responseObj['is_correct'] = false;
								responseObj['correct_option'] = question['correct_option']
							}
						}
					});
					// save the user's quiz submission
					oMODEL.saveUserSubmission(quizId['quizId'],ansObj,responseObj,(err,submitted)=>{
						if(err){
							// send error response of there is an error
							res.status(500).send(err)
						} else {
							if(submitted == 'already submitted'){
								// send response if ans is already submitted
								res.status(200).send('ans already submitted..')	
							} else {
								if(Object.keys(responseObj).length > 0){
									// send response with the correct ans
									res.status(200).send(responseObj)	
								} else {
									// send error response if question is not found
									res.status(404).send('question not found..')
								}
							}
						}
					})
				}
			})
		} else {
			// send error response if quiz id or ans details are missing
			res.status(404).send('quiz not found..')
		}
	},

	// function to get quiz result by userid
	getResultByUserid(req,res){
		let user_id = req.query.userId;
		if(user_id){
			oMODEL.getResult(user_id,(err,response)=>{
				if(err){
					// send error response if there is an error
					res.status(404).send('User or results not found.')
				} else {
					let responseArr = [];
					for(let key in response){					
						let resultObj = {};
						resultObj['quiz_id'] = key;
						resultObj['user_id'] = user_id;
						// calculate score based on correct ans;
						resultObj['score'] = response[key].filter(item => item.is_correct).length;;
						resultObj['answers'] = response[key];
						responseArr.push(resultObj);
					}
					// send response with user's quiz results
					res.status(200).send(responseArr);
				}
			})
		} else {
			res.status(400).send('invalid `userId` parameter');
		}
	}	

}