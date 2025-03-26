var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

/* GET categories listing. No login required */
router.get('/', async function (req, res, next) {
  let categories = await categoryModel.find({});
  res.status(200).send({
    success: true,
    data: categories,
  });
});

/* GET category by id. No login required */
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: 'Category not found',
    });
  }
});

/* CREATE category. Requires `admin` permission */
router.post(
  '/',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newCategory = new categoryModel({
        name: req.body.name,
      });
      await newCategory.save();
      res.status(200).send({
        success: true,
        data: newCategory,
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: error.message,
      });
    }
  }
);

/* UPDATE category. Requires `admin` permission */
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updateObj = {};
      let body = req.body;
      if (body.name) {
        updateObj.name = body.name;
      }
      let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
      res.status(200).send({
        success: true,
        data: updatedCategory,
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: error.message,
      });
    }
  }
);

/* DELETE category. Requires `admin` permission */
router.delete(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let category = await categoryModel.findById(req.params.id);
      if (category) {
        let deletedCategory = await categoryModel.findByIdAndUpdate(
          req.params.id,
          {
            isDeleted: true,
          },
          { new: true }
        );
        res.status(200).send({
          success: true,
          data: deletedCategory,
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'Category not found',
        });
      }
    } catch (error) {
      res.status(404).send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
