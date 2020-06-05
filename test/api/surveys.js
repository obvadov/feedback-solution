const chai = require('chai');
const app = require('../../server');
const Survey = require('../../models/surveyModel');
const User = require('../../models/userModel');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);
let surveyId, token;
describe('(Survey.get,post, patch, delete) tests for /api/v1/surveys route', () => {
    before((done) => {
        User.deleteMany({}, (err) => {});
        Survey.deleteMany({}, (err) => {});
        done();
    });

    describe('Survey.SignUp a user for test', () => {
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
});
describe('Survey.User authorization and survey requests', () => {
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
    describe('Survey.create a new survey', () => {
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

        it('should get a error (request without an authorization token)', (done) => {
            chai.request(app)
                .post('/api/v1/surveys')
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
                    expect(res).to.have.status(401);
                    done();
                });
        });
    }); //end of create a new survey describe
    describe('Survey. Show created survey data', () => {
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
                    expect(res.body)
                        .to.have.property('questions')
                        .to.be.an('Array').not.be.empty;

                    done();
                });
        });
        it('should get an error [survey not found 404]', (done) => {
            chai.request(app)
                .get(`/api/v1/surveys/5ed9e4cc949df91d7abeac63`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    done();
                });
        });
    });

    describe('Survey. Update created survey data', () => {
        it('should get a response status 200 and message', (done) => {
            chai.request(app)
                .patch(`/api/v1/surveys/${surveyId}`)
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'NEW Service quality 2',
                    url: 'http://someurl2',
                    questions: [
                        {
                            name: 'NEW How do you find our service3?',
                        },
                        {
                            name: 'NEW Could you rate our sales department?3',
                        },
                        {
                            name:
                                'NEW Will you recommend our service to someone else?3',
                        },
                    ],
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.have.property('message')
                        .that.to.equal('successfully updated');

                    done();
                });
        });
    });
    describe('Survey. Delete a created survey ', () => {
        it('should get a response status 204 ', (done) => {
            chai.request(app)
                .delete(`/api/v1/surveys/${surveyId}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    done();
                });
        });
        it('should get an error - non-existent surveyId value ', (done) => {
            chai.request(app)
                .delete(`/api/v1/surveys/${surveyId}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body)
                        .to.have.property('status')
                        .that.to.equal('fail');
                    expect(res.body).to.have.property('message').to.be.not
                        .empty;
                    done();
                });
        });
        it('should get an error - not-correct ObjectId(surveyId) value ', (done) => {
            chai.request(app)
                .delete(`/api/v1/surveys/${surveyId}111`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body)
                        .to.have.property('status')
                        .that.to.equal('fail');
                    expect(res.body)
                        .to.have.property('message')
                        .to.equal('wrong survey id parameter');
                    done();
                });
        });
    });
});
