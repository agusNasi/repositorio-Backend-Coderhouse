const getDaos = require('../models/daos/factory');
const CartsService = require('../services/carts.service.js');
const ProductsService = require('../services/products.service.js');
const TicketsService = require('../services/tickets.service.js');
const UsersService = require('../services/users.service');

const { chatsDao, ticketsDao } = getDaos();

const productsService = new ProductsService();
const cartsService = new CartsService();
const ticketsService = new TicketsService();
const usersService = new UsersService();

class ViewsController {
  static async register(req, res, next) {
    res.render('register', {
      title: 'Sign Up!',
      styles: 'register.css',
    });
  }

  static async login(req, res, next) {
    res.render('login', {
      title: 'Login',
      styles: 'login.css',
    });
  }

  static async recover(req, res, next) {
    res.render('recover', {
      title: 'Recover your password',
      styles: 'recover.css',
    });
  }

  static async products(req, res, next) {
    const { user } = req;
    const filter = req.query;
    try {
      const products = await productsService.getProducts(filter);
      const admin = user.role === 'admin';
      res.render('index', {
        title: 'E-commerce',
        styles: 'index.css',
        products: products,
        user: user,
        admin: admin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cart(req, res, next) {
    const { cid } = req.params;
    const { user } = req;
    try {
      const cart = await cartsService.getCartById(cid);
      const admin = user.role === 'admin';
      res.render('cart', {
        title: 'Cart',
        styles: 'cart.css',
        user,
        cart,
        admin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async users(req, res, next) {
    const { user } = req;
    try {
      const admin = user.role === 'admin';
      const usersList = await usersService.getAll();
      res.render('users', {
        title: 'Usuarios',
        styles: 'users.css',
        user,
        usersList,
        admin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async chat(req, res, next) {
    try {
      const messages = await chatsDao.getAll();
      res.render('chat', {
        title: 'Super Chat!',
        styles: 'chat.css',
        messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async ticket(req, res, next) {
    const { tid } = req.params;
    try {
      const ticket = await ticketsService.getTicketById(tid);
      res.render('ticket', {
        title: 'Purchase Ticket',
        styles: 'ticket.css',
        ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async passwordForm(req, res, next) {
    const { token } = req.query;
    try {
      res.render('newPasswordForm', {
        title: 'Generate new password',
        styles: 'passwordform.css',
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ViewsController;
