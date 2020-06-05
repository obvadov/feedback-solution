const chai = require('chai');
const app = require('../../server');
const Survey = require('../../models/surveyModel');
const User = require('../../models/userModel');
const Answer = require('../../models/answerModel');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);
let surveyId,
    token,
    answerId,
    questionsId = [];
describe('(get,post, patch, delete) tests for /api/v1/answers route', () => {
    before((done) => {
        User.deleteMany({}, (err) => {});
        Survey.deleteMany({}, (err) => {});
        Answer.deleteMany({}, (err) => {});
        done();
    });

    describe('Answer.SignUp a user for test', () => {
        it('should get a json with user data', (done) => {
            chai.request(app)
                .post('/api/v1/users/signup')
                .send({
                    email: 'test@gmail.com',
                    name: 'Alice Watson',
                    password: '123456789',
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body)
                        .to.contain.property('message')
                        .that.to.be.a('string');
                    expect(res.body)
                        .to.contain.property('data')
                        .that.has.property('token')
                        .that.is.a('string');
                    expect(res.body)
                        .to.contain.property('data')
                        .that.has.property('id')
                        .that.is.a('string');

                    done();
                });
        });
    });

    describe('Answer.User authorization and survey requests', () => {
        it('should login and return valid token ', (done) => {
            chai.request(app)
                .post('/api/v1/users/login')
                .send({
                    email: 'test@gmail.com',
                    password: '123456789',
                })
                .end((err, res) => {
                    token = res.body.token;
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.contain.property('token')
                        .that.to.be.a('string');
                    expect(res.type).to.equal('application/json');
                    done();
                });
        });
        describe('Answer.create a new survey', () => {
            it('should get a new survey token', (done) => {
                chai.request(app)
                    .post('/api/v1/surveys')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        name: 'Service quality',
                        url: 'http://someurl',
                        questions: [
                            {
                                name: 'How did you find our service?',
                            },
                            {
                                name: 'Could you rate our sales department?',
                            },
                            {
                                name:
                                    'Will you recommend our service to someone else?',
                            },
                        ],
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res.body)
                            .to.contain.property('message')
                            .that.to.be.a('string')
                            .that.to.equal('succesfully');
                        expect(res.body)
                            .to.contain.property('data')
                            .to.have.deep.property('id')
                            .to.be.a('string').to.not.be.empty;
                        surveyId = res.body.data.id;
                        done();
                    });
            });
        });
        describe('Answer.Show created survey data', () => {
            it('should get a json _id,name, url, questions[]', (done) => {
                chai.request(app)
                    .get(`/api/v1/surveys/${surveyId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.all.keys(
                            '_id',
                            'name',
                            'url',
                            'questions',
                            '__v'
                        );

                        questionsId = res.body.questions.map(
                            (qesetion) => qesetion._id
                        );

                        expect(res.body)
                            .to.have.property('questions')
                            .to.be.an('Array').not.be.empty;

                        done();
                    });
            });
        });

        describe('Answer.create a new answer', () => {
            it('should get a 201 status, message, data:{answerId}', (done) => {
                chai.request(app)
                    .post('/api/v1/answers')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        surveyId,
                        data: [
                            {
                                questionId: questionsId[0],
                                response: 'Pretty good',
                            },
                            {
                                questionId: questionsId[1],
                                response: '5 stars',
                            },
                            {
                                questionId: questionsId[2],
                                response: 'I think so',
                            },
                        ],
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res.body)
                            .to.contain.property('message')
                            .that.to.be.a('string')
                            .that.to.equal('succesfully');
                        expect(res.body)
                            .to.contain.property('data')
                            .to.have.deep.property('id')
                            .to.be.a('string').to.not.be.empty;
                        answerId = res.body.data.id;
                        done();
                    });
            });
            it('should get a 400 status, trying to add an answer without surveyId value', (done) => {
                chai.request(app)
                    .post('/api/v1/answers')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        data: [
                            {
                                questionId: questionsId[0],
                                response: 'Pretty good',
                            },
                            {
                                questionId: questionsId[1],
                                response: '5 stars',
                            },
                            {
                                questionId: questionsId[2],
                                response: 'I think so',
                            },
                        ],
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body)
                            .to.contain.property('status')
                            .that.to.be.a('string')
                            .that.to.equal('fail');

                        done();
                    });
            });
        });

        describe('Answer.Show an answer', () => {
            it('should get a response status 200 and json: data, _id, user, survey', (done) => {
                chai.request(app)
                    .get(`/api/v1/answers/${answerId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.all.keys(
                            '_id',
                            'data',
                            'user',
                            'survey',
                            '__v'
                        );
                        expect(res.body)
                            .to.have.property('data')
                            .to.be.an('Array').not.be.empty;

                        done();
                    });
            });

            it('should get an unauthorized error', (done) => {
                chai.request(app)
                    .get(`/api/v1/answers/${answerId}`)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('Answer.getting answers list', () => {
            it('should get a response status 200 and json: current_page, total_pages, data[]', (done) => {
                chai.request(app)
                    .get(`/api/v1/answers`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.all.keys(
                            'current_page',
                            'total_pages',
                            'data'
                        );
                        expect(res.body)
                            .to.have.property('data')
                            .to.be.an('Object').not.be.empty;

                        done();
                    });
            });

            it('should get an unauthorized error', (done) => {
                chai.request(app)
                    .get(`/api/v1/answers/${answerId}`)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });
    });
});
