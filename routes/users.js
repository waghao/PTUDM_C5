var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

/* GET users listing. Requires `mod` permission */
router.get(
  '/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllUser();
      CreateSuccessRes(res, 200, users);
    } catch (error) {
      next(error);
    }
  }
);

/* GET user by id. Requires `mod` permission (except for own user) */
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(403).send({
        success: false,
        message: "Cannot view own user profile",
      });
    }
    let user = await userController.GetUserById(req.params.id);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

/* CREATE user. Requires `admin` permission */
router.post(
  '/',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let newUser = await userController.CreateAnUser(
        body.username,
        body.password,
        body.email,
        body.role
      );
      CreateSuccessRes(res, 200, newUser);
    } catch (error) {
      next(error);
    }
  }
);

/* UPDATE user. Requires `admin` permission */
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updateUser = await userController.UpdateUser(req.params.id, req.body);
      CreateSuccessRes(res, 200, updateUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
