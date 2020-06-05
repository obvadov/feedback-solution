const chai = require('chai');
const app = require('../../server');
const User = require('../../models/userModel');
const chaiHttp = require('chai-http');
const { expect } = chai;

let token;
chai.use(chaiHttp);

describe('User.SignUp', () => {
    before((done) => {
        User.deleteMany({}, (err) => {});
        done();
    });

    it('Sign up a new user', (done) => {
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

    it('Trying to sign up a user with a short (vilidation invalid) password (requires: min:8)', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send({
                email: 'test_short@gmail.com',
                name: 'Alice Watson',
                password: '123',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body)
                    .to.contain.property('message')
                    .that.to.be.a('string');
                expect(res.body).to.contain.property('status').to.equal('fail');

                done();
            });
    });
});
describe('User.Login', () => {
    it('Login with correct credentials', (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'test@gmail.com',
                password: '123456789',
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body)
                    .to.contain.property('token')
                    .that.to.be.a('string');

                done();
            });
    });

    it('Login with incorrect credentials', (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'test@gmail.com',
                password: '5555',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body)
                    .to.contain.property('status')
                    .that.to.equal('fail');

                done();
            });
    });

    it('Login without a password', (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'hesh3@me.cpf',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body)
                    .to.contain.property('status')
                    .that.to.equal('fail');
                expect(res.body)
                    .to.contain.property('message')
                    .that.to.be.a('string');

                done();
            });
    });
});

describe('User.Show', () => {
    it('Show current user details', (done) => {
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

                chai.request(app)
                    .get('/api/v1/users')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body)
                            .to.contain.property('message')
                            .that.to.be.a('string');
                        expect(res.body)
                            .to.contain.property('data')
                            .to.have.deep.property('currentUser')
                            .to.have.all.keys('_id', 'name', 'email').to.not.be
                            .empty;

                        done();
                    });
            });
    });
});
describe('User.Patch', () => {
    it('Update user password and name', (done) => {
        chai.request(app)
            .patch('/api/v1/users/')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'My New name',
                current_password: '123456789',
                password: '987654321',
            })
            .end((req, res) => {
                expect(res.body)
                    .to.contain.property('message')
                    .that.to.equal('success');
                expect(res).to.have.status(200);
                done();
            });
    });
});
