Mini Feedback-Solution
API for Feedback solution (NodeJS, Express, MongoDB, Mongoose, Mocha, Chai)

REST API docs: https://documenter.getpostman.com/view/9641020/SztK14Tb

$ npm run test-recursive

running


  (get,post, patch, delete) tests for /api/v1/answers route
    Answer.SignUp a user for test
      ✓ should get a json with user data (277ms)
    Answer.User authorization and survey requests
      ✓ should login and return valid token  (252ms)
      Answer.create a new survey
        ✓ should get a new survey token
      Answer.Show created survey data
        ✓ should get a json _id,name, url, questions[]
      Answer.create a new answer
        ✓ should get a 201 status, message, data:{answerId}
        ✓ should get a 400 status, trying to add an answer without surveyId value
      Answer.Show an answer
        ✓ should get a response status 200 and json: data, _id, user, survey
        ✓ should get an unauthorized error
      Answer.getting answers list
        ✓ should get a response status 200 and json: current_page, total_pages, data[]
        ✓ should get an unauthorized error

  (Survey.get,post, patch, delete) tests for /api/v1/surveys route
    Survey.SignUp a user for test
      ✓ should get a json with user data (253ms)

  Survey.User authorization and survey requests
    ✓ should login and return valid token  (247ms)
    Survey.create a new survey
      ✓ should get a new survey token
      ✓ should get a error (request without an authorization token)
    Survey. Show created survey data
      ✓ should get a json _id,name, url, questions[]
      ✓ should get an error [survey not found 404]
    Survey. Update created survey data
      ✓ should get a response status 200 and message
    Survey. Delete a created survey 
      ✓ should get a response status 204 
      ✓ should get an error - non-existent surveyId value 
      ✓ should get an error - not-correct ObjectId(surveyId) value 

  User.SignUp
    ✓ Sign up a new user (254ms)
    ✓ Trying to sign up a user with a short (vilidation invalid) password (requires: min:8)

  User.Login
    ✓ Login with correct credentials (247ms)
    ✓ Login with incorrect credentials (246ms)
    ✓ Login without a password

  User.Show
    ✓ Show current user details (251ms)

  User.Patch
    ✓ Update user password and name (488ms)


  27 passing (3s)