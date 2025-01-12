# Quiz API Documentation

This document provides an overview of the Quiz API, which includes routes for creating quizzes, submitting answers, and fetching results.

## Installation

* STEP 1
```
sudo docker build --no-cache . -t quizapp
```
* STEP 2

```
sudo docker run -p 9005:9005 -d --name quizapp --restart unless-stopped quizapp
```

## Base URL

The API is hosted at:

```
http://localhost:9005
```

## API Endpoints

### 1. Create a Quiz

**Endpoint:**

```
POST /api/createQuiz
```

**Description:**
Creates a new quiz with the specified title and questions.

**Request Headers:**

- `user-agent`: A string to identify the client (e.g., `jest-test`).

**Request Body:**

```json
{
    "title": "Sample Quiz",
    "question": [
        {
            "text": "What is 2 + 2?",
            "options": [1, 2, 3, 4],
            "correct_option": 3
        },
        {
            "text": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "correct_option": 2
        }
    ]
}
```

**Response:**

```json
{
    "code": 200,
    "response": "success",
    "quiz_id": 3473325555759
}
```

**Response Fields:**

- `code`: Status code indicating success.
- `response`: A success message.
- `quiz_id`: A unique identifier for the created quiz.

**Status Codes:**

- `200`: Quiz created successfully.
- `400`: Invalid input data.

---

### 1. Get Quiz By Id

**Endpoint:**

```
GET /api/getQuizById?quizId=<quizId>
```
Replace <quizId> with the quiz_id received from the createQuiz API

**Description:**
Will give quiz with all the question and options

**Request Headers:**

- `user-agent`: A string to identify the client (e.g., `jest-test`).

**Response:**

```json
{
    "title": "Sample Quiz",
    "question": [
        {
            "text": "What is 2+2?",
            "options": [
                "2",
                "3",
                "4",
                "5"
            ],
            "id": "301742328168"
        },
        {
            "text": "What is 4+2?",
            "options": [
                "2",
                "6",
                "4",
                "5"
            ],
            "id": "465288906216"
        }
    ]
}
```

**Response Fields:**

- `title`: Title for the quiz.
- `question`: question for the quiz with there options.

**Status Codes:**

- `200`: Quiz created successfully.
- `404`: Question Not Found.

---

### 3. Submit Quiz Answer

**Endpoint:**

```
POST /api/submitQuizAns?quizId=<quizId>
```
Replace <quizId> with the quiz_id received from the createQuiz API

**Description:**
Submits an answer for a specific quiz question and checks whether the answer is correct.

**Query Parameters:**

- `quizId` (required): The unique identifier of the quiz.

**Request Headers:**

- `user-agent`: A string to identify the client (e.g., `jest-test`).

**Request Body:**

```json
{
    "user_id": "123",
    "questionId": "<question_id>",
    "answer": 3
}
```
* question_id will get from the getQuizById API in question field

**Response (Correct Answer):**

```json
{
    "code": 200,
    "is_correct": true
}
```

**Response (Incorrect Answer):**

```json
{
    "code": 200,
    "is_correct": false,
    "correct_option": 3
}
```

**Response Fields:**

- `code`: Status code indicating success.
- `is_correct`: A boolean indicating whether the submitted answer is correct.
- `correct_option` (if incorrect): The correct answer index.

**Status Codes:**

- `200`: Answer processed successfully.
- `400`: Invalid input data.
- `404`: Quiz or question not found.

---

### 4. Get Results by User ID

**Endpoint:**

```
POST /api/getResultByUserid
```

**Description:**
Fetches the quiz results for a specific user.

**Query Parameters:**

- `userId` (required): The unique identifier of the user.

**Request Headers:**

- `user-agent`: A string to identify the client (e.g., `jest-test`).

**Response:**

```json
[
    {
        "quiz_id": "3473352078824",
        "user_id": "12334",
        "score": 1,
        "answers": [
            {
                "questionId": "310758069656",
                "answer": 3,
                "is_correct": false
            },
            {
                "questionId": "885560851257",
                "answer": 1,
                "is_correct": true
            }
        ]
    }
]
```

**Response Fields:**

  - `quiz_id`: The unique identifier of the quiz.
  - `user_id`: userid for the result
  - `score`: The user’s score in the quiz.
  - `answers`: Attempted question and there response

**Status Codes:**

- `200`: Results fetched successfully.
- `400`: Missing or invalid `userId` parameter.
- `404`: User or results not found.

## Notes

- Ensure that the `quizId` and `questionId` are valid and exist before submitting answers.
- The `correct_option` index starts from 0.

---

## Example Usage

### Create a Quiz

**Request:**

```bash
curl --location 'http://localhost:9005/api/createQuiz' \
--header 'Content-Type: application/json' \
--data '{
    "title":"Sample Quiz",
    "question":[
        {
            "text":"What is 2+2?",
            "options":["2", "3", "4", "5"],
            "correct_option": 2
        },
        {
            "text": "What is 4+2?",
            "options": ["2", "6", "4", "5"],
            "correct_option": 1
        }
    ]
}'
```

**Response:**

```json
{
    "code": 200,
    "response": "success",
    "quizId": 3473352832070
}
```
### Get Quiz By quizId

**Request:**

```bash
curl --location 'http://localhost:9005/api/getQuizById?quizId=3473352832070'
```

**Response:**

```json
{
    "title": "Sample Quiz",
    "question": [
        {
            "text": "What is 2+2?",
            "options": [
                "2",
                "3",
                "4",
                "5"
            ],
            "id": "310758069656"
        },
        {
            "text": "What is 4+2?",
            "options": [
                "2",
                "6",
                "4",
                "5"
            ],
            "id": "885560851257"
        }
    ]
}
```

### Submit an Answer

**Request:**

```bash
curl -X POST "http://localhost:9005/api/submitQuizAns?quizId=3473352832070" \
-H "Content-Type: application/json" \
-H "user-agent: jest-test" \
-d '{
    "user_id": "123",
    "questionId": "310758069656",
    "answer": 2
}'
```

**Response (Correct Answer):**

```json
{
    "is_correct": true
}
```

### Get Results by User ID

**Request:**

```bash
http://localhost:9005/api/getResultByUserid?userId=123
```

**Response:**

```json
[
    {
        "quiz_id": "3473352078824",
        "user_id": "12334",
        "score": 1,
        "answers": [
            {
                "questionId": "310758069656",
                "answer": 3,
                "is_correct": false
            },
            {
                "questionId": "885560851257",
                "answer": 1,
                "is_correct": true
            }
        ]
    }
]
```

