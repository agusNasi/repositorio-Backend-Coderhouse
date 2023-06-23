const HTTP_STATUS = require('../constants/api.constants.js');
const { apiSuccessResponse } = require('../utils/api.utils.js');
const {
  AddUserDTO,
  GetSimpleUserDTO,
  UpdateUserDTO,
} = require('../models/dtos/users.dto.js');
const UsersService = require('../services/users.service.js');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/enviroment.config.js');
const HttpError = require('../utils/error.utils.js');

const usersService = new UsersService();

class UsersController {
  static async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      const usersPayload = [];
      users.forEach((user) => {
        usersPayload.push(new GetSimpleUserDTO(user));
      });
      const response = apiSuccessResponse(usersPayload);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    const { uid } = req.params;
    try {
      const user = await usersService.getById(uid);
      const userPayload = new GetSimpleUserDTO(user);
      const response = apiSuccessResponse(userPayload);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getByEmail(req, res, next) {
    const { email } = req.params;
    try {
      const user = await usersService.getByEmail(email);
      const userPayload = new GetSimpleUserDTO(user);
      const response = apiSuccessResponse(userPayload);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async addUser(req, res, next) {
    const payload = req.body;
    const { file } = req;
    try {
      const userPayload = new AddUserDTO(payload);
      const newUser = await usersService.createUser(userPayload, file);
      req.logger.info('New user created');
      const response = apiSuccessResponse(newUser);
      return res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async addDocuments(req, res, next) {
    const { uid } = req.params;
    const { file } = req;
    const { doctype } = req.headers;
    try {
      const newUser = await usersService.addDocuments(uid, file, doctype);
      req.logger.info('New document added');
      const response = apiSuccessResponse(newUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    const { uid } = req.params;
    const payload = req.body;
    try {
      const userPayload = new UpdateUserDTO(payload);
      const updatedUser = await usersService.updateUser(uid, userPayload);
      req.logger.info('User updated');
      const response = apiSuccessResponse(updatedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    const { password, token } = req.body;
    try {
      let email;
      jwt.verify(token, SECRET_KEY, (error, decodedToken) => {
        if (error) {
          req.logger.info('Invalid Token:', error.message);
          throw new HttpError('Expired token', HTTP_STATUS.FORBIDDEN);
        } else {
          email = decodedToken.email;
        }
      });
      const updatedUser = await usersService.updatePassword(
        email,
        password,
        token
      );
      req.logger.info('Password updated');
      const response = apiSuccessResponse(updatedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async changeRole(req, res, next) {
    const { uid } = req.params;
    try {
      const updatedUser = await usersService.updateUserRole(uid);
      req.logger.info('User role updated');
      const response = apiSuccessResponse(updatedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteInactiveUsers(req, res, next) {
    try {
      const deletedUsers = await usersService.deleteInactive();
      req.logger.info('Inactive users deleted');
      const response = apiSuccessResponse(deletedUsers);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    const { uid } = req.params;
    try {
      const deletedUser = await usersService.deleteUser(uid);
      req.logger.info('User deleted');
      const response = apiSuccessResponse(deletedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
