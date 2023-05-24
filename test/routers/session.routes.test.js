const { expect } = require('chai');
const supertest = require('supertest');
const userModel = require('../../src/models/schemas/user.model.js');

const requester = supertest('http://localhost:8080');

describe('Session routes testing', async () => {
  let cookie;

  before(async () => {
    await userModel.findOneAndDelete({ email: 'germanrocky@gmail.com' });
  });

  it('[POST] /api/session/register - Should register a user and redirect', async function () {
    const mockUser = {
      firstName: 'german',
      lastName: 'rocky',
      age: 25,
      email: 'germanrocky@gmail.com',
      password: 'password',
    };
    const response = await requester
      .post('/api/session/register')
      .send(mockUser);
    expect(response.statusCode).to.be.eql(302);
    expect(response.request._data.email).to.be.eql(mockUser.email);
  });

  it('[POST] /api/session/login - Should login an user', async () => {
    const mockCredentials = {
      email: 'germanrocky@gmail.com',
      password: 'password',
    };

    const response = await requester
      .post('/api/session/login')
      .send(mockCredentials);
    const cookieHeader = response.headers['set-cookie'][0];
    cookie = {
      name: cookieHeader.split('=')[0],
      value: cookieHeader.split('=')[1],
    };
    expect(response.statusCode).to.be.eql(302);
    expect(cookieHeader).to.be.ok;
    expect(cookie.name).to.be.eql('mysession');
    expect(cookie.value).to.be.ok;
  });

  it('[GET] /api/session/current - Should return current logged user', async () => {
    const response = await requester
      .get('/api/session/current')
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload.email).to.be.eql('germanrocky@gmail.com');
  });

  after(async () => {
    await userModel.findOneAndDelete({ email: 'germanrocky@gmail.com' });
  });
});
