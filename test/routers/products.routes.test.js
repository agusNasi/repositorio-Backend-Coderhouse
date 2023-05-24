const { expect } = require('chai');
const supertest = require('supertest');
const productModel = require('../../src/models/schemas/product.model.js');
const userModel = require('../../src/models/schemas/user.model.js');

const requester = supertest('http://localhost:8080');

describe('Products routes testing for unauthenticated users', async () => {
  it('[POST] /api/products - Should return a code 401 for unauthenticated users', async () => {
    const mockProduct = {
      title: 'velas',
      description: 'velas ricas en aromas',
      code: 'mock',
      price: 222,
      stock: 2,
      category: 'test',
      status: true,
      thumbnails: [],
      owner: 'admin',
    };

    const response = await requester.post('/api/products').send(mockProduct);
    expect(response.statusCode).to.be.eql(401);
  });
});

describe('Products routes testing for user with USER role', async () => {
  let cookie;

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

  it('[GET] /api/session/current - Should return current logged user with USER role', async () => {
    const response = await requester
      .get('/api/session/current')
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload.email).to.be.eql('germanrocky@gmail.com');
    expect(response.body.payload.role).to.be.eql('user');
  });

  it('[POST] /api/products - Should return a 403 status', async () => {
    const mockProduct = {
      title: 'velas',
      description: 'velas ricas en aromas',
      code: 'mock',
      price: 222,
      stock: 2,
      category: 'test',
      status: true,
      thumbnails: [],
    };

    const response = await requester
      .post('/api/products')
      .send(mockProduct)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.be.eql(403);
  });

  after(async () => {
    await userModel.findOneAndDelete({ email: 'germanrocky@gmail.com' });
  });
});

describe('Products routes testing for user with PREMIUM role', async () => {
  let cookie;

  it('[POST] /api/session/register - Should register a user and redirect', async function () {
    const mockUser = {
      firstName: 'velas',
      lastName: 'velas ricas en aromas',
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

  it('[PUT] /api/users/premium/:uid - Should change user role to premium', async () => {
    const user = await userModel
      .findOne({ email: 'germanrocky@gmail.com' })
      .lean();
    const userId = user._id.toString();
    const response = await requester.put(`/api/users/premium/${userId}`);
    expect(response.statusCode).to.be.eql(200);
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

  it('[GET] /api/session/current - Should return current logged user with PREMIUM role', async () => {
    const response = await requester
      .get('/api/session/current')
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.be.eql(200);
    expect(response.body.payload.email).to.be.eql('germanrocky@gmail.com');
    expect(response.body.payload.role).to.be.eql('premium');
  });

  it('[POST] /api/products - Should create a new product', async () => {
    const mockProduct = {
      title: 'velas',
      description: 'velas ricas en aromas',
      code: 'mock',
      price: 222,
      stock: 2,
      category: 'test',
      status: true,
      thumbnails: [],
    };

    const response = await requester
      .post('/api/products')
      .send(mockProduct)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.be.eql(201);
  });

  it('[DELETE] /api/products/:pid - Should delete a product', async () => {
    const product = await productModel.findOne({ code: 'mock' }).lean();
    const productId = product._id.toString();
    const response = await requester
      .delete(`/api/products/${productId}`)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    const deletedProduct = await productModel.findOne({ code: 'mock' }).lean();
    expect(response.statusCode).to.be.eql(200);
    expect(deletedProduct).to.be.eql(null);
  });

  after(async () => {
    await userModel.findOneAndDelete({ email: 'germanrocky@gmail.com' });
    await productModel.findOneAndDelete({ code: 'mock' });
  });
});
