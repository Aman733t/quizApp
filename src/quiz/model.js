let questionObj = {};
let result = {};

let _self = module.exports = {

	saveQuiz(quizObj,randomId,callback){
		questionObj[randomId] = quizObj;
		callback(null,'success');
	},

	getQuiz(callback){
		callback(questionObj)
	},

	getQuizById(id,callback){
		if(Object.keys(questionObj).length > 0){
			if(questionObj[id]){
				let cloneObj = JSON.parse(JSON.stringify(questionObj))
				callback(null,cloneObj[id]);
			} else {
				callback('question not found',null);
			}
		} else {
			callback('question not found',null);
		}
		
	},

	saveUserSubmission(quizId,ansObj,responseObj,callback){
		let resultObj = result;
		let is_submitted = false;
		if(resultObj[ansObj['user_id']]){
			if(resultObj[ansObj['user_id']][quizId]){
				resultObj[ansObj['user_id']][quizId].forEach((question)=>{
					if(question['questionId'] == ansObj['questionId']){
						is_submitted = true
					}
				})
				if(is_submitted){
					callback(null,'already submitted');
				} else {
					let userResponseObj = {};
					userResponseObj['questionId'] = ansObj['questionId'];
					userResponseObj['answer'] = ansObj['answer'];
					userResponseObj['is_correct'] = responseObj['is_correct'];
					resultObj[ansObj['user_id']][quizId].push(userResponseObj);
					callback(null,'success');
				}
			} else {
				let userResponseObj = {};
				resultObj[ansObj['user_id']][quizId] = [];
				userResponseObj['questionId'] = ansObj['questionId'];
				userResponseObj['answer'] = ansObj['answer'];
				userResponseObj['is_correct'] = responseObj['is_correct'];
				resultObj[ansObj['user_id']][quizId].push(userResponseObj);
				callback(null,'success');
			}
		} else {
			let userResponseObj = {};
			resultObj[ansObj['user_id']] = {};
			resultObj[ansObj['user_id']][quizId] = [];
			userResponseObj['questionId'] = ansObj['questionId'];
			userResponseObj['answer'] = ansObj['answer'];
			userResponseObj['is_correct'] = responseObj['is_correct'];
			resultObj[ansObj['user_id']][quizId].push(userResponseObj);
			callback(null,'success');
		}
	},

	getResult(user_id,callback){
		callback(null,result[user_id])
	}

}