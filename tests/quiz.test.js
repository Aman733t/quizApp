const request = require('supertest');
const app = require('../app'); // Import the Express app

describe('Quiz API Tests', () => {
    let createdQuizId; // Variable to store the created quiz ID
    let getQuizQuestionOneId // Variable to store quiz 1st question ID;
    let getQuizQuestionTwoId // Variable to store quiz 2nd question ID;

    // Test for quiz creation
    describe('POST /api/createQuiz', () => {
        it('should create a quiz successfully', async () => {
            const res = await request(app)
                .post('/api/createQuiz')
                .set('user-agent', 'jest-test') // Add user-agent header
                .send({
                    title: 'Sample Quiz',
                    question: [
                        {
                            text: 'What is 2+2?',
                            options: ['2', '3', '4', '5'],
                            correct_option: 2,
                        },
                        {
                            text: 'What is 4+2?',
                            options: ['2', '6', '4', '5'],
                            correct_option: 1,
                        },
                    ],
                });

            // Assertions
            expect(res.statusCode).toEqual(201); // Adjusted to match API behavior
            expect(res.body).toHaveProperty('code', 200);
            expect(res.body).toHaveProperty('response', 'success');
            expect(res.body).toHaveProperty('quizId');
            // Store the created quiz ID for further tests
            createdQuizId = res.body.quizId;
        });
    });

    // Test for get Quiz By ID

    describe('POST /api/getQuizById', () => {
        it('should get a quiz data', async () => {
            const res = await request(app)
            .get(`/api/getQuizById?quizId=${createdQuizId}`)
            .set('user-agent', 'jest-test') // Add user-agent header

            expect(res.statusCode).toEqual(200); // Adjusted to match API behavior
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('question');

            getQuizQuestionOneId = res.body['question'][0]['id']
            getQuizQuestionTwoId = res.body['question'][1]['id']
        });
    });

    // Test for answer submission
    describe('POST /api/submitQuizAns', () => {
        it('should submit an answer successfully', async () => {
            const res = await request(app)
            .post(`/api/submitQuizAns?quizId=${createdQuizId}`)
            .set('user-agent', 'jest-test') // Add user-agent header
            .send({
              user_id: 'user123', // Mock user ID
              questionId: getQuizQuestionOneId, // Replace with actual question ID
              answer: 2, // Correct answer
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('is_correct');
            expect(res.body.is_correct).toBe(true); // Answer is correct
        });

        it('should return incorrect for a wrong answer', async () => {
            const res = await request(app)
            .post(`/api/submitQuizAns?quizId=${createdQuizId}`)
            .set('user-agent', 'jest-test') // Add user-agent header
            .send({
                user_id: 'user123', // Mock user ID
                questionId: getQuizQuestionTwoId, // Replace with actual question ID
                answer: 4, // Incorrect answer
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('is_correct');
            expect(res.body.is_correct).toBe(false); // Answer is incorrect
            expect(res.body).toHaveProperty('correct_option');
            expect(res.body.correct_option).toEqual(1); // Verify correct answer
        });
    });
});
