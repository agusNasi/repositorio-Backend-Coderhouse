const { expect } = require('chai');
const supertest = require('supertest');
const cartModel = require('../../src/models/schemas/cart.model.js');
const userModel = require('../../src/models/schemas/user.model.js');
const productModel = require('../../src/models/schemas/product.model.js');

const requester = supertest('http://localhost:8080');

describe('Carts routes testing', async () => {
  let cartId;
  let productId;
  let cookie;

  it('[POST] /api/carts - Should create a new cart', async () => {
    const response = await requester.post('/api/carts');
    cartId = response.body.payload._id;
    expect(response.statusCode).to.be.eql(201);
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
    const product = await productModel.findOne({ code: 'mock' });
    productId = product._id.toString();
    expect(response.statusCode).to.be.eql(201);
  });

  it('[PUT] api/carts/:cid/product/:pid - Should return 403 avoiding premium users to add their own products', async () => {
    const response = await requester
      .put(`/api/carts/${cartId}/product/${productId}`)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    const cart = await cartModel.findById(cartId);
    expect(cart.products.length).to.be.equal(0);
    expect(response.statusCode).to.be.eql(403);
    expect(response.body.description).to.be.eql('Can not add own products');
  });

  after(async () => {
    await cartModel.findByIdAndDelete(cartId);
    await productModel.findByIdAndDelete(productId);
    await userModel.findOneAndDelete({ email: 'germanrocky@gmail.com' });
  });
});
