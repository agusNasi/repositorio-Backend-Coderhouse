const HTTP_STATUS = require('../constants/api.constants.js');
const MailController = require('../controllers/mail.controller.js');
const getDaos = require('../models/daos/factory.js');
const { createHash, isValidPassword } = require('../utils/bcrypt.utils.js');
const HttpError = require('../utils/error.utils.js');
const MailService = require('./mail.service.js');

const { usersDao, cartsDao } = getDaos();

const mailService = new MailService();

class UsersService {
  async getAll() {
    const users = await usersDao.getAll();
    return users;
  }

  async getById(uid) {
    if (!uid) {
      throw new HttpError('Must provide an id', HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getById(uid);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async getByEmail(email) {
    if (!email) {
      throw new HttpError('Must provide an email', HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getByEmail(email);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async createUser(payload, file) {
    if (!Object.keys(payload).length) {
      throw new HttpError('Missing data for user', HTTP_STATUS.BAD_REQUEST);
    }
    if (file) {
      const paths = {
        path: file.path,
        originalName: file.originalname,
      };
      payload.profilePic = paths;
    }
    const newCart = await cartsDao.add();
    payload.cart = newCart._id;
    const newUser = await usersDao.addUser(payload);
    return newUser;
  }

  async addDocuments(uid, file, doctype) {
    if (!file || !doctype) {
      throw new HttpError('Missing document', HTTP_STATUS.BAD_REQUEST);
    }
    const paths = {
      name: file.originalname,
      reference: file.path,
      doctype,
    };
    const user = await usersDao.getById(uid);
    const userPayload = {
      documents: [...user.documents, paths],
    };
    const allDocTypes = ['id', 'address', 'account_status'];
    const allDocuments = allDocTypes.every((type) => {
      return userPayload.documents.some(
        (document) => document.doctype === type
      );
    });
    if (allDocuments) {
      userPayload.status = true;
    }
    const updatedUser = await usersDao.updateUser(uid, userPayload);
    return updatedUser;
  }

  async updateUser(uid, payload) {
    if (!uid || !Object.keys(payload).length) {
      throw new HttpError('Missing data for user', HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getById(uid);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    const updatedUser = await usersDao.updateUser(uid, payload);
    return updatedUser;
  }

  async updatePassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new HttpError(
        'Email and password are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const user = await usersDao.getByEmail(email);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    if (isValidPassword(user, newPassword)) {
      throw new HttpError(
        'The new password can not be the same that the previous one',
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const newHashedPassword = createHash(newPassword);
    console.log(newHashedPassword);
    const newUser = {
      password: newHashedPassword,
    };
    const updatedUser = await usersDao.updateUser(user._id, newUser);
    return updatedUser;
  }

  async updateUserRole(uid) {
    if (!uid) {
      throw new HttpError('Must provide an id', HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getById(uid);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    let newRole = {};
    if (user.role === 'user') {
      newRole.role = 'premium';
    }
    if (user.role === 'premium') {
      newRole.role = 'user';
    }
    const updatedUser = await usersDao.updateUser(uid, newRole);
    return updatedUser;
  }

  async deleteInactive() {
    const users = await usersDao.getAll();
    const date = new Date();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const inactiveUsers = users.filter((user) => {
      if (date.getTime() - user.last_connection.getTime() > twoDaysMs) {
        return user;
      }
    });
    inactiveUsers.forEach((iUser) => {
      mailService.notifyDeletion(iUser.email, iUser.first_name);
      usersDao.deleteUser(iUser._id);
    });
  }

  async deleteUser(uid) {
    if (!uid) {
      throw new HttpError('Must provide an id', HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getById(uid);
    if (!user) {
      throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    const deletedUser = await usersDao.deleteUser(uid);
    return deletedUser;
  }
}

module.exports = UsersService;
