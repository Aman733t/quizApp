module.exports = {
    "get":{
        "/api/getAllQuizList":"quiz.getAllQuizList",
        "/api/getQuizById":"quiz.getQuizById",
        "/api/getResultByUserid":"quiz.getResultByUserid"
    },
    "post":{
        "/api/createQuiz":"quiz.createQuiz",
        "/api/submitQuizAns":"quiz.submitQuizAns"
    }
}