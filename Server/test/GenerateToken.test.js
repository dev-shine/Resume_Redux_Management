let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var jwt = require('jsonwebtoken');
var config = require('./../server/config');
var _ = require('lodash');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);

function createToken(user) {
    return jwt.sign(user, config.secret);
}

describe('Token Generation', () => {
	  it('it should set the Token', (done) => {
      var profile = _.pick({'Email':'hetal.mehta@ansibytecode.com', 'Password':'12345678'}, 'password');
      localStorage.setItem('JWT_Token',createToken(profile));
      done();
	  });
 });
