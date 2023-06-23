const { Router } = require('express');
const uploader = require('../../utils/multer.utils');
const UsersController = require('../../controllers/users.controller');
const passportCall = require('../../middlewares/passport.middleware.js');
const { roleMiddleware } = require('../../middlewares/role.middleware.js');

const router = Router();

router.get(
  '/',
  passportCall('jwt'),
  roleMiddleware(['admin']),
  UsersController.getAll
);
router.get('/:uid', UsersController.getById);
router.post('/', uploader.single('file'), UsersController.addUser);
router.post(
  '/:uid/documents',
  uploader.single('file'),
  UsersController.addDocuments
);
router.put('/generatenewpassword', UsersController.updatePassword);
router.put('/premium/:uid', UsersController.changeRole);
router.put('/:uid', UsersController.updateUser);
router.delete(
  '/',
  passportCall('jwt'),
  roleMiddleware(['admin']),
  UsersController.deleteInactiveUsers
);
router.delete('/:uid', UsersController.deleteUser);

module.exports = router;
